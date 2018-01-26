/*jshint esversion: 6 */
const htmlStruc = `<button class="mod-icon" data-a-target="chat-purge-button">
    <div class="tw-tooltip-wrapper tw-inline-flex">
        <figure class="tw-svg">
            <svg class="tw-svg__asset tw-svg__asset--inherit" width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px">
                <path d="M8,15c-3.866,0-7-3.134-7-7s3.134-7,7-7s7,3.134,7,7S11.866,15,8,15z M8,3C5.238,3,3,5.238,3,8c0,2.762,2.238,5,5,5 c2.762,0,5-2.238,5-5C13,5.238,10.762,3,8,3z"></path>
                <path d="M5.558,4.582l5.861,5.86l-0.978,0.978l-5.86-5.861L5.558,4.582z M10.441,4.582l0.978,0.977l-5.861,5.861l-0.977-0.978 L10.441,4.582z"></path>
            </svg>
        </figure>
    <div class="tw-tooltip tw-tooltip--up tw-tooltip--align-center" data-a-target="tw-tooltip-label" role="tooltip">Purge</div>
    </div>
</button>`;

var config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
};


//Mutation observer for each chat message
var chatObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(addedNode) {
            if (addedNode.nodeName == 'DIV') {
                if (addedNode.classList.contains('chat-line__message')) {
                    addButton(addedNode);
                }
            }
        });
    });
});

//Mutation observer for chat loading
var chatLoaded = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var chatSelector = $(".chat-list");
        if (chatSelector.length > 0) {
            var target = chatSelector[0];
            chatObserver.observe(target, config);
        }
    });
});
chatLoaded.observe(document.body, config);

function doEvent(obj, type) {
    /* Created by David@Refoua.me */
    var event = new Event(type, {
        target: obj,
        bubbles: true
    });
    return obj ? obj.dispatchEvent(event) : false;
}

function message(txt) {
    var el = document.querySelectorAll('[data-test-selector="chat-input"]')[0];
    el.value = txt;
    doEvent(el, 'input');
    send();
}

function purge() {
    var name = this.parentElement.parentElement.querySelector('[data-test-selector="message-username"]').innerHTML;
    message('/timeout ' + name + ' 1');
}

function send() {
    document.querySelectorAll('[data-test-selector="chat-send-button"]')[0].click();
}

function addButton(el){
    // var btn = document.createElement('span');
    // btn.innerHTML = htmlStruc;
    el.querySelector('[data-a-target="chat-timeout-button"]').insertAdjacentHTML('afterend', htmlStruc);
    var btn = el.querySelector('[data-a-target="chat-purge-button"]');
    btn.addEventListener('click', purge);
}
