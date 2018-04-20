// ==UserScript==
// @name         Twith Utils
// @namespace    http://jacksp.co.uk
// @version      0.1
// @description  Add useful utilities to Twitch.tv!
// @author       ColossalPercy
// @match        *://*.twitch.tv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var src;

    if (localStorage.tmtDev == 'true') {
        src = 'http://127.0.0.1:3000/build/tu.min.js';
        console.log('TU: Dev Environment Loaded');
    } else {
        src = 'https://rawgit.com/ColossalPercy/twitch_mod_tools/master/build/tu.min.js';
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.append(script);
})();
