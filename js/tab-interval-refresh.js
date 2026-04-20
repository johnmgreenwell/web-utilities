// ==UserScript==
// @name         tab-interval-refresh.js
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Periodically refresh a website
// @author       John Greenwell (adapted)
// @match        https://example.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const refreshIntervalMins = 50; // Set interval in minutes
    const refreshIntervalMs = refreshIntervalMins * 60 * 1000;

    console.log(`[Auto-Refresh] Enabled: ${refreshIntervalMs}ms interval`);

    setTimeout(() => {
        location.reload();
    }, refreshIntervalMs);
})();

// EOF
