"use strict";

var Utilities = function () {
    this.appendHtml = function (el, str) {
        if (!el || !str) {
            return;
        }

        var div = document.createElement('div');
        div.innerHTML = str;

        while (div.children.length > 0) {
            el.appendChild(div.children[0]);
        }
    }
}

window.Utils = new Utilities();
