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
            console.log(addedNode);
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
chatLoaded.observe($("body")[0], config);













function doEvent( obj, type ) {
    /* Created by David@Refoua.me */
    var event = new Event( type, {target: obj, bubbles: true} );
    return obj ? obj.dispatchEvent(event) : false;
}

function message(txt) {
    var el = $('.chat-input > div > textarea');
    el.value = txt;
    doEvent(el, 'input');
}

function purge(){
    var name = this.parentElement.parentElement.getAttribute('data-user');
    message('/timeout ' + name + ' 1');
}

//$('[data-a-target="chat-purge-button"]').addEventListener('click',purge);
