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
