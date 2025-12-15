// ==UserScript==
// @name         yt-live-hide
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Hide currectly active live videos on youtube subscriptions page
// @author       John Greenwell (adapted)
// @match        *://youtube.com/*
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.hostname.match(/^(www\.)?youtube\.com$/)) return;
    if (window.location.href.includes('watch?v=')) return;

    function hideElements() {
        const liveSelectors = [
            // Common container elements
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-item-section-renderer',
            'ytd-video-renderer'
        ].map(tag => `${tag}:has(
            [badge-style-type-live-now],                      /* Common live badge class */
            .badge-style-type-live-now-alternate,             /* Old alternate */
            .badge-style-type-live,                           /* Variant without alternate */
            ytd-badge-supported-renderer span:contains(LIVE), /* Case-sensitive LIVE */
            ytd-badge-supported-renderer span:contains(Live), /* Capitalized Live */
            #live-badge,                                      /* Direct live badge ID/class */
            .yt-spec-avatar-shape--live-ring,                 /* Old ring (kept as fallback) */
            img[alt="LIVE"],                                  /* Overlay images */
            [overlay-style="LIVE"]                            /* Overlay attribute for live */
        )`).join(', ');

        // Additional broad fallback for red "LIVE" overlays or pulsing dots
        const extraSelector = 'ytd-thumbnail-overlay-now-playing-equalizer, ' +
                              'ytd-thumbnail:has(a[href*="live"]), ' +
                              '[id="thumbnail"]:has([src*="live"]), ' +
                              ':has-text(LIVE), :has-text(Live), :has-text(●)';

        document.querySelectorAll(liveSelectors + ', ' + extraSelector).forEach(element => {
            let target = element.closest('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-video-renderer');
            if (target) target.style.display = 'none';
            else element.style.display = 'none';
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
