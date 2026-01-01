// ==UserScript==
// @name         yt-live-hide
// @namespace    http://tampermonkey.net/
// @version      1.6
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

        // Starting query selector
        const candidates = document.querySelectorAll(containers.map(tag => tag).join(', '));

        candidates.forEach(element => {
            let isLive = false;

            // Common live badge classes
            if (element.querySelector('[badge-style-type-live-now], .badge-style-type-live-now-alternate, .badge-style-type-live, #live-badge')) {
                isLive = true;
            }

            // LIVE text in badges/overlays
            const badgeTexts = element.querySelectorAll('ytd-badge-supported-renderer span, .ytd-video-renderer span');
            for (const span of badgeTexts) {
                if (span.textContent.trim().toUpperCase() === 'LIVE') {
                    isLive = true;
                    break;
                }
            }

            // Live overlay attributes or images
            if (element.querySelector('[overlay-style="LIVE"], img[alt="LIVE"], ytd-thumbnail-overlay-now-playing-equalizer')) {
                isLive = true;
            }

            // Links containing /live or pulsing indicators
            const links = element.querySelectorAll('a[href*="live"], a[href^="/live"]');
            if (links.length > 0) {
                isLive = true;
            }

            // Old ring fallback
            if (element.querySelector('.yt-spec-avatar-shape--live-ring')) {
                isLive = true;
            }

            if (isLive) {
                element.style.display = 'none';
            }
        });
    }

    function throttle(fn, delay = 200) {
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
