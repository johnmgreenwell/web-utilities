// ==UserScript==
// @name         yt-live-hide
// @namespace    http://tampermonkey.net/
// @version      1.13
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

    function hideElements() {
        const containers = [
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-video-renderer',
            'ytd-item-section-renderer'
        ];

        // Compact query selector elements
        document.querySelectorAll(containers.join(', ')).forEach(element => {
            const badgeText = element.querySelector('.yt-badge-shape__text')?.textContent.toUpperCase() || '';
            const isExcluded =
                /LIVE|UPCOM|PREM/.test(badgeText) ||
                element.querySelector('.badge-style-type-live-now, .badge-style-type-live-now-alternate, span[aria-label*="live" i], span:has-text("LIVE")');

            if (isExcluded) element.style.display = 'none';
        });
    }

    function throttle(fn, delay = 500) {
        let running = false;
        return () => {
            if (!running) {
                running = true;
                setTimeout(() => { fn(); running = false; }, delay);
            }
        };
    }

    hideElements();

    const observer = new MutationObserver(throttle(hideElements));
    observer.observe(document.body, { childList: true, subtree: true });
})();

// EOF
