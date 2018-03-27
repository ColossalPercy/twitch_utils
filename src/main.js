import components from "./html/components";

var config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
};

var chatRoom;
var chatSelector;
var chatList;
var messageHistory = [''];
var currMessage = 0;
var inputSelector;
var chatSendBtn;


var twitchCommands = ['help', 'w', 'me', 'disconnect', 'mods', 'color', 'commercial', 'mod', 'unmod', 'ban', 'unban', 'timeout', 'untimeout', 'slow', 'slowoff', 'r9kbeta', 'r9kbetaoff', 'emoteonly', 'emoteonlyoff', 'clear', 'subscribers', 'subscribersoff', 'followers', 'followersoff', 'host', 'unhost'];
var aliases = {};
if (localStorage.tmtAliases) {
    aliases = JSON.parse(localStorage.tmtAliases);
}

//Mutation observer for each chat message
var chatObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(addedNode) {
            if (addedNode.nodeName == 'DIV') {
                if (chatRoom.isCurrentUserModerator) {
                    if (addedNode.classList.contains('chat-line__message')) {
                        if (findReact(addedNode).memoizedProps.showModerationIcons === true) {
                            addButton(addedNode);
                        }
                    }
                    if (addedNode.classList.contains('viewer-card-layer__draggable')) {
                        var name = findReact(document.querySelector('.viewer-card-layer')).return.memoizedProps.viewerCardOptions.targetLogin;
                        if (name != chatRoom.currentUserLogin)
                            cardReady(function() {
                                addModCard();
                            });
                    }
                }
                if (addedNode.classList.contains('viewer-card-layer__draggable')) {
                    cardReady(function() {
                        var name = findReact(document.querySelector('.viewer-card-layer')).return.memoizedProps.viewerCardOptions.targetLogin;
                        var data = callUserApi(name);
                        addAge(data.created_at);
                        if (name != chatRoom.currentUserLogin) {
                            addNameHistory(data._id);
                        }
                    });
                }
            }
        });
    });
});

//Mutation observer for chat loading
var chatLoaded = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        chatSelector = document.querySelector('[data-test-selector="chat-room-component-layout"]');
        if (chatSelector) {
            chatRoom = findReactChat(chatSelector);
            chatObserver.observe(chatSelector, config);
            inputSelector = document.querySelector('[data-test-selector="chat-input"]');
            chatSendBtn = document.querySelector('[data-test-selector="chat-send-button"]');
            chatList = document.querySelector('.chat-list__lines').SimpleBar.contentEl.children[0];
            chatSendBtn.onclick = checkMessage;
            inputSelector.onkeydown = checkKey;
        }
    });
});
chatLoaded.observe(document.body, config);

function chatPurge() {
    var name = getUserName(this.parentElement.parentElement);
    send('/timeout ' + name + ' 1');
}

function cardTimeout() {
    var name = findReact(document.querySelector('.viewer-card-layer')).return.memoizedProps.viewerCardOptions.targetLogin;
    var time = this.getAttribute('data-tmt-timeout');
    var reason = document.querySelector('.tmt-ban-reason').value;
    send('/timeout ' + name + ' ' + time + ' ' + reason);
}

function send(m) {
    chatRoom.onSendMessage(m);
}

function addButton(el) {
    el.querySelector('[data-a-target="chat-timeout-button"]').insertAdjacentHTML('afterend', components.icons.purge);
    var btn = el.querySelector('[data-a-target="chat-purge-button"]');
    btn.addEventListener('click', chatPurge);
}

function cardReady(callback) {
    var loaded = 0;
    var check = setInterval(function() {
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
    var url = 'https://api.twitch.tv/kraken/users/' + name + '?client_id=5ojgte4x1dp72yumoc8fp9xp44nhdj';
    var data = getJSON(url);
    return data;
}

function addAge(date) {
    document.querySelector('.viewer-card__banner').classList.remove('tw-align-center');
    var dn = document.querySelector('.viewer-card__display-name');
    dn.classList.remove('tw-align-items-center');
    dn.insertAdjacentHTML('beforeend', components.viewerCard.age);
    var d = new Date(date);
    var created = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    document.getElementById('viewer-card__profile-age').innerHTML = 'Created on: ' + created;
}

function addModCard() {
    document.querySelector('.viewer-card__actions').insertAdjacentHTML('beforeend', components.modCard.actions);
    var timeouts = document.getElementsByClassName('tmt-timeout');
    for (var i = 0; i < timeouts.length; i++) {
        timeouts[i].addEventListener('click', cardTimeout);
    }
}

function getUserName(el) {
    var name;
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
    }
}

function checkMessage() {
    var msg = inputSelector.value;
    if (currMessage != 0) {
        messageHistory.splice(currMessage, 1);
        currMessage = 0;
    }
    messageHistory.splice(1, 0, msg);

    if (msg.charAt(0) == '/') {
        msg = msg.substr(1);
        var parts = msg.split(' ');
        var command = parts[0].toLowerCase();

        // check if tmt command or user alias
        if (command === 'alias') {

            var name = parts[1].toLowerCase();
            var alias = parts.splice(2).join(' ');

            // check if a default twitch command
            if (twitchCommands.includes(name)) {
                return;
            }
            findReact(inputSelector).return.memoizedProps.onValueUpdate('');
            inputSelector.value = '';
            var err = false;
            var errTxt;
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
                        for (var k in aliases) {
                            var txt = k + ': ' + aliases[k];
                            sendStatus(txt, false, true);
                        }
                    }
                } else if (name === 'importffz') {
                    var splitPos = [];
                    var pos, t;
                    if (localStorage.ffz_setting_command_aliases) {
                        var f = localStorage.ffz_setting_command_aliases;
                        while (pos != -1) {
                            pos = f.indexOf('"', i + 1);
                            i = pos;
                            if (pos > 0) {
                                splitPos.push(pos);
                            }
                        }
                        for (var i = 0; i < splitPos.length; i += 4) {
                            var str1 = f.substr(splitPos[i] + 1, splitPos[i + 1] - splitPos[i] - 1).toLowerCase();
                            var str2 = f.substr(splitPos[i + 2] + 1, splitPos[i + 3] - splitPos[i + 2] - 1);
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
            findReact(inputSelector).return.memoizedProps.onValueUpdate('');
            inputSelector.value = '';
            chatRoom.onSendMessage(aliases[command]);
        }
    }
}

function sendStatus(txt, b = false, i = false) {
    var sDiv = document.createElement('div');
    sDiv.setAttribute('class', 'chat-line__status');
    var sSpan = document.createElement('span');
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

function changeMessage() {
    var newMessage = messageHistory[currMessage];
    findReact(inputSelector).return.memoizedProps.onValueUpdate(newMessage);
    inputSelector.value = newMessage;
}

function getJSON(url) {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", url, false);
    Httpreq.send(null);
    return JSON.parse(Httpreq.responseText);
}

function addNameHistory(id) {
    var url = 'https://twitch-tools.rootonline.de/username_changelogs_search.php?q=' + id + '&format=json';
    var data = getJSON(url);
    if (data.length > 0) {
        document.querySelector('.viewer-card__actions').children[0].children[1].insertAdjacentHTML('afterend', components.viewerCard.history);
        for (var i in data) {
            var option = document.createElement('option');
            option.text = data[i].username_old;
            document.querySelector('.tmt-name-history').add(option);
        }
    }
}

window.findReact = function(el) {
    for (const key in el) {
        if (key.startsWith('__reactInternalInstance$')) {
            const fiberNode = el[key];
            return fiberNode.return;
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
