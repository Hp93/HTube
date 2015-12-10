"use strict";

var HTube = function () {
    var _player = document.querySelector("#movie_player");
    var _replay = false;
    var _data = {
        duration: "00:00"
    };
    var ui = new Interface();

    getInfo();
    //ui.SetTime(_data.duration.replace(/\d/g, "0"), _data.duration);

    function getInfo() {
        debugger;
        _data.duration = window.Utils(_player.getDuration());
    }

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
            if (_player.getCurrentTime() >= to && _replay) {
                _player.seekTo(from, true);
            }
        }, 1000);
    };
};

if (document.readyState) {
    console.log("document is ready");

    if (!window.htube) {
        window.htube = new HTube();
    }
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