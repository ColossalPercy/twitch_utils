var src;

if (localStorage.tmtDev == 'true'){
    src = 'http://127.0.0.1:3000/src/main.js';
    console.log('TMT: Dev Environment Loaded');
} else {
    src = 'https://rawgit.com/ColossalPercy/twitch_mod_tools/master/src/main.js';
}

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = src;
document.body.append(script);
