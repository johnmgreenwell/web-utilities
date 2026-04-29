// ==UserScript==
// @name         yt-relevant-hide
// @namespace    http://tampermonkey.net/
// @version      1.0
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

        const spans = document.querySelectorAll('span#title.style-scope.ytd-shelf-renderer');

        // Focus the container for the target shelf and eliminate elements
        spans.forEach(span => {
            if (span.textContent.trim() === "Most relevant") {
                const shelf = span.closest('ytd-shelf-renderer');
                if (shelf && shelf.style.display !== 'none') {
                    shelf.style.display = 'none';
                }
            }
        });
    };

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
    hideMostRelevant();
    const observer = new MutationObserver(throttle(hideMostRelevant));
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('yt-navigate-finish', hideMostRelevant);
})();

// EOF
