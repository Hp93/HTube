"use strict";

console.log("htube " + new Date().getMinutes());
//node_modules\.bin\webpack --watch

require("../src/icon.png");
require("../src/hstyle.css");
require("../src/manifest.json");

import ControlSetting from "./interface.js";
import h from "./helper.js";

function HTube() {
    var Document,   // Waiving Xray Vision
        _player;    // Youtube player

    // The UI for setting replay status and timer
    var SettingUI;

    // Miscellaneous configuration data
    var _data = {
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
        _data.duration = formatTime(_player.getDuration());
    }

    function setReplay() {
        ///<summary>
        /// Toggle replay.
        ///</summary>

        _player.querySelector("video").loop = _data.replay;

        if (!_data.replay) {
            return;
        }

        if (_data.replayUsingTime) {
            setReplayTimer();
        }

        // Play video if replay is turned on and video is not playing.
        if ((_player.getPlayerState() !== YT.PlayerState.playing) || (_player.getPlayerState() !== YT.PlayerState.buffering)) {
            _player.playVideo();
        }
    }

    function setReplayTimer(silent) {
        ///<summary>
        /// Set replay timer used to replay only 1 part of the video.
        ///</summary>

        if (_data.replayInterval) {
            window.clearInterval(_data.replayInterval);
        }

        var from = getSeconds(SettingUI.GetTime().from);
        var to = getSeconds(SettingUI.GetTime().to);

        if (silent) {
            if (_player.getCurrentTime() < from) {
                _player.seekTo(from, true);
            }
        } else {
            _player.seekTo(from, true);
        }

        _data.replayInterval = window.setInterval(function () {
            // Self stop interval
            if (!_data.replay || !_data.replayUsingTime) {
                window.clearInterval(_data.replayInterval);
                return;
            }

            if (_player.getCurrentTime() >= to) {
                _player.seekTo(from, true);
            }
        }, 500);
    }

    function handleSettingTimeChange() {
        if (!_data.replay || !_data.replayUsingTime) {
            return;
        }

        if (_data.replayInterval) {
            window.clearInterval(_data.replayInterval);
        }
        setReplayTimer(true);
    }

    function setupUI() {
        SettingUI = new ControlSetting();
        var result = SettingUI.Create();

        if (!result) {
            return false;
        }
        SettingUI.SetTime(_data.duration.replace(/\d/g, "0"), _data.duration);

        SettingUI.ui.addEventListener("setting:replayChange", function (e) {
            _data.replay = e.detail.state;
            setReplay();
        });
        SettingUI.ui.addEventListener("setting:timeChange", function (e) {
            _data.replayUsingTime = e.detail.timer;
            setReplay();
        });
        SettingUI.ui.addEventListener("setting:settingFromChange", handleSettingTimeChange);
        SettingUI.ui.addEventListener("setting:settingToChange", handleSettingTimeChange);
        return true;
    }

    function initialize() {
        // window.setTimeout(function () {
        getPlayerInformation();
        var success = setupUI();

        if (!success) {
            return false;
        }

        // Fix bug when replay status is preserved when switching to new video
        // setReplay();

        return true;
        // }, 1000);
    }

    function haunt() {
        /// make sure the addon is already working when switching video

        window.htubeInterval = window.setInterval(function () {
            _player = Document.querySelector("#movie_player");

            if (!_player) {
                return;
            }

            var result = initialize();

            if (result) {
                window.clearInterval(window.htubeInterval);
            }

            // var observer = new MutationObserver(function (mutations) {
            //     mutations.forEach(function () {
            //         if (Document.location.toString() !== _data.prevUrl && Document.location.toString() !== "https://www.youtube.com/") {
            //             // Optimized: set new URL asap to prevent possible duplicate initialize call
            //             _data.prevUrl = Document.location.toString();
            //             initialize();
            //         } else {
            //             _data.prevUrl = Document.location.toString();
            //         }
            //     });
            // });
            // // Start observe
            // observer.observe(_player, { attributes: true, attributeOldValue: true });
        }, 500);
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
        _player = Document.querySelector("#movie_player");
        haunt();
    };

    //#endregion
}

h.domReady(function () {
    // only trigger one

    if (!window.htube) {
        window.htube = new HTube();
        window.htube.Create();
    }
});

