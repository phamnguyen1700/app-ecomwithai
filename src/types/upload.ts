import type { UploadFileStatus } from "antd/es/upload/interface";

// Upload file states
export interface UploadFileState {
    uid: string;
    name: string;
    status: UploadFileStatus;
    url?: string;
    percent?: number;
    originFileObj?: File;
    preview?: string;
}

// Uploading state
export interface UploadingFileState extends UploadFileState {
    uid: string;
    name: string;
    status: "uploading";
    percent: number;
}

// Error state
export interface ErrorFileState extends UploadFileState {
    uid: string;
    name: string;
    status: "error";
}

// Done state
export interface DoneFileState extends UploadFileState {
    uid: string;
    name: string;
    status: "done";
    url: string;
}

// Upload progress callback
export interface UploadProgress {
    percent: number;
}

// Upload request parameters
export interface UploadRequestParams {
    file: File;
    onSuccess?: (response: any) => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: UploadProgress) => void;
}

// Upload validation result
export interface UploadValidation {
    isValid: boolean;
    error?: string;
}
