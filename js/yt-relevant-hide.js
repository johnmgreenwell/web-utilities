// ==UserScript==
// @name         yt-relevant-hide
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide youtube most relevant section on youtube subscriptions page
// @author       John Greenwell (adapted)
// @match        *://www.youtube.com/feed/subscriptions
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Collect and exclude using query selector elements
    const hideMostRelevant = () => {
        if (window.location.pathname !== '/feed/subscriptions') return;

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

    // Limit operational load (Fixed: now captures trailing edge changes)
    function throttle(fn, delay = 500) {
        let timeoutId = null;
        return () => {
            if (timeoutId) return;
            timeoutId = setTimeout(() => { fn(); timeoutId = null; }, delay);
        };
    }

    // Execute and maintain observation for dynamic page content
    const run = throttle(hideMostRelevant);
    run();
    new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('yt-navigate-finish', run);
})();

// EOF
