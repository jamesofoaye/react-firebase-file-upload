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
import { FirebaseFileUploader, DownloadURLContext } from 'react-firebase-fileuploader'
import 'react-firebase-fileuploader/dist/index.css'

const App = () => {
  //file download url array for files uploaded
  const  { downloadURL }  = useContext(DownloadURLContext)

  console.log('Download URL: ' + downloadURL)

  return (
    <>
      <FirebaseFileUploader
        // accepted files types
        accept="image/*"
        //allow multiple files
        multiple={true}
        // directory to store the files
        path={'images'}
        // your firebase api key
        apiKey='*************************'
        // your firebase auth domain
        authDomain='*************************'
        // your firebase project id
        projectId='*************************'
        // your firebase storage bucket
        storageBucket='*************************'
        // your firebase app id
        appId='*************************'
      />
    </>
  )
}

export default App
```

## License

MIT © [jamesofoaye](https://github.com/jamesofoaye)
