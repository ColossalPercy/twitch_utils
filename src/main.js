import components from './html/components';
import draggable from 'draggable';

let config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
};

let chatRoom;
let chatSelector;
let chatList;
let messageHistory = [''];
let currMessage = 0;
let inputSelector;
let chatSendBtn;
let onlineFriends;
let friendList = [];
let foundFriends = false;
let chatInputBtns;
let topNav;
let mainPage;

let twitchCommands = ['help', 'w', 'me', 'disconnect', 'mods', 'color', 'commercial', 'mod', 'unmod', 'ban', 'unban', 'timeout', 'untimeout', 'slow', 'slowoff', 'r9kbeta', 'r9kbetaoff', 'emoteonly', 'emoteonlyoff', 'clear', 'subscribers', 'subscribersoff', 'followers', 'followersoff', 'host', 'unhost'];
let aliases = {};
if (localStorage.tmtAliases) {
    aliases = JSON.parse(localStorage.tmtAliases);
}

let blockedEmotes = [];
if (localStorage.tmtBlockedEmotes) {
    blockedEmotes = localStorage.tmtBlockedEmotes.split(',');
}

//Mutation observer for each chat message
let chatObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(addedNode) {
            if (addedNode.nodeName == 'DIV') {
                // Moderator actions
                if (chatRoom.isCurrentUserModerator) {
                    if (addedNode.classList.contains('chat-line__message')) {
                        if (findReact(addedNode).memoizedProps.showModerationIcons === true) {
                            addPurgeButton(addedNode);
                        }
                    }
                    if (addedNode.classList.contains('viewer-card-layer__draggable')) {
                        let name = findReact(document.querySelector('.viewer-card-layer'), 2).memoizedProps.viewerCardOptions.targetLogin;
                        if (name != chatRoom.currentUserLogin) {
                            let check = setInterval(function() {
                                if (document.querySelector('.viewer-card')) {
                                    clearInterval(check);
                                    addModCard();
                                }
                            }, 50);
                        }
                    }
                }
                // All user actions
                if (addedNode.classList.contains('viewer-card-layer__draggable')) {
                    let name = findReact(document.querySelector('.viewer-card-layer'), 2).memoizedProps.viewerCardOptions.targetLogin;
                    let check = setInterval(function() {
                        if (document.querySelector('.viewer-card')) {
                            clearInterval(check);
                            addNameHistory();
                            addAge();
                            updateCardInfo(name);
                        }
                    }, 50);
                }
                if (addedNode.classList.contains('chat-line__message')) {
                    let message = findReact(addedNode);
                    let from = message.memoizedProps.message.user.userDisplayName;
                    if (localStorage.tmtHighlightFriend != 'false' && friendList.includes(from) && !(addedNode.classList.contains('ffz-mentioned'))) {
                        addedNode.classList.add('tu-highlight-friend');
                    }

                    let parts = message.memoizedProps.message.messageParts;
                    let imgs = addedNode.getElementsByTagName('img');
                    let emotes = [];
                    for (let t = 0; t < imgs.length; t++) {
                        if (imgs[t].classList.contains('chat-line__message--emote')) {
                            emotes.push(imgs[t]);
                        }
                    }
                    let emoteN = 0;
                    for (let i = 0; i < parts.length; i++) {
                        if (parts[i].type == 3) {
                            if (blockedEmotes.includes(parts[i].content.alt)) {
                                let n = parts[i].content.images.sources;
                                n['1x'] = 'https://raw.githubusercontent.com/ColossalPercy/twitch_mod_tools/master/assets/blank_28x.png';
                                n['2x'] = 'https://raw.githubusercontent.com/ColossalPercy/twitch_mod_tools/master/assets/blank_56x.png';
                                n['4x'] = 'https://raw.githubusercontent.com/ColossalPercy/twitch_mod_tools/master/assets/blank_112x.png';
                                emotes[emoteN].src = 'https://raw.githubusercontent.com/ColossalPercy/twitch_mod_tools/master/assets/blank_28x.png';
                                emotes[emoteN].srcset = '';
                            }
                            emoteN++;
                        }
                    }
                }
            }
        });
    });
});

