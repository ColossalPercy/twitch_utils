var src;

if (localStorage.tmtDev == 'true'){
    src = 'http://127.0.0.1:3000/build/tu.dev.js';
    console.log('TU: Dev Environment Loaded');
} else {
    src = 'https://rawgit.com/ColossalPercy/twitch_utils/master/build/tu.min.js';
}

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = src;
document.head.append(script);
