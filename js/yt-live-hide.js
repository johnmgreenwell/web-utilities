// ==UserScript==
// @name         yt-live-hide
// @namespace    http://tampermonkey.net/
// @version      1.16
// @description  Hide currently active live videos on youtube subscriptions page
// @author       John Greenwell (adapted)
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Collect and exclude using compact query selector elements
    function hideElements() {
        if (!window.location.pathname.startsWith('/feed/subscriptions')) return;

        const containers = [
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-video-renderer',
            'ytd-item-section-renderer'
        ];

        document.querySelectorAll(containers.join(', ')).forEach(element => {
            if (element.style.display === 'none') return;

            // Check badge text and specific YouTube live CSS classes
            const badgeText = element.querySelector('.yt-badge-shape__text')?.textContent.toUpperCase() || '';
            const isExcluded =
                /\b(LIVE|UPCOMING|PREMIERE)\b/.test(badgeText) ||
                element.querySelector('.badge-style-type-live-now, .badge-style-type-live-now-alternate, span[aria-label*="live" i]');

            if (isExcluded) element.style.display = 'none';
        });
    }

    // Limit operational load
    function throttle(fn, delay = 300) {
        let timeoutId = null, lastArgs = null;
        return function wrapper(...args) {
            lastArgs = args;
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                timeoutId = null;
                fn.apply(this, lastArgs);
            }, delay);
        };
    }

    // Execute and maintain observation
    const run = throttle(hideElements);
    run();
    new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('yt-navigate-finish', run);
    window.addEventListener('popstate', run);
})();

// EOF