//Mutation observer for chat loading
let chatLoaded = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        chatSelector = document.querySelector('[data-test-selector="chat-room-component-layout"]');
        if (chatSelector) {
            chatRoom = findReactChat(chatSelector);
            chatObserver.observe(chatSelector, config);
            inputSelector = document.querySelector('[data-test-selector="chat-input"]');
            inputSelector.onkeydown = checkKey;
            chatSendBtn = document.querySelector('[data-test-selector="chat-send-button"]');
            chatSendBtn.onclick = checkMessage;
            chatList = document.querySelector('.chat-list__lines').SimpleBar.contentEl.children[0];
            onlineFriends = document.querySelector('.online-friends');
            if (!foundFriends && friendList.length === 0) {
                getFriendList();
            }
            topNav = document.querySelector('.top-nav');
            mainPage = topNav.parentElement;
            if (!(document.querySelector('.tu-settings-gui'))) {
                mainPage.insertAdjacentHTML('beforeend', components.settings.gui);
				let options = {
					setCursor: true,
					limit: mainPage
				};
				new draggable(document.querySelector('.tu-settings-gui'), options);
				document.querySelector('.tu-settings-close').onclick = toggleVisibility;
            }
            chatInputBtns = document.querySelector('.chat-input__buttons-container').children[0];
            if (!(document.querySelector('.tu-settings-button'))) {
                chatInputBtns.insertAdjacentHTML('beforeend', components.icons.settings);
                document.querySelector('.tu-settings-button').onclick = toggleVisibility;
            }
        }
    });
});
chatLoaded.observe(document.body, config);

var css = document.createElement('link');
if (localStorage.tmtDev == 'true') {
    css.href = 'http://127.0.0.1:3000/src/styles/styles.css';
} else {
    css.href = 'https://rawgit.com/ColossalPercy/twitch_mod_tools/master/src/styles/styles.css';
}
css.type = 'text/css';
css.rel = 'stylesheet';
document.getElementsByTagName('head')[0].appendChild(css);

function chatPurge() {
    let name = getUserName(this.parentElement.parentElement);
    sendMessage('/timeout ' + name + ' 1');
}

function cardTimeout() {
    let name = findReact(document.querySelector('.viewer-card-layer'), 2).memoizedProps.viewerCardOptions.targetLogin;
    let time = this.getAttribute('data-tu-timeout');
    let reason = document.querySelector('.tu-ban-reason').value;
    sendMessage('/timeout ' + name + ' ' + time + ' ' + reason);
}

function sendMessage(m) {
    chatRoom.onSendMessage(m);
}

function addPurgeButton(el) {
    el.querySelector('[data-test-selector="chat-timeout-button"]').insertAdjacentHTML('afterend', components.icons.purge);
    let btn = el.querySelector('[data-test-selector="chat-purge-button"]');
    btn.addEventListener('click', chatPurge);
}

function addModCard() {
    document.querySelector('.viewer-card__actions').insertAdjacentHTML('beforeend', components.modCard.actions);
    let timeouts = document.getElementsByClassName('tu-timeout');
    for (let i = 0; i < timeouts.length; i++) {
        timeouts[i].addEventListener('click', cardTimeout);
    }
}

function getUserName(el) {
    let name;
    name = findReact(el).memoizedProps.message.user.userLogin;
    return name;
}

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38' && currMessage < (messageHistory.length - 1)) {
        // up arrow
        currMessage++;
        changeMessage();
    } else if (e.keyCode == '40' && currMessage > 0) {
        // down arrow
        currMessage--;
        changeMessage();
    } else if (e.keyCode == '13' && inputSelector.value) {
        // enter key
        checkMessage();
    } else if (e.keyCode == '9') {
        // tab key
        console.log('tab');
    }
}

