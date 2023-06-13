import { ChangeEvent } from 'react';
import { FirebaseStorage } from 'firebase/storage';
/** File upload options type */
interface FileUploadOptions {
    /** Accepted file types (e.g. "image/png, image/jpeg") */
    accept: string;
    /** Allow multiple files to be selected */
    multiple?: boolean;
    /** Path to upload files to */
    path?: string;
}
/** Hook return type */
interface FileUploadHook {
    /** Input type */
    type: string;
    /** Accepted file types (e.g. "image/png, image/jpeg") */
    accept: string;
    /** Allow multiple files to be selected */
    multiple: boolean;
    /** Disable input */
    disabled: boolean;
    /** onChange event to set selected files */
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    /** Selected files */
    files: File[];
    /** Loading state */
    loading: boolean;
    /** Error message */
    error: string | null;
    /** Upload progress for each file */
    progress: Record<string, number>;
    /** Upload status for each file */
    status: Record<string, string>;
    /** Download URL for each file */
    downloadURL: string[];
    /** Upload complete state */
    isCompleted: boolean;
    /** Upload files to firebase storage */
    onUpload: () => Promise<void>;
    /** Reset states when finished uploading */
    onUploadComplete: () => void;
    /** Remove file from selected files */
    onRemove: (file: File) => void;
}
/** Firebase File Upload Hook */
export declare const useFileUpload: (storage: FirebaseStorage, { accept, multiple, path }: FileUploadOptions) => FileUploadHook;
export {};
