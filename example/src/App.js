import React from 'react';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { FirebaseFileUploader, useDownloadURL } from 'react-firebase-fileuploader'
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
  // hook to get the download url
  const  { downloadURL, setDownloadURL }  = useDownloadURL();

  //reset download url array after sending download url to your database
  setDownloadURL([]);

  return (
    <>
      <FirebaseFileUploader
        // accepted files types
        accept={["image/png", "image/jpeg"]}
        // allow multiple files
        multiple={true}
        // directory to store the files
        path={'files'}
        // your firebase storage instance.
        storage={storage}
      />

      {downloadURL && downloadURL.map((url, index) => (
        <img
          key={index}
          src={url} 
          alt="uploaded"
        />
      ))}
    </>
  )
}

export default App