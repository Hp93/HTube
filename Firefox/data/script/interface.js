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
        var activeBtn = $(".button-label", ControlContainer);

        if (activeBtn.hasClass("active")) {
            activeBtn.removeClass("active");
            activeBtn.attr("title", "Turn on replay");
            return false;
        } else {
            activeBtn.addClass("active");
            activeBtn.attr("title", "Turn off replay");
            return true;
        }
    }

    function addEventHandler() {
        $(".button-pref", ControlContainer).on("click", function (e) {
            var settingContainer = $(e.target).prev(".setting-container").find("span");

            if (settingContainer.css("margin-left") === "0px") {
                // Move container to the left, out of visible zone to hide it
                settingContainer.css("margin-left", "-191px");
            } else {
                // Move container back to normal position so it can be visible
                settingContainer.css("margin-left", "0");
                $(".setting-from", settingContainer).focus();
            }
        });

        $(".button-label", ControlContainer).on("click", function () {
            // User command
            var isOn = toggleReplay();

            // Trigger event
            ControlContainer.trigger("setting:replayChange", isOn);
        });

        $(".setting-timerchk", ControlContainer).on("change", function (e) {
            ControlContainer.trigger("setting:timeChange", e.target.checked);
        });
    }


    //#endregion


    //#region================ Public ================================

    this.ToggleReplay = function () {
        toggleReplay();
    }

    this.SetTime = function (from, to) {
        $(".setting-from", ControlContainer).val(from);
        $(".setting-to", ControlContainer).val(to);
        $(".setting-timerchk", ControlContainer)[0].checked = false;
    }

    this.GetTime = function () {
        return {
            from: $(".setting-from", ControlContainer).val(),
            to: $(".setting-to", ControlContainer).val()
        }
    }

    this.Create = function () {
        if ($("#watch7-subscription-container").length <= 0) {
            return false;
        }

        if ($("#watch7-subscription-container").find(".htube").length <= 0) {
            $("#watch7-subscription-container").append(setting_button);

            ControlContainer = $("#watch7-subscription-container > .htube");
            this.ui = ControlContainer;

            addEventHandler();
        }
        return true;
    }

    //#endregion=====================================================
}

