"use strict";

// player.getDuration():Number
// player.getCurrentTime():Number
// player.seekTo(seconds:Number, allowSeekAhead:Boolean):Void


if (document.readyState) {
    console.log("document is ready");
}

window.HTube = function () {
    var defaultQuality = "default";

    var qualities = {
        "small": "240p",
        "medium": "360p",
        "large": "480p",
        "hd720": "720p",
        "hd1080": "1080p",
        "highres": "best",
        "default": "default"
    };

    var _player = document.getElementById("movie_player");
    var _replay = false;
    var _data = {};
    var _debug = true;

    //self.port.on("onDefaultQualityChange", function (msg) {
    //    // Handle the message
    //    console.log("receive onDefaultQualityChange");
    //    console.log(msg);
    //});

    //_player.addEventListener("onReady", function () {
    //});

    //_player.addEventListener("onStateChange", function (newStage, oldStage) {
    //    if (newStage !== 1 || _player.getPlaybackQuality() !== defaultQuality) {
    //        return;
    //    }

    //    log("onStateChange", arguments);

    //    this.SetDefaultQuality();
    //});


    this.ToggleReplay = function (status, from, to) {
        ///<summary>
        /// Toggle replay.
        ///</summary>
        ///<param name="status">Turn replay function on or off</param>
        ///<param name="from">If replay 1 particular part, input start time</param>
        ///<param name="to">If replay 1 particular part, input end time</param>

        _player.loop = status;
        _replay = status;

        if (_data.replayInterval) {
            window.clearInterval(_data.replayInterval);
        }

        if (!from || !to || !_replay) {
            return;
        }

        _player.seekTo(from, true);

        _data.replayInterval = window.setInterval(function () {
            if (player.getCurrentTime() >= to && isReplayOn) {
                _player.seekTo(from, true);
            }
        }, 1000)
    };

    //this.SetDefaultQuality = function () {
    //    log("SetDefaultQuality", arguments, defaultQuality);

    //    _player.setPlaybackQuality(defaultQuality);
    //}


    //function onDefaultQualityChange(prefName) {
    //    console.log(arguments);
    //}

    function log() {
        if (!_debug) {
            return;
        }

        for (var i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
};

//else {
//    document.addEventListener('DOMContentLoaded', function () {
//        console.log("DOM content loaded");

//        if (!window.htube) {
//            window.htube = new HTube();
//        }
//    }, false);
//}

