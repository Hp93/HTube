"use strict";

// Build UI
var Interface = function () {
    var setting_button = "" +
        '<span class="htube yt-uix-button-subscription-container">' +
            '<button class="yt-uix-button yt-uix-button-has-icon no-icon-markup button-label" type="button">' +
                '<span class="yt-uix-button-content">' +
                    '<span>Replay</span>' +
                '</span>' +
            '</button>' +
            '<span class="setting-container">' +
                '<span class="yt-subscription-button-subscriber-count-branded-horizontal yt-subscriber-count">' +
                    'From <input class="setting-from" type="text" /> To <input class="setting-to" type="text" />' +
                '</span>' +
            '</span>' +
            '<button class="yt-uix-button yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon button-pref" type="button">' +
                '<span class="yt-uix-button-icon-wrapper">' +
                    '<span class="yt-uix-button-icon yt-uix-button-icon-subscription-preferences yt-sprite"></span>' +
                '</span>' +
            '</button>' +
        '</span>';

    Utils.appendHtml(document.querySelector("#watch7-subscription-container"), setting_button);

    if (!document.querySelector("#watch7-subscription-container")) {
        return;
    }
    console.log(document.querySelector("#watch7-subscription-container"));

    var settingContainer = document.querySelector(".htube .setting-container > span");

    document.querySelector(".button-pref").addEventListener("click", function () {
        if (window.getComputedStyle(settingContainer)["margin-left"] === "0px") {
            settingContainer.style["margin-left"] = "-155px";

            var timeChange = new Event("timeChange", {
                from: document.querySelector(".setting-from").value,
                to: document.querySelector(".setting-to").value
            });
            this.dispatchEvent(timeChange);
        } else {
            settingContainer.style["margin-left"] = "0px";
            document.querySelector(".setting-from").focus();
        }
    });


    var input = document.querySelectorAll(".setting-from, .setting-to");

    for (var i = 0; i < input.length; i++) {
        input[i].addEventListener("blur", function () {
            //if (document.querySelector(".setting-from").hasFocus || document.querySelector(".setting-to").hasFocus) {
            //    return;
            //}
            //settingContainer.style["margin-left"] = "-155px";

            //var timeChange = new Event("timeChange", {
            //    from: document.querySelector(".setting-from").value,
            //    to: document.querySelector(".setting-to").value
            //});
            //this.dispatchEvent(timeChange);
        });
    }

    document.querySelector(".button-label").addEventListener("click", function () {
        if (document.querySelector(".button-label").className.indexOf("active") > 0) {
            document.querySelector(".button-label").className = document.querySelector(".button-label").className.replace("active", "");
        } else {
            document.querySelector(".button-label").className += " active";
        }
    });


    this.ToggleReplay = function () {
        if (document.querySelector(".button-label").className.indexOf("active") > 0) {
            document.querySelector(".button-label").className = document.querySelector(".button-label").className.replace("active", "");
        } else {
            document.querySelector(".button-label").className += " active";
        }
    }

    this.SetTime = function (from, to) {
        document.querySelector(".setting-from").value = from;
        document.querySelector(".setting-to").value = to;
    }

    this.GetTime = function () {
        return {
            from: document.querySelector(".setting-from").value,
            to: document.querySelector(".setting-to").value
        }
    }
}

