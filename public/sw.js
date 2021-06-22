/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/sw.js":
/*!**********************!*\
  !*** ./src/js/sw.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var version = 1;\nvar staticCache = \"static v\".concat(version);\nvar shell = ['/', '/favicon.ico', '/public/img/vantage-logo.svg', 'https://fonts.googleapis.com/icon?family=Material+Icons', 'https://fonts.googleapis.com/css?family=Open+Sans'];\nself.addEventListener('install', function (event) {\n  event.waitUntil(caches.open(staticCache).then(function (cache) {\n    cache.addAll(shell);\n  }));\n});\nself.addEventListener('activate', function (event) {\n  console.log('Activating service worker');\n  self.clients.claim();\n});\nself.addEventListener('fetch', function (event) {\n  var url = event.request.url.replace(self.origin, '');\n\n  if (shell.includes(url)) {\n    event.respondWith(caches.match(event.request));\n  }\n}); // self.addEventListener('install', (event) => {\n//    event.waitUntil(\n//       caches.open(static).then((cache) => {\n//          let css = ['app', 'dynamic', 'main'];\n//          let js = ['main', 'material.min'];\n//          const cdn = [\n//             'https://fonts.googleapis.com/css?family=Roboto:400,700',\n//             'https://fonts.googleapis.com/icon?family=Material+Icons',\n//          ];\n//          css = css.map((val) => `/src/css/${val}.css`);\n//          js = js.map((val) => `/src/js/${val}.js`);\n//          cache.addAll(['/', '/index.html', ...css, ...js, ...cdn]);\n//       })\n//    );\n// });\n// self.addEventListener('activate', (event) => {\n//    event.waitUntil(\n//       caches.keys().then((keys) =>\n//          Promise.all(\n//             keys.map((key) => {\n//                if (key !== static && key !== dynamic) caches.delete(key);\n//             })\n//          )\n//       )\n//    );\n//    self.clients.claim();\n// });\n// self.addEventListener('fetch', (event) => {\n//    event.respondWith(\n//       caches.match(event.request).then(async (res1) => {\n//          if (res1) {\n//             return res1;\n//          } else {\n//             const url = new URL(event.request.url);\n//             return fetch(url).then(async (res2) => {\n//                try {\n//                   const cache = await caches.open(dynamic);\n//                   cache.put(url, res2.clone());\n//                   return res2;\n//                } catch (error) {}\n//             });\n//          }\n//       })\n//    );\n// });\n\n//# sourceURL=webpack:///./src/js/sw.js?");

/***/ }),

/***/ 1:
/*!****************************!*\
  !*** multi ./src/js/sw.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/js/sw.js */\"./src/js/sw.js\");\n\n\n//# sourceURL=webpack:///multi_./src/js/sw.js?");

/***/ })

/******/ });