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

var config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
};

var chatRoom;

//Mutation observer for each chat message
var chatObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (chatRoom.children._owner._instance.props.isCurrentUserModerator) {
            mutation.addedNodes.forEach(function(addedNode) {
                if (addedNode.nodeName == 'DIV') {
                    if (addedNode.classList.contains('chat-line__message')) {
                        addButton(addedNode);
                    } else if (addedNode.classList.contains('viewer-card-layer')) {
                        modCardReady();
                    }
                }
            });
        }
    });
});

//Mutation observer for chat loading
var chatLoaded = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var chatSelector = document.querySelector('.chat-room__container');
        if (chatSelector) {
            chatRoom = findReact(chatSelector).props;
            chatObserver.observe(chatSelector, config);
        }
    });
});
chatLoaded.observe(document.body, config);

function chatPurge() {
    var name = getUserName(this.parentElement.parentElement);
    send('/timeout ' + name + ' 1');
}

function cardTimeout() {
    var name = findReact(document.querySelector('.viewer-card-layer')).props.children.props.targetLogin;
    var time = this.getAttribute('data-tmt-timeout');
    var reason = document.querySelector('.tmt-ban-reason').value;
    send('/timeout ' + name + ' ' + time + ' ' + reason);
}

function send(m) {
    findReact(document.querySelector('.chat-room__container').children[0]).props.children[1].props.sendMessage(m);
}

function addButton(el) {
    el.querySelector('[data-a-target="chat-timeout-button"]').insertAdjacentHTML('afterend', htmlStruc);
    var btn = el.querySelector('[data-a-target="chat-purge-button"]');
    btn.addEventListener('click', chatPurge);
}

function modCardReady() {
    if (document.querySelectorAll('.viewer-card').length == 0) {
        window.requestAnimationFrame(modCardReady);
    } else {
        addModCard();
    }
}

function addModCard() {
    document.querySelector('.viewer-card__actions').insertAdjacentHTML('beforeend', modCard);
    if (document.querySelectorAll('.tmt-tools').length == 0) {
        modCardReady();
    }
    var timeouts = document.getElementsByClassName('tmt-timeout');
    for (var i = 0; i < timeouts.length; i++){
        timeouts[i].addEventListener('click', cardTimeout);
    }
}

function getUserName(el) {
    var name;
    name = findReact(el).props.message.user.userLogin;
    return name;
}

function findReact(el) {
    for (var key in el) {
        if (key.startsWith("__reactInternalInstance$")) {
            var compInternals = el[key]._currentElement;
            var compWrapper = compInternals._owner;
            var comp = compWrapper._instance;
            return comp;
        }
    }
    return null;
}
