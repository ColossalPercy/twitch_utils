import components from "./html/components";

var config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
};

var chatRoom;
var chatSelector;
var messageHistory = [''];
var currMessage = 0;
var inputSelector;

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
                if (addedNode.classList.contains('chat-line__message')) {
                    if (getUserName(addedNode) == chatRoom.currentUserLogin) {
                        var message = '';
                        var messageArr = findReact(addedNode).memoizedProps.message.messageParts;
                        for (var i in messageArr) {
                            if (typeof messageArr[i].content === 'object') {
                                message += messageArr[i].content.alt;
                            } else {
                                message += messageArr[i].content;
                            }
                        }
                        if (currMessage != 0) {
                            messageHistory.splice(currMessage, 1);
                            currMessage = 0;
                        }
                        messageHistory.splice(1, 0, message);
                    }
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
    }
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