function checkMessage() {
    let msg = inputSelector.value;
    if (currMessage != 0) {
        messageHistory.splice(currMessage, 1);
        currMessage = 0;
    }
    messageHistory.splice(1, 0, msg);

    if (msg.charAt(0) == '/') {
        msg = msg.substr(1);
        let parts = msg.split(' ');
        let command = parts[0].toLowerCase();

        if (twitchCommands.indexOf(command) > -1) {
            return;
        }
        findReact(inputSelector, 2).memoizedProps.onValueUpdate('');
        inputSelector.value = '';
        // check if tu command or user alias
        if (command === 'alias') {
            let err = false;
            let errTxt = 'Usage: /alias <name> <alias>';
            let name, alias;
            if (parts.length > 1) {
                name = parts[1].toLowerCase();
                alias = parts.splice(2).join(' ');
            } else {
                err = true;
            }
            if (name) {
                // check if a default twitch command
                if (twitchCommands.includes(name)) {
                    err = true;
                    errTxt = "Can't use a Twitch command as an alias!";
                } else if (name === 'delete' && alias) {
                    if (aliases.hasOwnProperty(alias)) {
                        delete aliases[alias];
                        sendStatus('Removed alias: ' + alias);
                    } else {
                        sendStatus('Alias ' + alias + ' does not exist!');
                    }
                } else if (name === 'list') {
                    if (Object.keys(aliases).length == 0) {
                        sendStatus('No current aliases.', true);
                    } else {
                        sendStatus('Current aliases:', true);
                        for (let k in aliases) {
                            let txt = k + ': ' + aliases[k];
                            sendStatus(txt, false, true);
                        }
                    }
                } else if (name === 'importffz') {
                    let splitPos = [];
                    let pos, t;
                    if (localStorage.ffz_setting_command_aliases) {
                        let f = localStorage.ffz_setting_command_aliases;
                        while (pos != -1) {
                            pos = f.indexOf('"', i + 1);
                            i = pos;
                            if (pos > 0) {
                                splitPos.push(pos);
                            }
                        }
                        for (let i = 0; i < splitPos.length; i += 4) {
                            let str1 = f.substr(splitPos[i] + 1, splitPos[i + 1] - splitPos[i] - 1).toLowerCase();
                            let str2 = f.substr(splitPos[i + 2] + 1, splitPos[i + 3] - splitPos[i + 2] - 1);
                            aliases[str1] = str2;
                        }
                        sendStatus('Imported all aliases from FFZ! Run "/alias list" to view.');
                    } else {
                        err = true;
                    }
                } else if (alias) {
                    aliases[name] = alias;
                    sendStatus('Created alias: ' + name);
                } else {
                    err = true;
                }
                localStorage.tmtAliases = JSON.stringify(aliases);
            } else {
                err = true;
            }
            if (err === true) {
                if (name === 'delete') {
                    errTxt = 'Usage: /alias delete <name>';
                } else if (name === 'importffz') {
                    errTxt = 'No FFZ aliases found!';
                }
                sendStatus(errTxt);
            }
        } else if (aliases.hasOwnProperty(command)) {
            sendMessage(aliases[command]);
        } else if (command == 'b') {
            sendMessage('/ban ' + parts.splice(1).join(' '));
        } else if (command == 'u') {
            sendMessage('/unban ' + parts.splice(1).join(' '));
        } else if (command == 'p' || command == 'purge') {
            sendMessage('/timeout ' + parts.splice(1).join(' ') + ' 1');
        } else if (command == 't') {
            let ext;
            if (parts.length == 2) {
                ext = parts[1] + ' 600';
            } else {
                ext = parts.splice(1).join(' ');
            }
            sendMessage('/timeout ' + ext);
        }
    }
}

