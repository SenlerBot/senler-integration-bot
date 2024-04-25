/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class IntegrationConnect {
  constructor() {
    this.requests = {};
    this.subscribers = [];
    this.timeout_sec = 50;
    let onmessage = e => {
      // if (!this.isValidSource(e.origin, this.currIntegration.url_callback)){
      //     alert('Запрос с интеграции не корректен');
      //     return false;
      // }
      console.log('integration .onmessage ', 'e.origin=', e.origin, e.data);
      let message = e.data;
      if (message.hasOwnProperty('request') && message.hasOwnProperty('response')) {
        //full
        this.handleResponse(message);
      } else {
        if (message.hasOwnProperty('request')) {
          this.handleRequest(message);
        }
      }
    };
    if (window.addEventListener) {
      window.addEventListener('message', onmessage, false);
    } else if (window.attachEvent) {
      window.attachEvent('onmessage', onmessage);
    }
    setInterval(() => {
      let time = new Date().getTime();
      for (let id in this.requests) {
        if (this.requests.hasOwnProperty(id)) {
          let request = this.requests[id];
          if (time > request.time + this.timeout_sec * 1000) {
            request['response'] = {
              success: false,
              payload: {},
              message: "timeout",
              code: 1000
            };
            console.log('timeout request=', request);
            this.handleResponse(request);
          }
        }
      }
    }, 5000);
  }
  route(type, callback) {
    this.subscribers.push({
      type: type,
      callback: callback
    });
  }
  send() {
    console.log('.send', this);
    window.parent.postMessage(JSON.parse(JSON.stringify(this)), '*');
  }
  handleRequest(message) {
    console.log('integration .handleRequest', message);
    let response = {
      success: true,
      payload: {}
    };
    message.send = this.send;
    message.response = response;
    try {
      for (let subscriber of this.subscribers) {
        if (subscriber.type === message.request.type) {
          subscriber.callback(message);
        }
      }
    } catch (e) {
      response.success = false;
      response.error = e.message;
    }
    message.response = response;

    // window.parent.postMessage(JSON.parse(JSON.stringify(message)), '*');
  }
  handleResponse(message) {
    console.log('integration .handleResponse message=', message);
    if (message.id && this.requests.hasOwnProperty(message.id)) {
      let request = this.requests[message.id];
      request.callback(message.response);
      delete this.requests[message.id];
    } else {
      console.log('.handleResponse');
    }
  }
  sendRequest(_message) {
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => {};
    try {
      let id = new Date().getTime();
      let message = {};
      message.id = id;
      message.callback = callback;
      message.request = _message;
      this.requests[id] = message;
      console.log('integration sendRequest ', message);
      window.parent.postMessage(JSON.parse(JSON.stringify(message)), '*');
    } catch (e) {
      console.log('.sendRequest', e);
    }
  }
  isValidSource(url_source, url_integration) {
    return this.getHost(url_source) === this.getHost(url_integration);
  }
  getHost(url) {
    let a = document.createElement('a');
    a.href = url;
    return a.hostname;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IntegrationConnect);

//# sourceMappingURL=bundle.js.map