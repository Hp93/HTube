"use strict";

function ControlSetting() {
    var ControlContainer;
    var setting_button =
        "<span class='htube yt-uix-button-subscription-container'>" +
        "<button class='yt-uix-button yt-uix-button-has-icon no-icon-markup button-label' type='button' title='Turn on replay'>" +
        "<span class='yt-uix-button-content'>" +
        "<span>Replay</span>" +
        "</span>" +
        "</button>" +

        "<span class='setting-container'>" +
        "<span class='yt-subscription-button-subscriber-count-branded-horizontal yt-subscriber-count'>" +
        "<input class='setting-timerchk' type='checkbox' />" +
        "From <input class='setting-from' type='text' /> To <input class='setting-to' type='text' />" +
        "</span>" +
        "</span>" +

        "<button class='yt-uix-button yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon button-pref' type='button'>" +
        "<span class='yt-uix-button-icon-wrapper'>" +
        "<span class='yt-uix-button-icon yt-uix-button-icon-subscription-preferences yt-sprite'></span>" +
        "</span>" +
        "</button>" +
        "</span>";


    //#region================ Private ===============================

    function toggleReplay() {
        var activeBtn = ControlContainer.querySelector(".button-label");

        if (activeBtn.classList.contains("active")) {
            activeBtn.classList.remove("active");
            activeBtn.setAttribute("title", "Turn on replay");
            return false;
        } else {
            activeBtn.classList.add("active");
            activeBtn.setAttribute("title", "Turn off replay");
            return true;
        }
    }

    function addEventHandler() {
        ControlContainer.querySelector(".button-pref").addEventListener("click", function (e) {
            var settingContainer = getSiblings(e.target, ".setting-container").querySelector("span");

            if (settingContainer.css("margin-left") === "0px") {
                // Move container to the left, out of visible zone to hide it
                settingContainer.css("margin-left", "-191px");
            } else {
                // Move container back to normal position so it can be visible
                settingContainer.css("margin-left", "0");
                settingContainer.querySelector(".setting-from").focus();
            }
        });

        document.querySelector(".setting-from").on("focusout", function (e) {
            ControlContainer.trigger("setting:settingFromChange", e.target.value);
        });

        document.querySelector(".setting-to").on("focusout", function (e) {
            ControlContainer.trigger("setting:settingToChange", e.target.value);
        });

        ControlContainer.querySelector(".button-label").addEventListener("click", function () {
            // User command
            var isOn = toggleReplay();

            // Trigger event
            ControlContainer.trigger("setting:replayChange", isOn);
        });

        ControlContainer.querySelector(".setting-timerchk").addEventListener("change", function (e) {
            ControlContainer.trigger("setting:timeChange", e.target.checked);
        });
    }


    //#endregion


    //#region================ Public ================================

    this.ToggleReplay = function () {
        toggleReplay();
    };

    this.SetTime = function (from, to) {
        ControlContainer.querySelector(".setting-from").value = from;
        ControlContainer.querySelector(".setting-to").value = to;
        ControlContainer.querySelector(".setting-timerchk").checked = false;
    };

    this.GetTime = function () {
        return {
            enable: ControlContainer.querySelector(".setting-timerchk").checked,
            from: ControlContainer.querySelector(".setting-from").value,
            to: ControlContainer.querySelector(".setting-to").value
        };
    };

    this.Create = function () {
        if (document.querySelectorAll("#watch7-subscription-container").length <= 0) {
            return false;
        }

        if (document.querySelector("#watch7-subscription-container").querySelectorAll(".htube").length <= 0) {
            document.querySelector("#watch7-subscription-container").innerHTML = setting_button;
            ControlContainer = document.querySelector("#watch7-subscription-container > .htube");
            addEventHandler();
        } else {
            ControlContainer = document.querySelector("#watch7-subscription-container > .htube");
        }
        this.ui = ControlContainer;
        return true;
    };

    //#endregion=====================================================
}