function sendStatus(txt, b = false, i = false) {
    let sDiv = document.createElement('div');
    sDiv.setAttribute('class', 'chat-line__status');
    let sSpan = document.createElement('span');
    if (b) {
        sSpan.style.fontWeight = 'bold';
    }
    if (i) {
        sDiv.style.marginLeft = '20px';
    }
    sSpan.textContent = txt;
    sDiv.appendChild(sSpan);
    chatList.appendChild(sDiv);
    chatList.parentElement.scrollIntoView(false);
}

function getFriendList() {
    let friends = findReact(onlineFriends).memoizedProps.friends;
    for (let i = 0; i < friends.length; i++) {
        friendList[i] = friends[i].node.displayName;
    }
}

function changeMessage() {
    let newMessage = messageHistory[currMessage];
    findReact(inputSelector, 2).memoizedProps.onValueUpdate(newMessage);
    inputSelector.value = newMessage;
}

function getJSON(url, callback) {
    let xhr = new XMLHttpRequest(); // a new request
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback.apply(this, [JSON.parse(xhr.responseText)]);
        }
    };
    xhr.open("GET", url, true);
    xhr.send(null);
}

function addNameHistory() {
    let tfr = document.createElement('div');
    tfr.id = 'tu-name-container';
    tfr.setAttribute('class', 'tw-flex tw-flex-row');
    let dn = document.querySelector('.viewer-card__display-name');
    dn.children[0].classList.add('tw-flex');
    dn.appendChild(tfr);
    tfr.appendChild(dn.children[0]);
    tfr.insertAdjacentHTML('beforeend', components.viewerCard.history);
    document.querySelector('.tu-name-history-button').onclick = toggleVisibility;
}

function addAge() {
    document.querySelector('.viewer-card__banner').classList.remove('tw-align-center');
    let dn = document.querySelector('.viewer-card__display-name');
    dn.classList.remove('tw-align-items-center');
    dn.insertAdjacentHTML('beforeend', components.viewerCard.age);
}

function updateCardInfo(name) {
    callUserApi(name, updateCardAge);
}

let updateCardAge = function(data) {
    let date = data.created_at;
    getNameHistory(data._id);
    let d = new Date(date);
    let created = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    document.querySelector('.viewer-card__profile-age').innerHTML = 'Created on: ' + created;
};

function getNameHistory(id) {
    let url = 'https://twitch-tools.rootonline.de/username_changelogs_search.php?q=' + id + '&format=json';
    getJSON(url, updateNameHistory);
}

let updateNameHistory = function(data) {
    let hl = document.querySelector('.tu-name-history-list');
    hl.children[1].remove();
    if (data.length === 0) {
        let p = document.createElement('p');
        p.innerHTML = 'No name history.';
        p.setAttribute('class', 'tw-pd-l-1');
        hl.appendChild(p);
    } else {
        for (let i in data) {
            let p = document.createElement('p');
            p.innerHTML = data[i].username_old;
            p.setAttribute('class', 'tw-pd-l-1');
            hl.appendChild(p);
        }
    }
};

function callUserApi(name, callback) {
    let url = 'https://api.twitch.tv/kraken/users/' + name + '?client_id=5ojgte4x1dp72yumoc8fp9xp44nhdj';
    let data = getJSON(url, callback);
    return data;
}

function toggleVisibility() {
    let toggle = document.querySelector('.' + this.getAttribute('data-toggle'));
    if (toggle.classList.contains('tu-hidden')) {
        toggle.classList.remove('tu-hidden');
    } else {
        toggle.classList.add('tu-hidden');
    }
}

window.findReact = function(el, depth = 1) {
    for (const key in el) {
        if (key.startsWith('__reactInternalInstance$')) {
            let fiberNode = el[key];
            for (let i = 0; i < depth; i++) {
                fiberNode = fiberNode.return;
            }
            return fiberNode;
        }
    }
    return null;
};

window.findReactChat = function(el) {
    for (const key in el) {
        if (key.startsWith('__reactInternalInstance$')) {
            const fiberNode = el[key];
            return fiberNode.memoizedProps.children._owner.memoizedProps;
        }
    }
    return null;
};
