/* eslint-disable camelcase */
import { useState, useEffect } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

// File Upload Hook
export const useFileUpload = (storage, { accept, multiple, path }) => {
  const [file, setFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadStatus, setUploadStatus] = useState({})
  const [downloadURL, setDownloadURL] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!storage) {
      return setErrorMessage('No firebase storage instance provided')
    }

    if (!path) {
      return setErrorMessage('No path provided')
    }

    if (!accept) {
      return setErrorMessage(
        'No accepted file types provided, provide an array of file types you want to accept'
      )
    }

    return setErrorMessage(null)
  }, [storage, path, accept])

  // disappear error message after 3 seconds if error message contains unsupported file type
  useEffect(() => {
    if (errorMessage?.includes('Unsupported file type')) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  /** onChange event to set selected files */
  const onSelectFile = (event) => {
    const selectedFiles = event.target.files
    const selectedFilesArray = Array.from(selectedFiles)

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
      const storageRef = ref(storage, `${path}/${file[i].name}`)

      if (uploadStatus[file[i].name] === undefined) {
        // enable loading
        setLoading(true)

        const uploadTask = uploadBytesResumable(storageRef, file[i])

        uploadTask.on(
          'state_changed',
          (snapshot) => {
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
          (error) => {
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
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((download_url) => {
              // download url for each file
              setDownloadURL((prevURL) => [...prevURL, download_url])

              // stop loading
              setLoading(false)
            })
          }
        )

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
  const onRemove = (_file) => setFiles(file.filter((e) => e !== _file))

  return {
    /** Input type */
    type: 'file',
    /** Array of accepted files to select */
    accept,
    /** boolean to enable multiple file select */
    multiple,
    /** boolean to disabled input */
    disabled: !storage || !path || !accept,
    /** onChange event handler */
    onChange: onSelectFile,
    /** Array of files selected */
    files: file,
    /** boolean to indicate upload has started or not */
    loading,
    /** Error Message */
    error: errorMessage,
    /** Object of files and their upload progress */
    progress: uploadProgress,
    /** Object of files and their upload status */
    status: uploadStatus,
    /** Start Upload */
    upload: onUpload,
    /** Remove a file from preview */
    remove: onRemove,
    /** Reset all states when all upload is completed */
    uploadComplete: onUploadComplete,
    /** Array of Download URL for each uploaded file */
    downloadURL,
    /** boolean to indicate whether all files has been uploaded succesfully */
    isCompleted: uploadStatus[lastFile?.name] === 'success'
  }
}
