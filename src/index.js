import React, { useState, createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import pdf from './pdf.png';

export const DownloadURLContext = createContext();

export const DownloadURLProvider = ({ children }) => {
  const [downloadURL, setDownloadURL] = useState([]);

  return (
    <DownloadURLContext.Provider value={{downloadURL, setDownloadURL}}>
      {children}
    </DownloadURLContext.Provider>
  );
};

export const FirebaseFileUploader = ({ storage, accept, multiple, path }) => {
  const [file, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({})
  const [errorMessage, setErrorMessage] = useState(!storage ? 'No firebase storage instance provided' : null);
  const [loading, setLoading] = useState(false)

  const { setDownloadURL } = useContext(DownloadURLContext);

  useEffect(() => {
    if (!storage) {
      setErrorMessage('No firebase storage instance provided');
    } else if(!path) {
      setErrorMessage('No path provided');
    } else setErrorMessage(null);
  }, [storage, path]);

  /** onChange event to set selected files */
  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    setFiles((previousFile) => previousFile.concat(selectedFilesArray));
  };

  /** reset states when finished uploading */
  const onFinishUpload = () => {
    setFiles([])
    setUploadProgress({})
    setUploadStatus({})
    setErrorMessage('')
  };

  /** upload files to firebase storage */
  const onUpload = async () => {

    for (let i = 0; i < file.length; i++) {
      const storageRef = ref(storage,  `${path}/${file[i].name}`);

      if(uploadStatus[file[i].name] === undefined) {
        //enable loading
        setLoading(true)

        const uploadTask = uploadBytesResumable(storageRef, file[i]);
            
        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          //upload progress for each file
          setUploadProgress(prevProgress => ({
            ...prevProgress,
            [file[i].name]: progress
          }));
              
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              setErrorMessage('User doesn\'t have permission to access the object')
              setLoading(false)
              break;
            case 'storage/canceled':
              // User canceled the upload
              setErrorMessage('User canceled the upload')
              setLoading(false)
              break;

              // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              setErrorMessage('Unknown error occurred, inspect error.serverResponse')
              setLoading(false)
              break;
          }
        }, 
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((download_url) => {
            //download url for each file
            setDownloadURL(prevURL => [...prevURL, download_url])
            
            //stop loading
            setLoading(false)
          });
        });

        //upload status
        const state = (await uploadTask).state;

        setUploadStatus(prevStatus => ({
          ...prevStatus,
          [file[i].name]: state
        }))
      }
    }
  };

  return (
    <div>
      <section className="text-black my-8 pb-4 mx-2 bg-white rounded-md max-w-md overflow-y-auto h-auto">
        <label 
          className="flex cursor-pointer border-2 border-cyan-500 mx-auto justify-center items-center rounded-xl w-44 h-12 text-lg text-cyan-500 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
          Choose Files
          <input
            type="file"
            name="files"
            onChange={onSelectFile}
            multiple={multiple}
            accept={accept}
            className='hidden'
            disabled={!storage || !path}
          />
        </label>

        <div className="flex flex-wrap justify-center mt-4">
          {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}
        </div>

        {file?.map((files, index) => {
          return (
            <div key={index} className="border-b border-slate-800">
              <div className="flex py-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    setFiles(file.filter((e) => e !== files));
                  }}
                  className='flex items-center justify-center translate-x-3 -translate-y-1 border text-md text-white font-bold border-white bg-red-600 text-center h-6 w-6 rounded-full'
                >
                  X
                </button>

                <img 
                  src={files.type === 'application/pdf' ? pdf : URL.createObjectURL(files)}
                  height="50" 
                  width="50" 
                  alt="Preview"
                />

                <p className='truncate my-auto px-4'>{files.name}</p>
              </div>

              {uploadProgress[files.name] && (
                <div className="relative mb-1 px-1">
                  <div className="flex items-center justify-end">
                    <div className="text-right">
                      <span className="text-md font-semibold inline-block">
                        {Math.round(uploadProgress[files.name])}%   
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-white">
                    <div 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green rounded-full" 
                      style={{ width: `${Math.round(uploadProgress[files.name])}%` }}
                    >
                    </div>
                  </div>                                    
                </div>
              )}
            </div>
          )}
        )}

        {file.length > 0 && (
          <React.Fragment>
            <div className="flex">
              {!loading ? (
                <button 
                  className="bg-cyan-500 hover:shadow-lg shadow-cyan-500/50 flex text-white font-bold py-2 px-4 rounded mt-5 mx-auto"
                  onClick={onUpload}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </button>
              ): (
                <button 
                  className="py-2 px-4 rounded mt-5 mx-auto flex justify-center items-center bg-cyan-500 hover:shadow-lg shadow-cyan-500/50 text-white text-center"
                >
                  <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                    <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                    </path>
                  </svg>
                  Uploading
                </button>
              )}

              {/** Reset States When Done Uploading */}
              {uploadStatus[file[0].name] === 'success' && (
                <button
                  className="bg-cyan-500 hover:shadow-lg shadow-cyan-500/50 flex text-white font-bold py-2 px-4 rounded mt-5 mx-auto"
                  onClick={onFinishUpload}
                >
                  Done
                </button>
              )}
            </div>
          </React.Fragment>
        )}
      </section>
    </div>
  )
}

FirebaseFileUploader.propTypes = {
  /** firebase storage instance. */
  storage: PropTypes.object.isRequired,
  /** accepted files types. */
  accept: PropTypes.string,
  /** allow multiple files */
  multiple: PropTypes.bool,
  /** directory to store the files */
  path: PropTypes.string.isRequired,
}