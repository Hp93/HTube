"use strict";

var Utilities = function () {
    this.appendHtml = function (el, str) {
        try {
            if (!el || !string) {
                return;
            }

            var div = document.createElement('div');
            div.innerHTML = str;

            while (div.children.length > 0) {
                el.appendChild(div.children[0]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
}

window.Utils = new Utilities();
