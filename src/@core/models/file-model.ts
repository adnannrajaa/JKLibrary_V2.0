export interface FileReceiverResult {
  fileName: string 
  filePath: string
  fileExtension: string 
  numberOfPages: number 
  fileSize: number 
  originalFileName: string 
}
export interface FileRequest {
  fileName: string;
  filePath: string;
}

export interface Download {
  content: Blob | null;
  progress: number;
  state: "PENDING" | "IN_PROGRESS" | "DONE";
}
export interface Upload {
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  content: any;

}
