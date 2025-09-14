
import os
import pandas as pd
import json
from serpapi import GoogleSearch
from pathlib import Path
import time
from urllib.parse import urlparse, parse_qs
from llm_utils import generate_with_openrouter

class PublicationsPipeline:
    def __init__(self):
        self.serpapi_api_key = os.getenv("SERPAPI_API_KEY")
        if not self.serpapi_api_key:
            raise ValueError("SERPAPI_API_KEY environment variable not set.")
        self.output_dir = Path("./publications_data") # This directory is no longer used for persistence

    def _find_author_id(self, name: str, affiliation: str = "") -> str | None:
        query = name
        if affiliation and pd.notna(affiliation):
            query += f' {affiliation}'
        print(f"Searching for author profile with query: {query}")
        params = {
            "api_key": self.serpapi_api_key,
            "engine": "google_scholar",
            "q": query,
            "hl": "en",
        }
        try:
            search = GoogleSearch(params)
            results = search.get_dict()
        except Exception as e:
            print(f"Error calling SerpApi: {e}")
            return None

        if "profiles" in results and isinstance(results.get("profiles"), dict):
            profiles_dict = results["profiles"]
            if "authors" in profiles_dict and isinstance(profiles_dict.get("authors"), list):
                for author_profile in profiles_dict["authors"]:
                    if isinstance(author_profile, dict) and name.lower() in author_profile.get("name", "").lower() and "author_id" in author_profile:
                        print(f"Strategy 1: Found author_id '{author_profile['author_id']}' in profiles block.")
                        return author_profile["author_id"]

        if "organic_results" in results and isinstance(results.get("organic_results"), list):
            for result in results["organic_results"]:
                if not isinstance(result, dict): continue
                link = result.get("link", "")
                if "user=" in link and name.lower() in result.get("title", "").lower():
                    try:
                        parsed_url = urlparse(link);
                        author_id = parse_qs(parsed_url.query).get("user")
                        if author_id:
                            print(f"Strategy 2: Found author_id '{author_id[0]}' in an organic result link.")
                            return author_id[0]
                    except Exception as e:
                        print(f"Error parsing URL for author_id: {e}")

        if "organic_results" in results and isinstance(results.get("organic_results"), list):
            for result in results["organic_results"]:
                if not isinstance(result, dict): continue
                pub_info = result.get("publication_info", {})
                if isinstance(pub_info, dict) and "authors" in pub_info and isinstance(pub_info.get("authors"), list):
                    for author in pub_info["authors"]:
                        if isinstance(author, dict) and name.lower() in author.get("name", "").lower() and "author_id" in author:
                            print(f"Strategy 3: Found author_id '{author['author_id']}' in publication authors.")
                            return author["author_id"]
        
        print(f"Could not find a unique author_id for {name} using any strategy.")
        return None

    def _fetch_and_parse_profile(self, author_id: str, articles_limit: int = None) -> dict | None:
        all_articles = []
        params = {
            "api_key": self.serpapi_api_key,
            "engine": "google_scholar_author",
            "author_id": author_id,
            "hl": "en",
            "num": "100"
        }
        print(f"Fetching profile and articles for author_id {author_id}...")
        first_page = GoogleSearch(params).get_dict()
        if "error" in first_page: return None

        author_info = first_page.get("author", {})
        cited_by_info = first_page.get("cited_by", {})
        all_articles.extend(first_page.get("articles", []))

        pagination_data = first_page.get("serpapi_pagination")
        params.pop("cstart", None)

        while pagination_data and "next" in pagination_data:
            if articles_limit and len(all_articles) >= articles_limit:
                print(f"Reached article limit of {articles_limit}. Stopping pagination.")
                break
            try:
                next_url = pagination_data["next"]
                parsed_url = urlparse(next_url)
                start_list = parse_qs(parsed_url.query).get("start")
                if not start_list:
                    print("'start' parameter not found in next page URL. Ending pagination.")
                    break
                params["start"] = start_list[0]
            except (KeyError, TypeError) as e:
                print(f"Could not determine next page from pagination data: {e}")
                break

            print(f"Fetching next page of articles with start={params.get('start')}...")
            time.sleep(1)
            next_page = GoogleSearch(params).get_dict()
            if "articles" in next_page:
                all_articles.extend(next_page.get("articles", []))
            pagination_data = next_page.get("serpapi_pagination")

        if articles_limit:
            all_articles = all_articles[:articles_limit]

        print(f"Fetched a total of {len(all_articles)} articles.")

        total_citations, h_index, i10_index = None, None, None
        if isinstance(cited_by_info, dict) and "table" in cited_by_info and isinstance(cited_by_info.get("table"), list):
            table = cited_by_info["table"]
            if len(table) > 0 and isinstance(table[0], dict): total_citations = table[0].get("citations", {}).get("all")
            if len(table) > 1 and isinstance(table[1], dict): h_index = table[1].get("h_index", {}).get("all")
            if len(table) > 2 and isinstance(table[2], dict): i10_index = table[2].get("i10_index", {}).get("all")

        parsed_interests = []
        if isinstance(author_info, dict) and "interests" in author_info and isinstance(author_info.get("interests"), list):
            for interest in author_info["interests"]:
                if isinstance(interest, dict): parsed_interests.append(interest.get("title"))

        parsed_articles = []
        for item in all_articles:
            if not isinstance(item, dict): continue
            try: citations = int(item.get("cited_by", {}).get("value"))
            except: citations = 0
            try: year = int(item.get("year"))
            except: year = None
            parsed_articles.append({"title": item.get("title"), "link": item.get("link"), "authors": item.get("authors"), "publication": item.get("publication"), "citations": citations, "year": year})
        
        return {"author_profile": {"name": author_info.get("name"), "affiliations": author_info.get("affiliations"), "email": author_info.get("email"), "interests": parsed_interests, "thumbnail": author_info.get("thumbnail")}, "citation_metrics": {"total_citations": total_citations, "h_index": h_index, "i10_index": i10_index}, "articles": parsed_articles}

    def process_faculty_excel(self, file_path: str, articles_limit: int = None):
        df = pd.read_excel(file_path)
        processed_faculty_list = []
        for index, row in df.iterrows():
            name = row.get("name")
            university = row.get("university")
            faculty_id = row.get("id", name.replace(" ", "_").lower() if pd.notna(name) else str(index))
            if pd.isna(name): continue
            print(f"--- Processing faculty: {name} ---")
            author_id = self._find_author_id(name, university)
            if author_id:
                full_profile_data = self._fetch_and_parse_profile(author_id, articles_limit)
                if full_profile_data:
                    full_profile_data["faculty_id"] = faculty_id
                    full_profile_data["processed_at"] = pd.Timestamp.now().isoformat()
                    processed_faculty_list.append(full_profile_data)
            else:
                print(f"Skipping {name} as no profile could be found.")
        return processed_faculty_list

    async def summarize_faculty_publications(self, name: str, publications: list, from_year: int = None, to_year: int = None) -> str:
        """Generates a narrative summary for a faculty member's publications."""
        
        # Filter publications by year range
        if from_year:
            publications = [p for p in publications if p.get('year') and p.get('year') >= from_year]
        if to_year:
            publications = [p for p in publications if p.get('year') and p.get('year') <= to_year]

        if not publications:
            return f"Dr. {name} has no publications in the specified period."

        # Construct the prompt
        publication_titles = "\n".join([f"- {p['title']}" for p in publications])
        total_pubs = len(publications)
        
        prompt = f"""You are a research analyst. Based on the following publication data for Dr. {name}, generate a concise, one-paragraph narrative summary of their research focus and contributions. Mention key themes you identify from the paper titles.\n\nData:\n- Total Publications to Analyze: {total_pubs}\n- Publication Titles:\n{publication_titles}\n\nNarrative Summary:"""

        # Generate summary using the LLM utility
        summary = await generate_with_openrouter(prompt)
        return summary
