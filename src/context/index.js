import { createContext, useState } from "react";

export const DownloadURLContext = createContext();

export const DownloadURLProvider = ({ children }) => {
  const [downloadURL, setDownloadURL] = useState('');

  return (
    <DownloadURLContext.Provider value={{downloadURL, setDownloadURL}}>
        {children}
    </DownloadURLContext.Provider>
  );
};