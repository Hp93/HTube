/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (class {
    constructor() { }

    static domReady(fn) {
        if (typeof fn !== "function") {
            return;
        }

        // in case the document is already rendered
        if (document.readyState != "loading") {
            fn();
        }
        // modern browsers
        else if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", fn);
        }
        // IE <= 8
        else {
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState == "complete") {
                    fn();
                }
            });
        }
    }

    static triggerEvent(el, type, params) {
        var e = new CustomEvent(type, { detail: params });
        // e = document.createEvent("HTMLEvents");
        // e.initEvent(type, false, true);
        el.dispatchEvent(e);
    }

    static createElement(html) {
        var tmp = document.createElement("div");
        tmp.innerHTML = html;

        return tmp.childNodes.length === 1
            ? tmp.childNodes[0]
            : tmp.childNodes;
    }

    static prepend(currentNode, newNode) {
        if (currentNode.childNodes.length <= 0) {
            currentNode.insertBefore(newNode, null);
        } else {
            currentNode.insertBefore(newNode, currentNode.childNodes[0]);
        }
    }

});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interface_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helper_js__ = __webpack_require__(0);


console.log("htube " + new Date().getMinutes());
//node_modules\.bin\webpack --watch

__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);




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
        SettingUI = new __WEBPACK_IMPORTED_MODULE_0__interface_js__["a" /* default */]();
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

__WEBPACK_IMPORTED_MODULE_1__helper_js__["a" /* default */].domReady(function () {
    // only trigger one

    if (!window.htube) {
        window.htube = new HTube();
        window.htube.Create();
    }
});



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "icon.png";

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "hstyle.css";

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "manifest.json";

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ControlSetting;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_js__ = __webpack_require__(0);




function ControlSetting() {
    var _data = {
        containerSelector: "#flex"     // to place the UI
    };
    var _controlContainer, _settingContainer;
    var setting_button =
        "<div class='htube'> \
            <div class='btn--active' title='Turn on replay'> \
                <span class=''> \
                    <span>Replay</span> \
                </span> \
            </div> \
            <div class='setting-container'> \
                <input class='setting-timerchk' type='checkbox' title='Enable timer' /> \
                From <input class='setting-from' type='text' /> To <input class='setting-to' type='text' /> \
            </div> \
            <button class='btn--open-setting' type='button'> \
                <svg width='100%' height='100%' viewBox='0 0 36 36'> \
                    <use class='ytp-svg-shadow' xlink:href='#ytp-id-19'></use> \
                    <path style='fill: rgb(136, 136, 136)' d='m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z' fill='#fff' id='ytp-id-19'></path> \
                </svg> \
            </button> \
        </div>";


    //#region================ Private ===============================

    function toggleReplay() {
        var activeBtn = _controlContainer.querySelector(".btn--active");

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
        _controlContainer.querySelector(".btn--open-setting").addEventListener("click", function () {
            // var sc = _settingContainer.querySelector("span");

            if (_settingContainer.style["width"] === "0px" || _settingContainer.style["width"] === "") {
                // Move container back to normal position so it can be visible
                _settingContainer.style["width"] = "190px";
                // sc.querySelector(".setting-from").focus();   //TODO rewrite focus() in vanilla js
            } else {
                // Move container to the left, out of visible zone to hide it
                _settingContainer.style["width"] = "0px";
            }
        });

        document.querySelector(".setting-from").addEventListener("focusout", function (e) {
            __WEBPACK_IMPORTED_MODULE_0__helper_js__["a" /* default */].triggerEvent(_controlContainer, "setting:settingFromChange", e.target.value);
        });

        document.querySelector(".setting-to").addEventListener("focusout", function (e) {
            __WEBPACK_IMPORTED_MODULE_0__helper_js__["a" /* default */].triggerEvent(_controlContainer, "setting:settingToChange", e.target.value);
        });

        _controlContainer.querySelector(".btn--active").addEventListener("click", function () {
            // User command
            var isOn = toggleReplay();

            // Trigger event
            __WEBPACK_IMPORTED_MODULE_0__helper_js__["a" /* default */].triggerEvent(_controlContainer, "setting:replayChange", { state: isOn });
        });

        _controlContainer.querySelector(".setting-timerchk").addEventListener("change", function (e) {
            if (e.target.checked) {
                _settingContainer.classList.add("active");
            } else {
                _settingContainer.classList.remove("active");
            }

            __WEBPACK_IMPORTED_MODULE_0__helper_js__["a" /* default */].triggerEvent(_controlContainer, "setting:timeChange", { timer: e.target.checked });
        });
    }

    //#endregion


    //#region================ Public ================================

    this.ToggleReplay = function () {
        toggleReplay();
    };

    this.SetTime = function (from, to) {
        _controlContainer.querySelector(".setting-from").value = from;
        _controlContainer.querySelector(".setting-to").value = to;
        _controlContainer.querySelector(".setting-timerchk").checked = false;
    };

    this.GetTime = function () {
        return {
            enable: _controlContainer.querySelector(".setting-timerchk").checked,
            from: _controlContainer.querySelector(".setting-from").value,
            to: _controlContainer.querySelector(".setting-to").value
        };
    };

    this.Create = function () {
        var ytContainer = document.querySelector(_data.containerSelector);

        if (!ytContainer) {
            return false;
        }

        _controlContainer = ytContainer.querySelector(".htube");

        if (_controlContainer) {
            _controlContainer = ytContainer.querySelector(".htube");
            _settingContainer = document.querySelector(".setting-container");
        } else {
            __WEBPACK_IMPORTED_MODULE_0__helper_js__["a" /* default */].prepend(ytContainer, __WEBPACK_IMPORTED_MODULE_0__helper_js__["a" /* default */].createElement(setting_button));
            _controlContainer = ytContainer.querySelector(".htube");
            _settingContainer = document.querySelector(".setting-container");
            addEventHandler();
        }
        this.ui = _controlContainer;
        return true;
    };

    //#endregion=====================================================
}



/***/ })
/******/ ]);