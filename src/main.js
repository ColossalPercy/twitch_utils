import components from "./html/components";

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
                if (chatRoom.isCurrentUserModerator) {
                    if (addedNode.classList.contains('chat-line__message')) {
                        if (findReact(addedNode).memoizedProps.showModerationIcons === true) {
                            addPurgeButton(addedNode);
                        }
                    }
                    if (addedNode.classList.contains('viewer-card-layer__draggable')) {
                        let name = findReact(document.querySelector('.viewer-card-layer'), 2).memoizedProps.viewerCardOptions.targetLogin;
                        if (name != chatRoom.currentUserLogin)
                            cardReady(function() {
                                addModCard();
                            });
                    }
                }
                if (addedNode.classList.contains('viewer-card-layer__draggable')) {
                    cardReady(function() {
                        let name = findReact(document.querySelector('.viewer-card-layer'), 2).memoizedProps.viewerCardOptions.targetLogin;
                        let data = callUserApi(name);
                        addAge(data.created_at);
                        if (name != chatRoom.currentUserLogin) {
                            addNameHistory(data._id);
                        }
                    });
                }
                if (addedNode.classList.contains('chat-line__message')) {
                    let parts = findReact(addedNode).memoizedProps.message.messageParts;
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
            chatSendBtn = document.querySelector('[data-test-selector="chat-send-button"]');
            chatList = document.querySelector('.chat-list__lines').SimpleBar.contentEl.children[0];
            onlineFriends = document.querySelector('.online-friends');
            chatSendBtn.onclick = checkMessage;
            inputSelector.onkeydown = checkKey;
        }
    });
});
chatLoaded.observe(document.body, config);

function chatPurge() {
    let name = getUserName(this.parentElement.parentElement);
    sendMessage('/timeout ' + name + ' 1');
}

function cardTimeout() {
    let name = findReact(document.querySelector('.viewer-card-layer'), 2).memoizedProps.viewerCardOptions.targetLogin;
    let time = this.getAttribute('data-tmt-timeout');
    let reason = document.querySelector('.tmt-ban-reason').value;
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

function cardReady(callback) {
    let loaded = 0;
    let check = setInterval(function() {
        if (document.querySelector('.viewer-card')) {
            loaded++;
            clearInterval(check);
            if (loaded == 1) {
                callback();
            }
        }
    }, 100);
}

function callUserApi(name) {
    let url = 'https://api.twitch.tv/kraken/users/' + name + '?client_id=5ojgte4x1dp72yumoc8fp9xp44nhdj';
    let data = getJSON(url);
    return data;
}

function addAge(date) {
    document.querySelector('.viewer-card__banner').classList.remove('tw-align-center');
    let dn = document.querySelector('.viewer-card__display-name');
    dn.classList.remove('tw-align-items-center');
    dn.insertAdjacentHTML('beforeend', components.viewerCard.age);
    let d = new Date(date);
    let created = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    document.getElementById('viewer-card__profile-age').innerHTML = 'Created on: ' + created;
}

function addModCard() {
    document.querySelector('.viewer-card__actions').insertAdjacentHTML('beforeend', components.modCard.actions);
    let timeouts = document.getElementsByClassName('tmt-timeout');
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

        // check if tmt command or user alias
        if (command === 'alias') {

            let name = parts[1].toLowerCase();
            let alias = parts.splice(2).join(' ');

            // check if a default twitch command
            if (twitchCommands.includes(name)) {
                return;
            }
            findReact(inputSelector, 2).memoizedProps.onValueUpdate('');
            inputSelector.value = '';
            let err = false;
            let errTxt;
            if (name) {
                if (name === 'delete' && alias) {
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
                errTxt = "Usage: /alias <name> <alias>";
                if (name === 'delete') {
                    errTxt = "Usage: /alias delete <name>";
                } else if (name === 'importffz') {
                    errTxt = "No FFZ aliases found!";
                }
                sendStatus(errTxt);
            }
        } else if (aliases.hasOwnProperty(command)) {
            findReact(inputSelector, 2).memoizedProps.onValueUpdate('');
            inputSelector.value = '';
            sendMessage(aliases[command]);
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
    console.log(friendList);
}

function changeMessage() {
    let newMessage = messageHistory[currMessage];
    findReact(inputSelector, 2).memoizedProps.onValueUpdate(newMessage);
    inputSelector.value = newMessage;
}

function getJSON(url) {
    let Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", url, false);
    Httpreq.send(null);
    return JSON.parse(Httpreq.responseText);
}

function addNameHistory(id) {
    let url = 'https://twitch-tools.rootonline.de/username_changelogs_search.php?q=' + id + '&format=json';
    let data = getJSON(url);
    if (data.length > 0) {
        document.querySelector('.viewer-card__actions').children[0].children[1].insertAdjacentHTML('afterend', components.viewerCard.history);
        for (let i in data) {
            let option = document.createElement('option');
            option.text = data[i].username_old;
            document.querySelector('.tmt-name-history').add(option);
        }
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
