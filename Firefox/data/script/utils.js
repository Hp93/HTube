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
    };

    this.getTime = function (time, separator) {
        if (isNaN(time) || time <= 0) {
            return "00";
        }

        if (!separator) {
            separator = ":";
        }

        var totalSec = Math.floor(time);
        var hours = parseInt(totalSec / 3600);
        var minutes = parseInt(totalSec / 60) % 60;
        var seconds = totalSec % 60;

        var result = (minutes < 10 ? "0" + minutes : minutes) + separator + (seconds < 10 ? "0" + seconds : seconds);

        if (hours > 0) {
            result = (hours < 10 ? "0" + hours : hours) + separator + result;
        }
        return result;
    }
}

window.Utils = new Utilities();
