const version = 1;
const staticCache = `static v${version}`;

const shell = [
   '/',
   '/favicon.ico',
   '/public/img/vantage-logo.png',
   'https://fonts.googleapis.com/icon?family=Material+Icons',
   'https://fonts.googleapis.com/css?family=Open+Sans',
];

self.addEventListener('install', (event) => {
   event.waitUntil(
      caches.open(staticCache).then((cache) => {
         cache.addAll(shell);
      })
   );
});

self.addEventListener('activate', (event) => {
   console.log('Activating service worker');
   self.clients.claim();
});

self.addEventListener('fetch', (event) => {
   const url = event.request.url.replace(self.origin, '');

   if (shell.includes(url)) {
      event.respondWith(caches.match(event.request));
   }
});

// self.addEventListener('install', (event) => {
//    event.waitUntil(
//       caches.open(static).then((cache) => {
//          let css = ['app', 'dynamic', 'main'];
//          let js = ['main', 'material.min'];
//          const cdn = [
//             'https://fonts.googleapis.com/css?family=Roboto:400,700',
//             'https://fonts.googleapis.com/icon?family=Material+Icons',
//          ];

//          css = css.map((val) => `/src/css/${val}.css`);
//          js = js.map((val) => `/src/js/${val}.js`);

//          cache.addAll(['/', '/index.html', ...css, ...js, ...cdn]);
//       })
//    );
// });

// self.addEventListener('activate', (event) => {
//    event.waitUntil(
//       caches.keys().then((keys) =>
//          Promise.all(
//             keys.map((key) => {
//                if (key !== static && key !== dynamic) caches.delete(key);
//             })
//          )
//       )
//    );

//    self.clients.claim();
// });

// self.addEventListener('fetch', (event) => {
//    event.respondWith(
//       caches.match(event.request).then(async (res1) => {
//          if (res1) {
//             return res1;
//          } else {
//             const url = new URL(event.request.url);

//             return fetch(url).then(async (res2) => {
//                try {
//                   const cache = await caches.open(dynamic);
//                   cache.put(url, res2.clone());
//                   return res2;
//                } catch (error) {}
//             });
//          }
//       })
//    );
// });
