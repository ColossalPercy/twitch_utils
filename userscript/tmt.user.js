// ==UserScript==
// @name         Twith Mod Tools
// @namespace    http://jacksp.co.uk
// @version      0.1
// @description  Add useful tools to Twitch.tv!
// @author       ColossalPercy
// @match        *://*.twitch.tv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var src;

    if (localStorage.tmtDev == 'true') {
        src = 'http://127.0.0.1:3000/build/tmt.min.js';
        console.log('TMT: Dev Environment Loaded');
    } else {
        src = 'https://rawgit.com/ColossalPercy/twitch_mod_tools/master/build/tmt.min.js';
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.append(script);
})();
