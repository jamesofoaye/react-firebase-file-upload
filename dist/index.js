function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var storage = require('firebase/storage');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

var DownloadURLContext = React.createContext();
var DownloadURLProvider = function DownloadURLProvider(_ref) {
  var children = _ref.children;

  var _useState = React.useState([]),
      downloadURL = _useState[0],
      setDownloadURL = _useState[1];

  return /*#__PURE__*/React__default.createElement(DownloadURLContext.Provider, {
    value: {
      downloadURL: downloadURL,
      setDownloadURL: setDownloadURL
    }
  }, children);
};
var useDownloadURL = function useDownloadURL() {
  var _useContext = React.useContext(DownloadURLContext),
      downloadURL = _useContext.downloadURL,
      setDownloadURL = _useContext.setDownloadURL;

  return {
    downloadURL: downloadURL,
    setDownloadURL: setDownloadURL
  };
};
var useFileUpload = function useFileUpload(storage$1, _ref2) {
  var accept = _ref2.accept,
      multiple = _ref2.multiple,
      path = _ref2.path;

  var _useState2 = React.useState([]),
      file = _useState2[0],
      setFiles = _useState2[1];

  var _useState3 = React.useState({}),
      uploadProgress = _useState3[0],
      setUploadProgress = _useState3[1];

  var _useState4 = React.useState({}),
      uploadStatus = _useState4[0],
      setUploadStatus = _useState4[1];

  var _useState5 = React.useState(null),
      errorMessage = _useState5[0],
      setErrorMessage = _useState5[1];

  var _useState6 = React.useState(false),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var _useDownloadURL = useDownloadURL(),
      setDownloadURL = _useDownloadURL.setDownloadURL;

  React.useEffect(function () {
    if (!storage$1) {
      return setErrorMessage('No firebase storage instance provided');
    }

    if (!path) {
      return setErrorMessage('No path provided');
    }

    if (!accept) {
      return setErrorMessage('No accepted file types provided, provide an array of file types you want to accept');
    }

    return setErrorMessage(null);
  }, [storage$1, path, accept]);
  React.useEffect(function () {
    if (errorMessage !== null && errorMessage !== void 0 && errorMessage.includes('Unsupported file type')) {
      var timer = setTimeout(function () {
        setErrorMessage(null);
      }, 3000);
      return function () {
        return clearTimeout(timer);
      };
    }
  }, [errorMessage]);

  var onSelectFile = function onSelectFile(event) {
    var selectedFiles = event.target.files;
    var selectedFilesArray = Array.from(selectedFiles);

    if ((accept === null || accept === void 0 ? void 0 : accept.length) > 0) {
      var unsupportedFiles = selectedFilesArray.filter(function (file) {
        return !accept.includes(file.type);
      });

      if (unsupportedFiles.length > 0) {
        setErrorMessage("Unsupported file type: " + unsupportedFiles[0].type);
        var remainingFiles = selectedFilesArray.filter(function (file) {
          return !unsupportedFiles.includes(file);
        });
        return setFiles(function (previousFile) {
          return previousFile.concat(remainingFiles);
        });
      }

      if (!multiple) {
        return setFiles(selectedFilesArray.slice(0, 1));
      }

      return setFiles(function (previousFile) {
        return previousFile.concat(selectedFilesArray);
      });
    }
  };

  var onFinishUpload = function onFinishUpload() {
    setFiles([]);
    setUploadProgress({});
    setUploadStatus({});
    setErrorMessage('');
  };

  var onUpload = function onUpload() {
    try {
      return Promise.resolve(_forTo(file, function (i) {
        var storageRef = storage.ref(storage$1, path + "/" + file[i].name);

        var _temp = function () {
          if (uploadStatus[file[i].name] === undefined) {
            setLoading(true);
            var uploadTask = storage.uploadBytesResumable(storageRef, file[i]);
            uploadTask.on('state_changed', function (snapshot) {
              var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
              setUploadProgress(function (prevProgress) {
                var _extends2;

                return _extends({}, prevProgress, (_extends2 = {}, _extends2[file[i].name] = progress, _extends2));
              });

              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;

                case 'running':
                  console.log('Upload is running');
                  break;
              }
            }, function (error) {
              switch (error.code) {
                case 'storage/unauthorized':
                  setErrorMessage("User doesn't have permission to access the object");
                  setLoading(false);
                  break;

                case 'storage/canceled':
                  setErrorMessage('User canceled the upload');
                  setLoading(false);
                  break;

                case 'storage/unknown':
                  setErrorMessage('Unknown error occurred, inspect error.serverResponse');
                  setLoading(false);
                  break;
              }
            }, function () {
              storage.getDownloadURL(uploadTask.snapshot.ref).then(function (download_url) {
                setDownloadURL(function (prevURL) {
                  return [].concat(prevURL, [download_url]);
                });
                setLoading(false);
              });
            });
            return Promise.resolve(uploadTask).then(function (_uploadTask) {
              var state = _uploadTask.state;
              setUploadStatus(function (prevStatus) {
                var _extends3;

                return _extends({}, prevStatus, (_extends3 = {}, _extends3[file[i].name] = state, _extends3));
              });
            });
          }
        }();

        if (_temp && _temp.then) return _temp.then(function () {});
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return {
    type: 'file',
    accept: accept,
    multiple: multiple,
    disabled: !storage$1 || !path || !accept,
    onChange: onSelectFile,
    files: file,
    loading: loading,
    error: errorMessage,
    progress: uploadProgress,
    status: uploadStatus,
    upload: onUpload,
    finishUpload: onFinishUpload
  };
};
var FirebaseFileUploader = function FirebaseFileUploader(_ref3) {
  var storage$1 = _ref3.storage,
      accept = _ref3.accept,
      multiple = _ref3.multiple,
      path = _ref3.path;

  var _useState7 = React.useState([]),
      file = _useState7[0],
      setFiles = _useState7[1];

  var _useState8 = React.useState({}),
      uploadProgress = _useState8[0],
      setUploadProgress = _useState8[1];

  var _useState9 = React.useState({}),
      uploadStatus = _useState9[0],
      setUploadStatus = _useState9[1];

  var _useState10 = React.useState(null),
      errorMessage = _useState10[0],
      setErrorMessage = _useState10[1];

  var _useState11 = React.useState(false),
      loading = _useState11[0],
      setLoading = _useState11[1];

  var _useDownloadURL2 = useDownloadURL(),
      setDownloadURL = _useDownloadURL2.setDownloadURL;

  React.useEffect(function () {
    if (!storage$1) {
      return setErrorMessage('No firebase storage instance provided');
    }

    if (!path) {
      return setErrorMessage('No path provided');
    }

    if (!accept) {
      return setErrorMessage('No accepted file types provided, provide an array of file types you want to accept');
    }

    return setErrorMessage(null);
  }, [storage$1, path, accept]);
  React.useEffect(function () {
    if (errorMessage !== null && errorMessage !== void 0 && errorMessage.includes('Unsupported file type')) {
      var timer = setTimeout(function () {
        setErrorMessage(null);
      }, 3000);
      return function () {
        return clearTimeout(timer);
      };
    }
  }, [errorMessage]);

  var onSelectFile = function onSelectFile(event) {
    var selectedFiles = event.target.files;
    var selectedFilesArray = Array.from(selectedFiles);

    if ((accept === null || accept === void 0 ? void 0 : accept.length) > 0) {
      var unsupportedFiles = selectedFilesArray.filter(function (file) {
        return !accept.includes(file.type);
      });

      if (unsupportedFiles.length > 0) {
        setErrorMessage("Unsupported file type: " + unsupportedFiles[0].type);
        var remainingFiles = selectedFilesArray.filter(function (file) {
          return !unsupportedFiles.includes(file);
        });
        return setFiles(function (previousFile) {
          return previousFile.concat(remainingFiles);
        });
      }

      if (!multiple) {
        return setFiles(selectedFilesArray.slice(0, 1));
      }

      return setFiles(function (previousFile) {
        return previousFile.concat(selectedFilesArray);
      });
    }
  };

  var onFinishUpload = function onFinishUpload() {
    setFiles([]);
    setUploadProgress({});
    setUploadStatus({});
    setErrorMessage('');
  };

  var onUpload = function onUpload() {
    try {
      return Promise.resolve(_forTo(file, function (i) {
        var storageRef = storage.ref(storage$1, path + "/" + file[i].name);

        var _temp2 = function () {
          if (uploadStatus[file[i].name] === undefined) {
            setLoading(true);
            var uploadTask = storage.uploadBytesResumable(storageRef, file[i]);
            uploadTask.on('state_changed', function (snapshot) {
              var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
              setUploadProgress(function (prevProgress) {
                var _extends4;

                return _extends({}, prevProgress, (_extends4 = {}, _extends4[file[i].name] = progress, _extends4));
              });

              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;

                case 'running':
                  console.log('Upload is running');
                  break;
              }
            }, function (error) {
              switch (error.code) {
                case 'storage/unauthorized':
                  setErrorMessage("User doesn't have permission to access the object");
                  setLoading(false);
                  break;

                case 'storage/canceled':
                  setErrorMessage('User canceled the upload');
                  setLoading(false);
                  break;

                case 'storage/unknown':
                  setErrorMessage('Unknown error occurred, inspect error.serverResponse');
                  setLoading(false);
                  break;
              }
            }, function () {
              storage.getDownloadURL(uploadTask.snapshot.ref).then(function (download_url) {
                setDownloadURL(function (prevURL) {
                  return [].concat(prevURL, [download_url]);
                });
                setLoading(false);
              });
            });
            return Promise.resolve(uploadTask).then(function (_uploadTask2) {
              var state = _uploadTask2.state;
              setUploadStatus(function (prevStatus) {
                var _extends5;

                return _extends({}, prevStatus, (_extends5 = {}, _extends5[file[i].name] = state, _extends5));
              });
            });
          }
        }();

        if (_temp2 && _temp2.then) return _temp2.then(function () {});
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("section", {
    className: "text-black pb-4 mx-2 bg-white rounded-md overflow-y-auto h-auto"
  }, /*#__PURE__*/React__default.createElement("label", {
    className: "flex cursor-pointer border-2 border-cyan-500 justify-center items-center rounded-xl w-44 h-12 text-lg text-cyan-500 font-semibold"
  }, /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className: "h-6 w-6 mr-2",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
  }, /*#__PURE__*/React__default.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
  })), "Choose Files", /*#__PURE__*/React__default.createElement("input", {
    type: "file",
    name: "files",
    onChange: onSelectFile,
    multiple: multiple,
    accept: accept,
    className: "hidden",
    disabled: !storage$1 || !path || !accept
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "flex flex-wrap justify-center mt-4"
  }, errorMessage && /*#__PURE__*/React__default.createElement("p", {
    className: "text-red-600 text-center"
  }, errorMessage)), file === null || file === void 0 ? void 0 : file.map(function (files, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      className: "border-b border-slate-800"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "flex py-2"
    }, /*#__PURE__*/React__default.createElement("button", {
      onClick: function onClick() {
        setFiles(file.filter(function (e) {
          return e !== files;
        }));
      },
      className: "flex items-center justify-center translate-x-3 -translate-y-1 border text-md text-white font-bold border-white bg-red-600 text-center h-6 w-6 rounded-full"
    }, "X"), files.type === 'application/pdf' ? /*#__PURE__*/React__default.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      x: "0",
      y: "0",
      enableBackground: "new 0 0 303.188 303.188",
      version: "1.1",
      viewBox: "0 0 303.188 303.188",
      xmlSpace: "preserve",
      height: "40px",
      width: "40px"
    }, /*#__PURE__*/React__default.createElement("path", {
      fill: "#E8E8E8",
      d: "M219.821 0L32.842 0 32.842 303.188 270.346 303.188 270.346 50.525z"
    }), /*#__PURE__*/React__default.createElement("path", {
      fill: "#FB3449",
      d: "M230.013 149.935c-3.643-6.493-16.231-8.533-22.006-9.451-4.552-.724-9.199-.94-13.803-.936-3.615-.024-7.177.154-10.693.354-1.296.087-2.579.199-3.861.31a93.594 93.594 0 01-3.813-4.202c-7.82-9.257-14.134-19.755-19.279-30.664 1.366-5.271 2.459-10.772 3.119-16.485 1.205-10.427 1.619-22.31-2.288-32.251-1.349-3.431-4.946-7.608-9.096-5.528-4.771 2.392-6.113 9.169-6.502 13.973-.313 3.883-.094 7.776.558 11.594.664 3.844 1.733 7.494 2.897 11.139a165.324 165.324 0 003.588 9.943 171.593 171.593 0 01-2.63 7.603c-2.152 5.643-4.479 11.004-6.717 16.161l-3.465 7.507c-3.576 7.855-7.458 15.566-11.815 23.02-10.163 3.585-19.283 7.741-26.857 12.625-4.063 2.625-7.652 5.476-10.641 8.603-2.822 2.952-5.69 6.783-5.941 11.024-.141 2.394.807 4.717 2.768 6.137 2.697 2.015 6.271 1.881 9.4 1.225 10.25-2.15 18.121-10.961 24.824-18.387 4.617-5.115 9.872-11.61 15.369-19.465l.037-.054c9.428-2.923 19.689-5.391 30.579-7.205 4.975-.825 10.082-1.5 15.291-1.974 3.663 3.431 7.621 6.555 11.939 9.164 3.363 2.069 6.94 3.816 10.684 5.119 3.786 1.237 7.595 2.247 11.528 2.886 1.986.284 4.017.413 6.092.335 4.631-.175 11.278-1.951 11.714-7.57.134-1.72-.237-3.228-.98-4.55zm-110.869 10.31a170.827 170.827 0 01-6.232 9.041c-4.827 6.568-10.34 14.369-18.322 17.286-1.516.554-3.512 1.126-5.616 1.002-1.874-.11-3.722-.937-3.637-3.065.042-1.114.587-2.535 1.423-3.931.915-1.531 2.048-2.935 3.275-4.226 2.629-2.762 5.953-5.439 9.777-7.918 5.865-3.805 12.867-7.23 20.672-10.286-.449.71-.897 1.416-1.34 2.097zm27.222-84.26a38.169 38.169 0 01-.323-10.503 24.858 24.858 0 011.038-4.952c.428-1.33 1.352-4.576 2.826-4.993 2.43-.688 3.177 4.529 3.452 6.005 1.566 8.396.186 17.733-1.693 25.969-.299 1.31-.632 2.599-.973 3.883a121.219 121.219 0 01-1.648-4.821c-1.1-3.525-2.106-7.091-2.679-10.588zm16.683 66.28a236.508 236.508 0 00-25.979 5.708c.983-.275 5.475-8.788 6.477-10.555 4.721-8.315 8.583-17.042 11.358-26.197 4.9 9.691 10.847 18.962 18.153 27.214.673.749 1.357 1.489 2.053 2.22-4.094.441-8.123.978-12.062 1.61zm61.744 11.694c-.334 1.805-4.189 2.837-5.988 3.121-5.316.836-10.94.167-16.028-1.542-3.491-1.172-6.858-2.768-10.057-4.688-3.18-1.921-6.155-4.181-8.936-6.673 3.429-.206 6.9-.341 10.388-.275 3.488.035 7.003.211 10.475.664 6.511.726 13.807 2.961 18.932 7.186 1.009.833 1.331 1.569 1.214 2.207z"
    }), /*#__PURE__*/React__default.createElement("path", {
      fill: "#FB3449",
      d: "M227.64 25.263L32.842 25.263 32.842 0 219.821 0z"
    }), /*#__PURE__*/React__default.createElement("g", {
      fill: "#A4A9AD"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M126.841 241.152c0 5.361-1.58 9.501-4.742 12.421-3.162 2.921-7.652 4.381-13.472 4.381h-3.643v15.917H92.022v-47.979h16.606c6.06 0 10.611 1.324 13.652 3.971 3.041 2.647 4.561 6.41 4.561 11.289zm-21.856 6.235h2.363c1.947 0 3.495-.546 4.644-1.641 1.149-1.094 1.723-2.604 1.723-4.529 0-3.238-1.794-4.857-5.382-4.857h-3.348v11.027zM175.215 248.864c0 8.007-2.205 14.177-6.613 18.509s-10.606 6.498-18.591 6.498h-15.523v-47.979h16.606c7.701 0 13.646 1.969 17.836 5.907 4.189 3.938 6.285 9.627 6.285 17.065zm-13.455.46c0-4.398-.87-7.657-2.609-9.78-1.739-2.122-4.381-3.183-7.926-3.183h-3.773v26.877h2.888c3.939 0 6.826-1.143 8.664-3.43 1.837-2.285 2.756-5.78 2.756-10.484zM196.579 273.871h-12.766v-47.979h28.355v10.403h-15.589v9.156h14.374v10.403h-14.374v18.017z"
    })), /*#__PURE__*/React__default.createElement("path", {
      fill: "#D1D3D3",
      d: "M219.821 50.525L270.346 50.525 219.821 0z"
    })) : /*#__PURE__*/React__default.createElement("img", {
      src: URL.createObjectURL(files),
      height: "40px",
      width: "40px",
      alt: "Preview"
    }), /*#__PURE__*/React__default.createElement("p", {
      className: "truncate my-auto px-4"
    }, files.name)), uploadProgress[files.name] && /*#__PURE__*/React__default.createElement("div", {
      className: "relative mb-1 px-1"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "flex items-center justify-end"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "text-md font-semibold inline-block"
    }, Math.round(uploadProgress[files.name]), "%"))), /*#__PURE__*/React__default.createElement("div", {
      className: "overflow-hidden h-2 mb-1 text-xs flex rounded bg-white"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 rounded-full",
      style: {
        width: Math.round(uploadProgress[files.name]) + "%"
      }
    }))));
  }), file.length > 0 && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "flex"
  }, !loading ? /*#__PURE__*/React__default.createElement("button", {
    className: "bg-cyan-500 hover:shadow-lg shadow-cyan-500/50 flex text-white font-bold py-2 px-4 rounded mt-5",
    onClick: onUpload
  }, /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className: "h-6 w-6 mr-2",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2
  }, /*#__PURE__*/React__default.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
  })), "Upload") : /*#__PURE__*/React__default.createElement("button", {
    className: "py-2 px-4 rounded mt-5 flex justify-center items-center bg-cyan-500 hover:shadow-lg shadow-cyan-500/50 text-white text-center"
  }, /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "20",
    fill: "currentColor",
    className: "mr-2 animate-spin",
    viewBox: "0 0 1792 1792",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
  })), "Uploading"), uploadStatus[file[0].name] === 'success' && /*#__PURE__*/React__default.createElement("button", {
    className: "bg-cyan-500 hover:shadow-lg shadow-cyan-500/50 flex text-white font-bold py-2 px-4 rounded mt-5 mx-2",
    onClick: onFinishUpload
  }, "Done")))));
};
FirebaseFileUploader.propTypes = {
  storage: PropTypes.object.isRequired,
  accept: PropTypes.array.isRequired,
  multiple: PropTypes.bool,
  path: PropTypes.string.isRequired
};

exports.DownloadURLProvider = DownloadURLProvider;
exports.FirebaseFileUploader = FirebaseFileUploader;
exports.useDownloadURL = useDownloadURL;
exports.useFileUpload = useFileUpload;
//# sourceMappingURL=index.js.map
