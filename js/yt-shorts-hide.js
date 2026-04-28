// ==UserScript==
// @name         yt-shorts-hide
// @namespace    http://tampermonkey.net/
// @version      1.3
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

        const titles = document.querySelectorAll('span#title, yt-formatted-string#title, ytd-rich-section-renderer, ytd-rich-shelf-renderer');
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

        titles.forEach(title => {
            if (title.textContent.trim() === "Shorts") {
                const header = title.closest('ytd-rich-shelf-header-renderer')
                            || title.closest('#header')
                            || title.closest('#title-container')
                            || title.parentElement;

                if (header && header.style.display !== 'none') {
                    header.style.setProperty('display', 'none', 'important');
                }
            }
        });
    }

    function hideElements() {
        if (window.location.pathname !== '/feed/subscriptions') return;

        const shelves = document.querySelectorAll('ytd-rich-section-renderer, ytd-rich-shelf-renderer');
        shelves.forEach(shelf => {
            const titleText = shelf.querySelector('#title')?.textContent.trim();
            if (titleText === "Shorts") {
                shelf.style.display = 'none';
            }
        });

        const containers = [
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-video-renderer'
        ];

        document.querySelectorAll(containers.join(', ')).forEach(element => {
            if (element.style.display === 'none') return;

            const isShort =
                element.querySelector('a[href*="/shorts/"]') ||
                element.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]') ||
                element.querySelector('span[aria-label*="Short"]');

            if (isShort) {
                element.style.display = 'none';
            }
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
    window.addEventListener('yt-navigate-finish', hideElements);
})();

// EOF
