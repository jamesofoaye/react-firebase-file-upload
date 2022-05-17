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