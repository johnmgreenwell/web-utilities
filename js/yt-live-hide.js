// ==UserScript==
// @name         yt-live-hide
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide livestreams on youtube
// @author       John Greenwell (adapted)
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
        ].map(tag => `${tag}:has(.badge-style-type-live-now-alternate, .yt-spec-avatar-shape--live-ring)`).join(', ');

        document.querySelectorAll(liveSelectors).forEach(element => {
            element.style.display = 'none';
        });

        // Stream selectors
        const vodSelectors = [
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-item-section-renderer',
            'ytd-video-renderer'
        ].map(tag => `${tag}:has([aria-label*="Streamed"])`).join(', ');

        document.querySelectorAll(vodSelectors).forEach(element => {
            element.style.display = 'none';
        });

        // Backup stream selectors
        const vodBackupSelectors = [
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-item-section-renderer',
            'ytd-video-renderer'
        ].map(tag => `${tag}:not(:has([aria-label*="Streamed"]))`).join(', ');

        document.querySelectorAll(vodBackupSelectors).forEach(element => {
            const metadata = element.querySelector('#metadata-line > span:last-of-type, .yt-content-metadata-view-model__metadata-row:last-of-type');
            if (metadata && metadata.textContent.includes('Streamed')) {
                element.style.display = 'none';
            }
        });
    }

    hideElements();

    // Also handle dynamically loaded content
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

// EOF
