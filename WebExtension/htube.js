"use strict";

window.alert("htube have been installed on your machine!");

function HTube() {
    // Waiving Xray Vision
    var Document;

    // Youtube player
    var Player;

    // The UI for setting replay status and timer
    var SettingUI;

    // Miscellaneous configuration data
    var Data = {
        replay: false,  // replay status
        replayUsingTime: false,
        duration: "00:00",
        quality: "small",
        replayInterval: null,
        prevUrl: ""
    };

    // Youtube API data
    var YT = {
        PlayerState: {
            unstarted: -1,
            ended: 0,
            playing: 1,
            paused: 2,
            buffering: 3,
            video_cued: 5
        },
        PlayerStateClass: ["unstarted-mode", "ended-mode", "playing-mode", "paused-mode", "buffering-mode"]
    };


    //#region================ Private ===============================

    function getPlayerInformation() {
        Data.duration = formatTime(Player.getDuration());
    }

    function setReplay() {
        ///<summary>
        /// Toggle replay.
        ///</summary>

        $(Player).find("video")[0].loop = Data.replay;

        if (!Data.replay) {
            return;
        }

        if (Data.replayUsingTime) {
            setReplayTimer();
        }

        // Play video if replay is turned on and video is not playing.
        if ((Player.getPlayerState() !== YT.PlayerState.playing) || (Player.getPlayerState() !== YT.PlayerState.buffering)) {
            Player.playVideo();
        }
    }

    function setReplayTimer(silent) {
        ///<summary>
        /// Set replay timer used to replay only 1 part of the video.
        ///</summary>

        if (Data.replayInterval) {
            window.clearInterval(Data.replayInterval);
        }

        var from = getSeconds(SettingUI.GetTime().from);
        var to = getSeconds(SettingUI.GetTime().to);

        if (silent) {
            if (Player.getCurrentTime() < from) {
                Player.seekTo(from, true);
            }
        } else {
            Player.seekTo(from, true);
        }

        Data.replayInterval = window.setInterval(function () {
            // Self stop interval
            if (!Data.replay || !Data.replayUsingTime) {
                window.clearInterval(Data.replayInterval);
                return;
            }

            if (Player.getCurrentTime() >= to) {
                Player.seekTo(from, true);
            }
        }, 500);
    }

    function handleSettingTimeChange() {
        if (!Data.replay || !Data.replayUsingTime) {
            return;
        }

        if (Data.replayInterval) {
            window.clearInterval(Data.replayInterval);
        }
        setReplayTimer(true);
    }

    function setupUI() {
        SettingUI = new ControlSetting();
        var result = SettingUI.Create();

        if (!result) {
            return;
        }
        SettingUI.SetTime(Data.duration.replace(/\d/g, "0"), Data.duration);

        SettingUI.ui.on("setting:replayChange", function (e, state) {
            Data.replay = state;
            setReplay();
        });

        SettingUI.ui.on("setting:timeChange", function (e, timer) {
            Data.replayUsingTime = timer;
            setReplay();
        });

        SettingUI.ui.on("setting:settingFromChange", handleSettingTimeChange);

        SettingUI.ui.on("setting:settingToChange", handleSettingTimeChange);
    }

    function initialize() {
        window.setTimeout(function () {
            getPlayerInformation();
            setupUI();

            // Fix bug when replay status is preserved when switching to new video
            setReplay();
        }, 1000);
    }

    ////////////////General methods////////////////

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

    //#endregion=====================================================


    //#region================ Public ================================

    this.Create = function () {
        Document = window.wrappedJSObject.document;

        // The player may not be here, but I can sense the turbulence in the wind, we will see it soon ...
        window.htubeInterval = window.setInterval(function () {
            Player = Document.querySelector("#movie_player");

            if (!Player) {
                return;
            }
            window.clearInterval(window.htubeInterval);
            initialize();

            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function () {
                    if (Document.location.toString() !== Data.prevUrl && Document.location.toString() !== "https://www.youtube.com/") {
                        // Optimized: set new URL asap to prevent possible duplicate initialize call
                        Data.prevUrl = Document.location.toString();
                        initialize();
                    } else {
                        Data.prevUrl = Document.location.toString();
                    }
                });
            });

            // Start observe
            observer.observe(Player, { attributes: true, attributeOldValue: true });

        }, 500);
    };

    //#endregion
}

document.addEventListener("DOMContentLoaded", function () {
    if (!window.htube) {
        window.htube = new HTube();
        window.htube.Create();
    }
});
