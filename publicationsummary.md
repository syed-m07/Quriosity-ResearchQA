## The feature that we have to build upon right now. theres the base of this feature already ready, we have the data extracted from the JSON objects returned by the Google Scholar API by SERP API. now the thing we have to code is the LLM summarization + Exporting the data/summary in Word/Excel. 

2️⃣ Publications Summary Generator (Faculty Profile Builder)

This is a new feature set but can integrate neatly with your system.
Think of it as a parallel pipeline to your RAG bot, but sharing some infra (frontend, backend, FastAPI).

🔧 What’s Needed:
Inputs

Faculty list (Excel/CSV) with names & maybe IDs.

Optional BibTeX files.

Possibly login to crawl from Google Scholar / DBLP APIs.

Processing

Crawling Layer

Use libraries like scholarly, serpapi, or custom scrapers to fetch publications by name + filters.

Store results in DB (separate schema/table: faculty_publications).

Data Normalization

Parse results into structured format: {title, authors, year, venue (journal/conference), citations, link}.

Tag by journal vs. conference.

Summarization & Reports

Use your existing RAG pipeline/LLM to:

Generate narrative summaries (“Dr. X has published 25 papers in journals, 12 in conferences, with a focus on …”).

Filter publications by year range.

Export reports in Excel + Word (docx).

APIs (Backend)

POST /api/v1/publications/upload-excel → upload faculty list.

GET /api/v1/publications/summary/{facultyId}?fromYear=YYYY&toYear=YYYY → get filtered summary.

GET /api/v1/publications/export/{facultyId} → download as Excel/Word.

Frontend UI

New section: Faculty Profiles.

Upload Excel → show progress (like document upload).

View publication lists & generated summaries.

Export results.


