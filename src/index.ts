import { useState, useEffect, ChangeEvent } from 'react'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  FirebaseStorage,
  TaskState
} from 'firebase/storage'

/** File upload options type */
interface FileUploadOptions {
  /** Accepted file types (e.g. "image/png, image/jpeg") */
  accept: string
  /** Allow multiple files to be selected */
  multiple?: boolean
  /** Path to upload files to */
  path?: string
}

/** Hook return type */
interface FileUploadHook {
  /** Input type */
  type: string
  /** Accepted file types (e.g. "image/png, image/jpeg") */
  accept: string
  /** Allow multiple files to be selected */
  multiple: boolean
  /** Disable input */
  disabled: boolean
  /** onChange event to set selected files */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  /** Selected files */
  files: File[]
  /** Loading state */
  loading: boolean
  /** Error message */
  error: string | null
  /** Upload progress for each file */
  progress: {
    [fileName: string]: number
  }
  /**
   * Upload status for each file
   *
   * `running` | `paused`| `success` | `canceled` | `error`
   */
  status: { [fileName: string]: TaskState }
  /** Download URL for each file */
  downloadURL: string[]
  /** Upload complete state */
  isCompleted: boolean
  /** Upload files to firebase storage */
  onUpload: () => Promise<void>
  /** Reset states when finished uploading */
  onUploadComplete: () => void
  /** Remove file from selected files */
  onRemove: (file: File) => void
}

/** Firebase File Upload Hook */
export const useFileUpload = (
  storage: FirebaseStorage,
  { accept, multiple, path }: FileUploadOptions
): FileUploadHook => {
  const [file, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{
    [fileName: string]: number
  }>(
    {}
  )
  const [uploadStatus, setUploadStatus] = useState<{
    [fileName: string]: TaskState
  }>({})
  const [downloadURL, setDownloadURL] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!storage) {
      setErrorMessage('No firebase storage instance provided')
      return
    }

    if (!accept) {
      setErrorMessage(
        'No accepted file types provided, provide an array of file types you want to accept (e.g. "image/png, image/jpeg)'
      )
      return
    }
    return
  }, [storage, accept])

  // disappear error message after 5 seconds if error message contains unsupported file type
  useEffect(() => {
    if (errorMessage?.includes('Unsupported file type')) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
    return
  }, [errorMessage])

  /** onChange event to set selected files */
  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    const selectedFilesArray = Array.from(selectedFiles || [])

    // prevent selecting unsupported files
    if (accept?.length > 0) {
      const unsupportedFiles = selectedFilesArray.filter(
        (file) => !accept.includes(file.type)
      )

      if (unsupportedFiles.length > 0) {
        setErrorMessage(`Unsupported file type: ${unsupportedFiles[0].type}`)

        const remainingFiles = selectedFilesArray.filter(
          (file) => !unsupportedFiles.includes(file)
        )

        return setFiles((previousFile) => previousFile.concat(remainingFiles))
      }

      // prevent selecting multiple files if multiple is false
      if (!multiple) {
        return setFiles(selectedFilesArray.slice(0, 1))
      }

      return setFiles((previousFile) => previousFile.concat(selectedFilesArray))
    }
  }

  // reset states when finished uploading
  const onUploadComplete = () => {
    setFiles([])
    setUploadProgress({})
    setUploadStatus({})
    setErrorMessage('')
  }

  // upload files to firebase storage
  const onUpload = async () => {
    for (let i = 0; i < file.length; i++) {
      // path for each file in the file array (if path is provided) else just the file name as path
      const _path = path ? `${path}/${file[i].name}` : file[i].name
      const storageRef = ref(storage, _path)

      if (uploadStatus[file[i].name] === undefined) {
        // enable loading
        setLoading(true)

        const uploadTask = uploadBytesResumable(storageRef, file[i])

        uploadTask.on('state_changed', {
          next: (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100

            // upload progress for each file
            setUploadProgress((prevProgress) => ({
              ...prevProgress,
              [file[i].name]: progress
            }))

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          error: (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                setErrorMessage(
                  "User doesn't have permission to access the object"
                )
                setLoading(false)
                break
              case 'storage/canceled':
                // User canceled the upload
                setErrorMessage('User canceled the upload')
                setLoading(false)
                break

              // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                setErrorMessage(
                  'Unknown error occurred, inspect error.serverResponse'
                )
                setLoading(false)
                break
            }
          },
          complete: () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((download_url) => {
              // download url for each file
              setDownloadURL((prevURL) => [...prevURL, download_url])
              // stop loading
              setLoading(false)
            })
          }
        })

        // upload status
        const state = (await uploadTask).state

        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [file[i].name]: state
        }))
      }
    }
  }

  // last element in the file array
  const lastFile = file[file.length - 1]

  /** Remove a file from preview */
  const onRemove = (_file: File) => setFiles(file.filter((e) => e !== _file))

  return {
    type: 'file',
    accept: accept || 'image/png, image/jpeg',
    multiple: multiple || false,
    disabled: !storage,
    onChange: onSelectFile,
    files: file,
    loading: loading,
    error: errorMessage,
    progress: uploadProgress,
    status: uploadStatus,
    onUpload: onUpload,
    onRemove: onRemove,
    onUploadComplete: onUploadComplete,
    downloadURL: downloadURL,
    isCompleted: uploadStatus[lastFile?.name] === 'success'
  }
}
