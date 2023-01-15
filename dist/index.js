function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
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

  var _useState5 = React.useState([]),
      downloadURL = _useState5[0],
      setDownloadURL = _useState5[1];

  var _useState6 = React.useState(null),
      errorMessage = _useState6[0],
      setErrorMessage = _useState6[1];

  var _useState7 = React.useState(false),
      loading = _useState7[0],
      setLoading = _useState7[1];

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

  var onUploadComplete = function onUploadComplete() {
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

  var lastFile = file[file.length - 1];

  var onRemove = function onRemove(_file) {
    return setFiles(file.filter(function (e) {
      return e !== _file;
    }));
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
    remove: onRemove,
    uploadComplete: onUploadComplete,
    downloadURL: downloadURL,
    isCompleted: uploadStatus[lastFile === null || lastFile === void 0 ? void 0 : lastFile.name] === 'success'
  };
};

exports.DownloadURLProvider = DownloadURLProvider;
exports.useDownloadURL = useDownloadURL;
exports.useFileUpload = useFileUpload;
//# sourceMappingURL=index.js.map
