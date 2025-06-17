import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BASE_URL } from './config';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new CacheFirst({ cacheName: 'google-fonts' }),
);

registerRoute(
    ({ url }) => url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome'),
    new CacheFirst({ cacheName: 'fontawesome' }),
);

registerRoute(
    ({ url }) => url.origin === 'https://ui-avatars.com',
    new CacheFirst({
        cacheName: 'avatars-api',
        plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
    }),
);

registerRoute(
    ({ request, url }) => {
        const baseUrl = new URL(BASE_URL);
        return url.origin === baseUrl.origin && request.destination !== 'image';
    },
    new NetworkFirst({ cacheName: 'story-api' }),
);

registerRoute(
    ({ request, url }) => {
        const baseUrl = new URL(BASE_URL);
        return url.origin === baseUrl.origin && request.destination === 'image';
    },
    new StaleWhileRevalidate({ cacheName: 'story-api-images' }),
);


self.addEventListener('push', (event) => {
    console.log('Push event received!');
    let notificationData = {};

    try {
        if (event.data) {
            notificationData = event.data.json();
        }
    } catch (e) {
        console.error('Failed to parse push data:', e);
    }
    
    const options = {
        body: notificationData.body || 'Ada cerita baru menanti kamu!',
        icon: '/TalkStory/icons/icon-x192.png',
        badge: '/TalkStory/icons/icon-x72.png',
        data: {
            url: '/#/',
        },
    };

    const promiseChain = self.registration.showNotification(
        notificationData.title || 'TalkStory',
        options
    );

    event.waitUntil(promiseChain);
});