// ==UserScript==
// @name         yt-shorts-hide
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Hide youtube shorts and section title on the subscriptions page
// @author       John Greenwell (adapted)
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const CONTAINER_SELECTOR = [
        'ytd-rich-item-renderer',
        'ytd-grid-video-renderer',
        'ytd-compact-video-renderer',
        'ytd-video-renderer',
        'ytd-item-section-renderer'
    ].join(', ');

    // Collect and exclude using query selector elements
    function hideElements() {
        if (!window.location.pathname.startsWith('/feed/subscriptions')) return;

        // Hide entire shorts shelves/sections
        const shelves = document.querySelectorAll('ytd-rich-section-renderer, ytd-rich-shelf-renderer');
        shelves.forEach(shelf => {
            const titleText = shelf.querySelector('#title')?.textContent.trim();
            if (titleText === "Shorts") {
                shelf.style.display = 'none';
            }
        });

        // Hide stray individual shorts elements
        document.querySelectorAll(CONTAINER_SELECTOR).forEach(element => {
            // Skip elements already checked or hidden
            if (element.dataset.liveChecked === 'true' || element.style.display === 'none') return;
            element.dataset.liveChecked = 'true';

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

    // Rate-limit operational load
    function throttle(fn, delay = 300) {
        let timeoutId = null;
        return function wrapper(...args) {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                timeoutId = null;
                fn.apply(this, args);
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
