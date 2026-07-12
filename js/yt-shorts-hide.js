// ==UserScript==
// @name         yt-shorts-hide
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hide youtube shorts and section title on the subscriptions page
// @author       John Greenwell (adapted)
// @match        *://www.youtube.com/feed/subscriptions
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Collect and exclude all by using compact query selector elements
    function hideElements() {
        if (window.location.pathname !== '/feed/subscriptions') return;

        // 1. Hide entire Shorts shelves/sections
        const shelves = document.querySelectorAll('ytd-rich-section-renderer, ytd-rich-shelf-renderer');
        shelves.forEach(shelf => {
            const titleText = shelf.querySelector('#title')?.textContent.trim();
            if (titleText === "Shorts") {
                shelf.style.display = 'none';
            }
        });

        // 2. Hide stray individual Shorts elements
        const containers = [
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-video-renderer',
            'ytd-item-section-renderer'
        ];

        document.querySelectorAll(containers.join(', ')).forEach(element => {
            if (element.style.display === 'none') return;

            const isShort =
                element.querySelector('a[href*="/shorts/"], [href*="/shorts/"]') ||
                element.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]') ||
                element.querySelector('.ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]') ||
                element.querySelector('span[aria-label*="Short"]') ||
                element.querySelector('yt-icon.ytd-shorts') ||
                element.querySelector('badge-shape[aria-label*="Short"]');

            if (isShort) {
                element.style.display = 'none';
            }
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
