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

$('[data-a-target="chat-purge-button"]').addEventListener('click',purge);
