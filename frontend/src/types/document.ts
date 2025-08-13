export interface Document {
    id: number;
    fileName: string;
    uploadDate: string;
    status: 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    pythonDocumentId: string;
}