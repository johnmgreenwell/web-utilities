// ==UserScript==
// @name         yt-live-hide
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hide currectly active live videos on youtube subscriptions page
// @author       John Greenwell (adapted) + modification
// @match        *://youtube.com/*
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Self-restrict to youtube domains, but not watch video pages
    if (!window.location.hostname.match(/^(www\.)?youtube\.com$/)) {
        return;
    }
    if (window.location.href.includes('watch?v=')) {
        return;
    }

    // Main function: hide matching elements
    function hideElements() {
        const liveSelectors = [
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-item-section-renderer'
        ].map(tag => `${tag}:has(
            .badge-style-type-live-now-alternate,
            .yt-spec-avatar-shape--live-ring,
            ytd-badge-supported-renderer span[role="text"]:has-text(LIVE)
        )`).join(', ');

        document.querySelectorAll(liveSelectors).forEach(element => {
            element.style.display = 'none';
        });
    }

    // Throttle function (minimal implementation)
    function throttle(fn) {
        let running;
        return () => !running && (running = true, setTimeout(() => (fn(), running = false), 100));
    }

    hideElements();

    // Handle dynamically loaded content with throttling
    const observer = new MutationObserver(throttle(hideElements));
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

// EOF
