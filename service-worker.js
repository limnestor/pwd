var cacheName = 'pwa-for-pwd';

var filesToCache = 
[
	'/pwd',
	'/pwd/index.html',
	'/pwd/css/semantic.min.css',
	'/pwd/css/style.css',
	'/pwd/js/scripts.js',
	'/pwd/js/semantic.min.js'
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
				);
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
				);
	}
);
