var cacheName = 'pwa-for-pwd';
var filesToCache = [
  '/pwd',
  '/pwd/index.html',
  '/pwd/js/scripts.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', 
	function(e) 
	{
		e.waitUntil(
			caches.open(cacheName)
				.then(
					function(cache) 
					{
						return cache.addAll(filesToCache);
					})
				)
				.catch(err => console.log('Error while installing assets', err));;
	}
);

/* Serve cached content when offline */
self.addEventListener('fetch', 
	function(e) 
	{
		e.respondWith(
			caches.match(e.request)
				.then(
					function(response) 
					{
						return response || fetch(e.request);
					})
				)
				.catch(err => console.log('Error while fetching assets', err));;
	}
);
