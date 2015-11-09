"use strict";

var HTube = function () {
    var _player = document.getElementById("movie_player");
    var _replay = false;
    var _data = {};

    //this.ToggleReplay = function (status, from, to) {
    //    ///<summary>
    //    /// Toggle replay.
    //    ///</summary>
    //    ///<param name="status">Turn replay function on or off</param>
    //    ///<param name="from">If replay 1 particular part, input start time</param>
    //    ///<param name="to">If replay 1 particular part, input end time</param>

    //    _player.loop = status;
    //    _replay = status;

    //    if (_data.replayInterval) {
    //        window.clearInterval(_data.replayInterval);
    //    }

    //    if (!from || !to || !_replay) {
    //        return;
    //    }

    //    _player.seekTo(from, true);

    //    _data.replayInterval = window.setInterval(function () {
    //        if (_player.getCurrentTime() >= to && isReplayOn) {
    //            _player.seekTo(from, true);
    //        }
    //    }, 1000);
    //};
};

if (document.readyState) {
    console.log("document is ready");

    if (!window.htube) {
        window.htube = new HTube();
    }

    if (!window.ui) {
        window.ui = new Interface();
    }
}
else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log("DOMContentLoaded");

        window.htube = new HTube();
        window.ui = new Interface();
    }, false);
}



//var qualities = {
//    "small": "240p",
//    "medium": "360p",
//    "large": "480p",
//    "hd720": "720p",
//    "hd1080": "1080p",
//    "highres": "best",
//    "default": "default"
//};