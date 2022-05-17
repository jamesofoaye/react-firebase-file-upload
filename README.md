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
import { storage } from './util/firebase'
import { FirebaseFileUploader, DownloadURLContext } from 'react-firebase-file-upload'
import 'react-firebase-file-upload/dist/index.css'

const App = () => {
  const  {downloadURL}  = useContext(DownloadURLContext)
  console.log('Download URL: ' + downloadURL)

  return (
    <>
      <FirebaseFileUploader
        storage={storage}
        accept=""
        multiple={true}
        folder={'images'}
      />
    </>
  )
}

export default App
```

## License

MIT © [jamesofoaye](https://github.com/jamesofoaye)
