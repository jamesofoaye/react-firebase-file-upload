import React from 'react'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { useFileUpload } from 'react-firebase-file-upload'

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
  apiKey: '<your-api-key>',
  authDomain: '<your-auth-domain>',
  storageBucket: '<your-storage-bucket-url>'
}
const firebaseApp = initializeApp(firebaseConfig)

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp)

const App = () => {
  const _input = useFileUpload(storage, {
    // the type of files to upload
    accept: 'image/png, image/jpeg, image/jpg, image/webp',
    // whether to accept multiple files or just one
    multiple: true,
    // where you want to save the uploaded files in firebase storage
    path: `profile-pictures`
  })

  // props for file input
  const {
    /** Input type */
    type,
    /** Accepted file types (e.g. "image/png, image/jpeg") */
    accept,
    /** Allow multiple files to be selected */
    multiple,
    /** Disable input */
    disabled,
    /** onChange event to set selected files */
    onChange,
    /** Selected files */
    files,
    /** Loading state */
    loading,
    /** Error message */
    error,
    /** Upload progress for each file */
    progress,
    /** Upload status for each file */
    status,
    /** Download URL for each file */
    downloadURL,
    /** Upload complete state */
    isCompleted,
    /** Upload files to firebase storage */
    onUpload,
    /** Reset states when finished uploading */
    onUploadComplete,
    /** Remove file from selected files */
    onRemove
  } = _input

  return (
    <>
      <input
        type={type}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        data-testid='input'
      />

      {files &&
        files.map((file, index) => (
          <div key={index}>
            {file.type?.includes('image') && (
              <img
                src={URL.createObjectURL(file)}
                alt='preview'
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover'
                }}
              />
            )}
            <p>{file.name}</p>
            <p>{file.size}</p>
            <p>{file.type}</p>
            <button onClick={() => onRemove(file)}>Remove</button>
          </div>
        ))}
      {loading && <p>Loading...</p>}

      {error && <p>Error: {error}</p>}

      {status && Object.keys(status).map((key, index) => (
        <p key={index}>{key}: {status[key]}</p>
      ))}

      {progress && Object.keys(progress).map((key, index) => (
        <p key={index}> {key}: {progress[key]}% </p>
      ))}

      {isCompleted && (
        <button onClick={onUploadComplete}>Upload Complete</button>
      )}

      <button onClick={onUpload}>Upload</button>

      {downloadURL && downloadURL.map((url, index) => (
        <img key={index} src={url} alt='uploaded' />
      ))}
    </>
  )
}

export default App
