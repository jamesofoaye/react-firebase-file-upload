import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
/** Firebase File Upload Hook */
export var useFileUpload = function (storage, _a) {
    var accept = _a.accept, multiple = _a.multiple, path = _a.path;
    var _b = useState([]), file = _b[0], setFiles = _b[1];
    var _c = useState({}), uploadProgress = _c[0], setUploadProgress = _c[1];
    var _d = useState({}), uploadStatus = _d[0], setUploadStatus = _d[1];
    var _e = useState([]), downloadURL = _e[0], setDownloadURL = _e[1];
    var _f = useState(null), errorMessage = _f[0], setErrorMessage = _f[1];
    var _g = useState(false), loading = _g[0], setLoading = _g[1];
    useEffect(function () {
        if (!storage) {
            return setErrorMessage('No firebase storage instance provided');
        }
        if (!accept) {
            return setErrorMessage('No accepted file types provided, provide an array of file types you want to accept (e.g. "image/png, image/jpeg)');
        }
        return setErrorMessage(null);
    }, [storage, accept]);
    // disappear error message after 5 seconds if error message contains unsupported file type
    useEffect(function () {
        if (errorMessage === null || errorMessage === void 0 ? void 0 : errorMessage.includes('Unsupported file type')) {
            var timer_1 = setTimeout(function () {
                setErrorMessage(null);
            }, 5000);
            return function () { return clearTimeout(timer_1); };
        }
        return;
    }, [errorMessage]);
    /** onChange event to set selected files */
    var onSelectFile = function (event) {
        var selectedFiles = event.target.files;
        var selectedFilesArray = Array.from(selectedFiles || []);
        // prevent selecting unsupported files
        if ((accept === null || accept === void 0 ? void 0 : accept.length) > 0) {
            var unsupportedFiles_1 = selectedFilesArray.filter(function (file) { return !accept.includes(file.type); });
            if (unsupportedFiles_1.length > 0) {
                setErrorMessage("Unsupported file type: ".concat(unsupportedFiles_1[0].type));
                var remainingFiles_1 = selectedFilesArray.filter(function (file) { return !unsupportedFiles_1.includes(file); });
                return setFiles(function (previousFile) { return previousFile.concat(remainingFiles_1); });
            }
            // prevent selecting multiple files if multiple is false
            if (!multiple) {
                return setFiles(selectedFilesArray.slice(0, 1));
            }
            return setFiles(function (previousFile) { return previousFile.concat(selectedFilesArray); });
        }
    };
    // reset states when finished uploading
    var onUploadComplete = function () {
        setFiles([]);
        setUploadProgress({});
        setUploadStatus({});
        setErrorMessage('');
    };
    // upload files to firebase storage
    var onUpload = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function (i) {
                        var _path, storageRef, uploadTask_1, state_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _path = path ? "".concat(path, "/").concat(file[i].name) : file[i].name;
                                    storageRef = ref(storage, _path);
                                    if (!(uploadStatus[file[i].name] === undefined)) return [3 /*break*/, 2];
                                    // enable loading
                                    setLoading(true);
                                    uploadTask_1 = uploadBytesResumable(storageRef, file[i]);
                                    uploadTask_1.on('state_changed', {
                                        next: function (snapshot) {
                                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                            // upload progress for each file
                                            setUploadProgress(function (prevProgress) {
                                                var _a;
                                                return (__assign(__assign({}, prevProgress), (_a = {}, _a[file[i].name] = progress, _a)));
                                            });
                                            switch (snapshot.state) {
                                                case 'paused':
                                                    console.log('Upload is paused');
                                                    break;
                                                case 'running':
                                                    console.log('Upload is running');
                                                    break;
                                            }
                                        },
                                        error: function (error) {
                                            // A full list of error codes is available at
                                            // https://firebase.google.com/docs/storage/web/handle-errors
                                            switch (error.code) {
                                                case 'storage/unauthorized':
                                                    // User doesn't have permission to access the object
                                                    setErrorMessage("User doesn't have permission to access the object");
                                                    setLoading(false);
                                                    break;
                                                case 'storage/canceled':
                                                    // User canceled the upload
                                                    setErrorMessage('User canceled the upload');
                                                    setLoading(false);
                                                    break;
                                                // ...
                                                case 'storage/unknown':
                                                    // Unknown error occurred, inspect error.serverResponse
                                                    setErrorMessage('Unknown error occurred, inspect error.serverResponse');
                                                    setLoading(false);
                                                    break;
                                            }
                                        },
                                        complete: function () {
                                            // Upload completed successfully, now we can get the download URL
                                            getDownloadURL(uploadTask_1.snapshot.ref).then(function (download_url) {
                                                // download url for each file
                                                setDownloadURL(function (prevURL) { return __spreadArray(__spreadArray([], prevURL, true), [download_url], false); });
                                                // stop loading
                                                setLoading(false);
                                            });
                                        }
                                    });
                                    return [4 /*yield*/, uploadTask_1];
                                case 1:
                                    state_1 = (_b.sent()).state;
                                    setUploadStatus(function (prevStatus) {
                                        var _a;
                                        return (__assign(__assign({}, prevStatus), (_a = {}, _a[file[i].name] = state_1, _a)));
                                    });
                                    _b.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < file.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // last element in the file array
    var lastFile = file[file.length - 1];
    /** Remove a file from preview */
    var onRemove = function (_file) { return setFiles(file.filter(function (e) { return e !== _file; })); };
    return {
        type: 'file',
        accept: accept || "image/png, image/jpeg",
        multiple: multiple || false,
        disabled: !storage,
        onChange: onSelectFile,
        files: file,
        loading: loading,
        error: errorMessage,
        progress: uploadProgress,
        status: uploadStatus,
        onUpload: onUpload,
        onRemove: onRemove,
        onUploadComplete: onUploadComplete,
        downloadURL: downloadURL,
        isCompleted: uploadStatus[lastFile === null || lastFile === void 0 ? void 0 : lastFile.name] === 'success'
    };
};
//# sourceMappingURL=index.js.map