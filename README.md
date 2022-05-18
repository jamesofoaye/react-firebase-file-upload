# react-firebase-file-upload

>  Firebase File Upload

[![NPM](https://img.shields.io/npm/v/react-firebase-file-upload.svg)](https://www.npmjs.com/package/react-firebase-file-upload) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-firebase-file-upload
```

## Usage

```jsx
import React, { useContext } from 'react'
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { FirebaseFileUploader, DownloadURLContext } from 'react-firebase-fileuploader'
import 'react-firebase-fileuploader/dist/index.css'

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
  apiKey: '<your-api-key>',
  authDomain: '<your-auth-domain>',
  databaseURL: '<your-database-url>',
  storageBucket: '<your-storage-bucket-url>'
};
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp);

const App = () => {
  //file download url array for files uploaded
  const  { downloadURL }  = useContext(DownloadURLContext)

  console.log('Download URL: ' + downloadURL)

  return (
    <>
      <FirebaseFileUploader
        // accepted files types
        accept={["image/*", "application/*"]}
        // allow multiple files
        multiple={true}
        // directory to store the files
        path={'files'}
        // your firebase storage instance.
        storage={storage}
      />
    </>
    
    {downloadURL && downloadURL.map((url, index) => (
       <img
          key={index}
          src={url} 
          alt="uploaded"
       />
    ))}
  )
}

export default App
```

## License

MIT © [jamesofoaye](https://github.com/jamesofoaye)
