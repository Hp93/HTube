"use strict";

function HTube() {
    // Waiving Xray Vision
    var Document;

    // Youtube player
    var Player;

    var SettingUI;

    var Data = {
        replay: false,
        duration: "00:00",
        quality: "small"
    }


    //#region================ Private ===============================

    function getPlayerInformation() {
        Data.duration = formatTime(Player.getDuration());
    }

    function toggleReplay(status, from, to) {
        ///<summary>
        /// Toggle replay.
        ///</summary>
        ///<param name="status">Turn replay function on or off</param>
        ///<param name="from">Replay start time</param>
        ///<param name="to">Replay end time</param>

        $(Player).find("video")[0].loop = status;
        Data.replay = status;

        if (Data.replayInterval) {
            window.clearInterval(Data.replayInterval);
        }

        if (!from || !to || !replay) {
            return;
        }

        Player.seekTo(from, true);

        Data.replayInterval = window.setInterval(function () {
            if (Player.getCurrentTime() >= to && replay) {
                Player.seekTo(from, true);
            }
        }, 1000);
    };

    function formatTime(time, separator) {
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

    function setQuality(suggestQuality) {
        Player.setPlaybackQuality(suggestQuality);
    }

    //#endregion=====================================================


    //#region================ Public ================================

    this.Create = function () {
        Document = window.wrappedJSObject.document;
        Player = Document.querySelector("#movie_player");
        getPlayerInformation();

        SettingUI = new ControlSetting();
        SettingUI.SetTime(Data.duration.replace(/\d/g, "0"), Data.duration);

        SettingUI.ui.on("setting:replayChange", function (e, state) {
            toggleReplay(state);
        });

        SettingUI.ui.on("setting:timeChange", function (e, time) {
            toggleReplay(Data.replay, time.from, time.to);
        });

        setQuality(Data.quality);
    }

    //#endregion
};

$(function () {
    if (!window.htube) {
        window.htube = new HTube();
        window.htube.Create();
    }
});


//var qualities = {
//    "small": "240p",
//    "medium": "360p",
//    "large": "480p",
//    "hd720": "720p",
//    "hd1080": "1080p",
//    "highres": "best",
//    "default": "default"
//};