// ==UserScript==
// @name         yt-relevant-hide
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide youtube most relevant section on youtube subscriptions page
// @author       John Greenwell (adapted)
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Collect and exclude using query selector elements
    const hideMostRelevant = () => {
        if (!window.location.pathname.startsWith('/feed/subscriptions')) return;

        // Expanded selectors to handle YouTube's varied subscription shelf structures
        const spans = document.querySelectorAll('span#title, #title.ytd-rich-shelf-renderer, #title.ytd-shelf-renderer');

        // Focus the container for the target shelf and eliminate elements
        spans.forEach(span => {
            if (span.textContent.trim() === "Most relevant") {
                const shelf = span.closest('ytd-shelf-renderer, ytd-rich-section-renderer, ytd-rich-shelf-renderer');
                if (shelf && shelf.style.display !== 'none') {
                    shelf.style.display = 'none';
                }
            }
        });
    };

    // Limit operational load
    function throttle(fn, delay = 300) {
        let timeoutId = null, lastArgs = null;
        return function wrapper(...args) {
            lastArgs = args;
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                timeoutId = null;
                fn.apply(this, lastArgs);
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
