!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=105)}({105:function(e,t,n){e.exports=n(106)},106:function(e,t){var n="static v".concat(1),o=["/","/favicon.ico","/public/img/vantage-logo.png","https://fonts.googleapis.com/icon?family=Material+Icons","https://fonts.googleapis.com/css?family=Open+Sans"];self.addEventListener("install",(function(e){e.waitUntil(caches.open(n).then((function(e){e.addAll(o)})))})),self.addEventListener("activate",(function(e){console.log("Activating service worker"),self.clients.claim()})),self.addEventListener("fetch",(function(e){var t=e.request.url.replace(self.origin,"");o.includes(t)&&e.respondWith(caches.match(e.request))}))}});