// ==UserScript==
// @name         yt-live-hide
// @namespace    http://tampermonkey.net/
// @version      1.14
// @description  Hide currently active live videos on youtube subscriptions page
// @author       John Greenwell (adapted)
// @match        *://youtube.com/*
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Halt script immediately when not required
    if (!window.location.hostname.match(/^(www\.)?youtube\.com$/)) return;
    if (window.location.href.includes('watch?v=')) return;

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

            // Check badge text and specific YouTube live CSS classes
            const badgeText = element.querySelector('.yt-badge-shape__text')?.textContent.toUpperCase() || '';
            const isExcluded =
                /\b(LIVE|UPCOMING|PREMIERE)\b/.test(badgeText) ||
                element.querySelector('.badge-style-type-live-now, .badge-style-type-live-now-alternate, span[aria-label*="live" i]');

            if (isExcluded) element.style.display = 'none';
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
