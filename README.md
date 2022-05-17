# react-firebase-fileuploader

>  Firebase File Uploader

[![NPM](https://img.shields.io/npm/v/react-firebase-fileuploader.svg)](https://www.npmjs.com/package/react-firebase-fileuploader) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-firebase-fileuploader
```

## Usage

```jsx
import React, { useContext } from 'react'
import { storage } from './util/firebase'
import { FirebaseFileUploader, DownloadURLContext } from 'react-firebase-fileuploader'
import 'react-firebase-fileuploader/dist/index.css'

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
