// ==UserScript==
// @name         yt-live-hide
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Hide currently active live videos on youtube subscriptions page
// @author       John Greenwell (adapted)
// @match        *://youtube.com/*
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Collect and exclude using compact query selector elements
    function hideElements() {
    if (!window.location.hostname.match(/^(www\.)?youtube\.com$/)) return;
    if (window.location.href.includes('watch?v=')) return;

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

    // Limit operational load (Fixed: now captures trailing edge changes)
    function throttle(fn, delay = 500) {
        let timeoutId = null;
        return () => {
            if (timeoutId) return;
            timeoutId = setTimeout(() => { fn(); timeoutId = null; }, delay);
        };
    }

    // Execute and maintain observation for dynamic page content
    const run = throttle(hideElements);
    run();
    new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('yt-navigate-finish', run);
})();

// EOF
