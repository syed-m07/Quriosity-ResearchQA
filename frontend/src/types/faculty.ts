
export interface FacultySummary {
  faculty_id: string;
  name: string;
  publication_count: number;
}

export interface FacultyProfile {
  faculty_id: string;
  name: string;
  affiliations: string;
  google_scholar_author_id: string;
  thumbnail: string;
  interests: string[];
  total_citations: number;
  h_index: number;
  i10_index: number;
}

export interface Article {
  title: string;
  link: string;
  authors: string;
  publication: string;
  citations: number;
  year: number;
}
