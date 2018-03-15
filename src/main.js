/*jshint esversion: 6 */
var purgeIcon = '<path d="M8,15c-3.866,0-7-3.134-7-7s3.134-7,7-7s7,3.134,7,7S11.866,15,8,15z M8,3C5.238,3,3,5.238,3,8c0,2.762,2.238,5,5,5 c2.762,0,5-2.238,5-5C13,5.238,10.762,3,8,3z"></path><path d="M5.558,4.582l5.861,5.86l-0.978,0.978l-5.86-5.861L5.558,4.582z M10.441,4.582l0.978,0.977l-5.861,5.861l-0.977-0.978 L10.441,4.582z"></path>';
if (localStorage.tmtJackyScrubby == 'true') {
    purgeIcon = '<path d="M2,4v12h12V4H2z M5.3,13.3C5.3,13.7,5,14,4.7,14S4,13.7,4,13.3V6.7C4,6.3,4.3,6,4.7,6s0.7,0.3,0.7,0.7V13.3z M8.7,13.3C8.7,13.7,8.4,14,8,14s-0.7-0.3-0.7-0.7V6.7C7.3,6.3,7.6,6,8,6s0.7,0.3,0.7,0.7V13.3z M12,13.3c0,0.4-0.3,0.7-0.7,0.7s-0.7-0.3-0.7-0.7V6.7C10.7,6.3,11,6,11.3,6S12,6.3,12,6.7V13.3z M14.7,1.3v1.3H1.3V1.3h3.8c0.6,0,1.1-0.7,1.1-1.3h3.5c0,0.6,0.5,1.3,1.1,1.3H14.7z"></path>';
}

const htmlStruc = `<button class="mod-icon" data-a-target="chat-purge-button">
    <div class="tw-tooltip-wrapper tw-inline-flex">
        <figure class="tw-svg">
            <svg class="tw-svg__asset tw-svg__asset--inherit" width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px">
            ${purgeIcon}
            </svg>
        </figure>
    <div class="tw-tooltip tw-tooltip--up tw-tooltip--align-center" data-a-target="tw-tooltip-label" role="tooltip">Purge</div>
    </div>
</button>`;

const modCard = `
<div class="tw-c-background-alt-2 tw-border-t tw-full-width tw-flex tw-justify-content-between tmt-tools">
    <div class="tw-inline-flex tw-flex-row">
        <div class="tw-inline-flex">
            <button class="tw-button-icon">
                <span class="tw-button__text tmt-timeout" data-tmt-timeout="1">Purge</span>
            </button>
        </div>
    </div>
    <div class="tw-inline-flex tw-flex-row">
        <div class="tw-inline-flex">
            <button class="tw-button-icon tmt-timeout" data-tmt-timeout="300">
                <span class="tw-button__text">5m</span>
            </button>
            <button class="tw-button-icon tmt-timeout" data-tmt-timeout="600">
                <span class="tw-button__text">10m</span>
            </button>
            <button class="tw-button-icon tmt-timeout" data-tmt-timeout="3600">
                <span class="tw-button__text">1h</span>
            </button>
            <button class="tw-button-icon tmt-timeout" data-tmt-timeout="43200">
                <span class="tw-button__text">12h</span>
            </button>
            <button class="tw-button-icon tmt-timeout" data-tmt-timeout="86400">
                <span class="tw-button__text">1d</span>
            </button>
            <button class="tw-button-icon tmt-timeout" data-tmt-timeout="604800">
                <span class="tw-button__text">1w</span>
            </button>
        </div>
    </div>
</div>

<div class="tw-c-background tw-full-width tw-flex">
    <div class="tw-inline-flex tw-flex-row">
        <div class="tw-inline-flex tw-pd-1">
            <select class="tmt-ban-reason">
                <option value="">Select a Ban Reason</option>
                <option value="One-Man Spam">1) One-Man Spam</option>
                <option value="Posting Bad Links">2) Posting Bad Links</option>
                <option value="Ban Evasion">3) Ban Evasion</option>
                <option value="Threats / Personal Info">4) Threats / Personal Info</option>
                <option value="Hate / Harassment">5) Hate / Harassment</option>
                <option value="Ignoring Broadcaster / Moderators">6) Ignoring Broadcaster / Moderators</option>
            </select>
        </div>
    </div>
</div>`;

const profileAge = '<p style="color:white;text-align:left;" id="viewer-card__profile-age"></p>';

const nameHistory = `
    <div class="tw-inline-flex tw-pd-1">
        <select class="tmt-name-history">
            <option>Name History</option>
        </select>
    </div>
`;

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
    el.querySelector('[data-a-target="chat-timeout-button"]').insertAdjacentHTML('afterend', htmlStruc);
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
    document.querySelector('.viewer-card__banner').classList.remove('tw-align-items-center');
    var dn = document.querySelector('.viewer-card__display-name');
    dn.classList.remove('tw-align-items-center');
    dn.insertAdjacentHTML('beforeend', profileAge);
    var d = new Date(date);
    var created = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    document.getElementById('viewer-card__profile-age').innerHTML = 'Created on: ' + created;
}

function addModCard() {
    document.querySelector('.viewer-card__actions').insertAdjacentHTML('beforeend', modCard);
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
        document.querySelector('.viewer-card__actions').children[0].children[1].insertAdjacentHTML('afterend', nameHistory);
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
