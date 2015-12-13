"use strict";

function ControlSetting() {
    if ($("#watch7-subscription-container").length <= 0) {
        return;
    }

    var setting_button =
        "<span class='htube yt-uix-button-subscription-container'>" +
            "<button class='yt-uix-button yt-uix-button-has-icon no-icon-markup button-label' type='button'>" +
                "<span class='yt-uix-button-content'>" +
                    "<span>Replay</span>" +
                "</span>" +
            "</button>" +

            "<span class='setting-container'>" +
                "<span class='yt-subscription-button-subscriber-count-branded-horizontal yt-subscriber-count'>" +
                    "From <input class='setting-from' type='text' /> To <input class='setting-to' type='text' />" +
                "</span>" +
            "</span>" +

            "<button class='yt-uix-button yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon button-pref' type='button'>" +
                "<span class='yt-uix-button-icon-wrapper'>" +
                    "<span class='yt-uix-button-icon yt-uix-button-icon-subscription-preferences yt-sprite'></span>" +
                "</span>" +
            "</button>" +
        "</span>";

    $("#watch7-subscription-container").append(setting_button);

    var ControlContainer = $(".htube.yt-uix-button-subscription-container");
    var ActiveBtn = $(ControlContainer.find(".button-label")[0]);
    var SettingContainer = $(ControlContainer.find(".htube .setting-container > span")[0]);
    var InputFrom = $(ControlContainer.find(".setting-from")[0]);
    var InputTo = $(ControlContainer.find(".setting-to")[0]);
    var SettingBtn = $(ControlContainer.find(".button-pref")[0]);

    addEventHandler();


    //#region================ Private ===============================

    function toggleReplay() {
        if (ActiveBtn.className.indexOf("active") > 0) {
            ActiveBtn.removeClass("active");
        } else {
            ActiveBtn.addClass("active");
        }
    }

    function addEventHandler() {
        SettingBtn.on("click", function () {
            if (SettingContainer.css("margin-left") === "0") {
                SettingContainer.css("margin-left", "-155px");

                var timeChange = new Event("timeChange", {
                    from: InputFrom.val(),
                    to: InputTo.val()
                });
                this.dispatchEvent(timeChange);
            } else {
                SettingContainer.css("margin-left", "0");
                InputFrom.focus();
            }
        });

        ActiveBtn.on("click", function () {
            toggleReplay();
        });
    }

    //#endregion


    //#region================ Public ================================

    this.ToggleReplay = function () {
        toggleReplay();
    }

    this.SetTime = function (from, to) {
        InputFrom.val(from);
        InputTo.val(to);
    }

    this.GetTime = function () {
        return {
            from: InputFrom.val(),
            to: InputTo.val()
        }
    }

    //#endregion=====================================================
}

