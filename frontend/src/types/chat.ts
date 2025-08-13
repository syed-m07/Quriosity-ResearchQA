export interface QaRequest {
    question: string;
    documentId: number;
}

export interface QaResponse {
    answer: string;
    sources: Source[];
    success: boolean;
    document_id: string;
    processing_info: ProcessingInfo;
}

export interface QaHistoryResponse {
    question: string;
    answer: string;
    timestamp: string;
}

export interface Source {
    text: string;
    metadata: string;
    relevance_score: number;
    section_type: string;
}

export interface ProcessingInfo {
    chunks_used: number;
    question_processed: boolean;
    model_used: string;
}