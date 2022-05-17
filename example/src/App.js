import React from 'react'
import { storage } from './util/firebase'

import FirebaseFileUploader from 'react-firebase-fileuploader'

const App = () => {
  return (
    <div>
      <h1>Firebase File Uploader</h1>
      <FirebaseFileUploader
        storage={storage}
        accept="image/*"
        multiple={false}
        folder={'images'}
      />
    </div>
  )
}

export default App
