"use strict";

/// Youtbe API: https://developers.google.com/youtube/iframe_api_reference

function HTube() {
    // Waiving Xray Vision
    var Document;

    // Youtube player
    var Player;

    var SettingUI;

    // Configuration data
    var Data = {
        replay: false,  // replay status
        duration: "00:00",
        quality: "small",
        replayInterval: null,
        prevUrl: ""
    }

    // Youtube API data
    var YT = {
        PlayerState: {
            unstarted: -1,
            ended: 0,
            playing: 1,
            paused: 2,
            buffering: 3,
            video_cued: 5
        }
    }


    //#region================ Private ===============================

    function getPlayerInformation() {
        Data.duration = formatTime(Player.getDuration());
        Data.prevUrl = Player.getVideoUrl();
    }

    function setReplay(status, timer) {
        ///<summary>
        /// Toggle replay.
        ///</summary>
        ///<param name="status">Turn replay function on or off</param>

        Data.replay = status;

        if (status && timer) {
            $(Player).find("video")[0].loop = false;
            setReplayTimer();
        } else {
            $(Player).find("video")[0].loop = status;

            if (status) {
                if (Player.getPlayerState() !== YT.PlayerState.playing || Player.getPlayerState() !== YT.PlayerState.buffering) {
                    Player.playVideo();
                }
            }
        }
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

    function getSeconds(time, separator) {
        if (!separator) {
            separator = ":";
        }

        var sakurako_san = time.split(separator);
        var h, m, s;

        switch (sakurako_san.length) {
            case 2:
                m = parseInt(sakurako_san[0]);
                s = parseInt(sakurako_san[1]);

                if (isNaN(m) || isNaN(s)) {
                    return 0;
                }
                return m * 60 + s;

            case 3:
                h = parseInt(sakurako_san[0]);
                m = parseInt(sakurako_san[1]);
                s = parseInt(sakurako_san[2]);

                if (isNaN(h) || isNaN(m) || isNaN(s)) {
                    return 0;
                }
                return h * 60 * 60 + m * 60 + s;

            default:
                return 0;
        }
    }

    function setReplayTimer() {
        ///<summary>
        /// Set replay timer used to replay only 1 part of the video.
        ///</summary>
        if (Data.replayInterval) {
            window.clearInterval(Data.replayInterval);
        }

        var from = getSeconds(SettingUI.GetTime().from);
        var to = getSeconds(SettingUI.GetTime().to);

        Player.seekTo(from, true);

        Data.replayInterval = window.setInterval(function () {
            console.log("interval");

            if (!Data.replay) {
                window.clearInterval(Data.replayInterval);
                return;
            }

            if (Player.getCurrentTime() >= to) {
                Player.seekTo(from, true);
            }
        }, 1000);
    }

    function setupUI() {
        SettingUI = new ControlSetting();
        var result = SettingUI.Create();

        if (!result) {
            return;
        }
        SettingUI.SetTime(Data.duration.replace(/\d/g, "0"), Data.duration);

        SettingUI.ui.on("setting:replayChange", function (e, state) {
            setReplay(state);
        });

        SettingUI.ui.on("setting:timeChange", function (e, timer) {
            if (timer) {
                setReplay(Data.replay, timer);
            } else {
                if (Data.replayInterval) {
                    window.clearInterval(Data.replayInterval);
                }
            }
        });
    }

    function initialize() {
        getPlayerInformation();
        setupUI();
        setQuality(Data.quality);
    }

    //#endregion=====================================================


    //#region================ Public ================================

    this.Create = function () {
        Document = window.wrappedJSObject.document;

        // The player may not be here, but I can sense the turbulence in the wind, we will see it soon ...
        var i = window.setInterval(function () {
            console.log("interval");
            Player = Document.querySelector("#movie_player");

            if (!Player) {
                return;
            }

            window.clearInterval(i);
            initialize();

            $(Player).on("onStateChange", function () {
                if (Player.getVideoUrl() !== Data.prevUrl) {
                    console.log(Player.getVideoUrl());
                    console.log(Data.prevUrl);
                    initialize();
                }
            });
        }, 200);
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
