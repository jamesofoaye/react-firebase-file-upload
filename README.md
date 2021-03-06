# react-firebase-file-upload

> Firebase V9 File Upload

[![NPM](https://img.shields.io/npm/v/react-firebase-file-upload.svg)](https://www.npmjs.com/package/react-firebase-file-upload) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-firebase-file-upload
```

## Usage

## React Applications

After installing React Firebase File Upload, you need to set up the `DownloadURLProvider` at the root of your application. This can be either in your `index.jsx` or `index.tsx`

```jsx
import React from 'react'
import { DownloadURLProvider } from 'react-firebase-file-upload'

function App() {
  // Wrap DownloadURLProvider at the root of your app
  return (
    <DownloadURLProvider>
      <App />
    </DownloadURLProvider>
  )
}
```

## Next.js Applications

Go to `pages/_app.js` or `pages/_app.tsx` (create it if it doesn't exist) and wrap the Component with the DownloadURLProvider:

```jsx
import { DownloadURLProvider } from 'react-firebase-file-upload'

function MyApp({ Component, pageProps }) {
  return (
    <DownloadURLProvider>
      <Component {...pageProps} />
    </DownloadURLProvider>
  )
}

export default MyApp
```

## Full Example

`Note` Please specify the exact file type you want to accept as shown the example below. Don't use wildcard characters such as `image/*` in accept parameter. For now, accept parameter will make sure users select `ONLY` the accepted files if you specified in full. I'm working on validating accept
parameter with wildcard characters soon.

```jsx
import React from 'react'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import {
  FirebaseFileUploader,
  useDownloadURL
} from 'react-firebase-file-upload'
import 'react-firebase-file-upload/dist/index.css'

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
  // hook to get array of download url
  const { downloadURL, setDownloadURL } = useDownloadURL()

  return (
    <>
      <FirebaseFileUploader
        // accepted files types
        accept={['image/png', 'image/jpeg', 'application/pdf']}
        // allow multiple files
        multiple={true}
        // directory to store the files
        path={'files'}
        // your firebase storage instance.
        storage={storage}
      />

      {downloadURL &&
        downloadURL.map((url, index) => (
          <img key={index} src={url} alt='uploaded' />
        ))}
    </>
  )
}

export default App
```

## Reset Download URL

Use `setDownloadURL([])` to reset downloadURL after sending download url to your database

## License

MIT ?? [jamesofoaye](https://github.com/jamesofoaye)
