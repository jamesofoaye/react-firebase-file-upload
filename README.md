# react-firebase-file-upload

> Firebase V9 File Upload

[![NPM](https://img.shields.io/npm/v/react-firebase-file-upload.svg)](https://www.npmjs.com/package/react-firebase-file-upload) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-firebase-file-upload
```

## Usage

## Full Example

`Note` Please specify the exact file type you want to accept as shown the example below. Don't use wildcard characters such as `image/*` in accept parameter. For now, accept parameter will make sure users select `ONLY` the accepted files if you specified in full. I'm working on validating accept
parameter with wildcard characters soon.

```jsx
import React from 'react'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { useFileUpload } from 'react-firebase-file-upload'

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
  apiKey: '<your-api-key>',
  authDomain: '<your-auth-domain>',
  databaseURL: '<your-database-url>',
  storageBucket: '<your-storage-bucket-url>'
}
const firebaseApp = initializeApp(firebaseConfig)

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp)

const App = () => {
  const _input = useFileUpload(storage, {
    // the type of files to upload
    accept: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    // whether to accept multiple files or just one
    multiple: true,
    // where you want to save the uploaded files in firebase storage
    path: `profile-pictures`
  })

  // props for file input
  const {
    /** Input type */
    type,
    /** Array of accepted files to select */
    accept,
    /** boolean to enable multiple file select */
    multiple,
    /** boolean to disabled input */
    disabled,
    /** onChange event handler */
    onChange,
    /** Array of files selected */
    files,
    /** whether upload has started and its loading or not */
    loading,
    /** Error Message */
    error,
    /** Object of files and their upload progress */
    progress,
    /** function to start upload */
    upload,
    /** function to remove a file from preview */
    remove,
    /** function to reset all states when all upload is completed */
    uploadComplete,
    /** whether all files has been uploaded succesfully */
    isCompleted,
    /** Array of Download URL for each uploaded file */
    downloadURL
  } = _input

  return (
    <>
      <input
        type={type}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
      />

      {/* {downloadURL &&
        downloadURL.map((url, index) => (
          <img key={index} src={url} alt='uploaded' />
        ))} */}

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
            <button onClick={() => remove(file)}>Remove</button>
          </div>
        ))}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {progress &&
        Object.keys(progress).map((key, index) => (
          <p key={index}>
            {key}: {progress[key]}%
          </p>
        ))}
      {isCompleted && <button onClick={uploadComplete}>Upload Complete</button>}
      <button onClick={upload}>Upload</button>

      {downloadURL &&
        downloadURL.map((url, index) => (
          <img key={index} src={url} alt='uploaded' />
        ))}
    </>
  )
}

export default App
```

## License

MIT © [jamesofoaye](https://github.com/jamesofoaye)
