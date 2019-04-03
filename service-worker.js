let appCache = 'v1'; 

let cacheFiles = [
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './data/restaurants.json',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(appCache)
            .then( cache => cache.addAll(cacheFiles))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheFiles => {
            return Promise.all(cacheFiles.filter(cacheFile => {
                return cacheFile.startsWith('restaurant-') && cacheFile != appCache;})
                .map(cacheFile => caches.delete(cacheFile)
                )
            );
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            if (response) {
                return response;
            }
            else {
                return fetch(e.request)
                .then(response => {
                    let clonedResponse = response.clone()
                    caches.open(appCache).then(cache => {
                        cache.put(e.request, clonedResponse);
                    })
                    return response;
                })
                .catch(err => {
                    console.log(err);
                })
            }
        })
    )
})