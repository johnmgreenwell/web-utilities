// ==UserScript==
// @name         yt-shorts-hide
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide youtube shorts on the subscriptions page
// @author       John Greenwell (adapted)
// @match        *://www.youtube.com/feed/subscriptions
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Only allow script to run on the scubscriptions page
    if (window.location.pathname !== '/feed/subscriptions') return;

    // Collect and exclude using compact query selector elements
    function hideElements() {
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

            if (isShort) element.style.display = 'none';
        });
    }

    // Limit operational load
    function throttle(fn, delay = 500) {
        let running = false;
        return () => {
            if (!running) {
                running = true;
                setTimeout(() => { fn(); running = false; }, delay);
            }
        };
    }

    // Execute and maintain observation for dynamic page content
    hideElements();
    const observer = new MutationObserver(throttle(hideElements));
    observer.observe(document.body, { childList: true, subtree: true });
})();

// EOF
