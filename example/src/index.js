import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DownloadURLProvider } from 'react-firebase-fileuploader'

ReactDOM.render(
    <DownloadURLProvider>
        <App />
    </DownloadURLProvider>, 
    document.getElementById('root')
)
