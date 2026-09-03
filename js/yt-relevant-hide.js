// ==UserScript==
// @name         yt-relevant-hide
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hide youtube most relevant section on youtube subscriptions page
// @author       John Greenwell (adapted)
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const SPAN_SELECTOR = [
        'span#title:not([data-live-checked])',
        '#title.ytd-rich-shelf-renderer:not([data-live-checked])',
        '#title.ytd-shelf-renderer:not([data-live-checked])'
    ].join(', ');

    // Collect and exclude using query selector elements
    const hideMostRelevant = () => {
        if (!window.location.pathname.startsWith('/feed/subscriptions')) return;

        const spans = document.querySelectorAll(SPAN_SELECTOR);

        // Focus the container for the target shelf and eliminate elements
        spans.forEach(span => {
            span.dataset.liveChecked = 'true';
            if (span.textContent.trim() === "Most relevant") {
                const shelf = span.closest('ytd-shelf-renderer, ytd-rich-section-renderer, ytd-rich-shelf-renderer');
                if (shelf && shelf.style.display !== 'none') {
                    shelf.style.display = 'none';
                }
            }
        });
    };

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
    const run = throttle(hideMostRelevant);
    run();
    new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('yt-navigate-finish', run);
    window.addEventListener('popstate', run);
})();

// EOF
