//var self = require('sdk/self');

//// a dummy function, to show how tests work.
//// to see how to test this function, look at test/test-index.js
//function dummy(text, callback) {
//  callback(text);
//}

//exports.dummy = dummy;


var pageMods = require("sdk/page-mod");
var data = require("sdk/self").data;
var preferences = require("sdk/simple-prefs");
var selfLib = require("sdk/self");

var pageMod = pageMods.PageMod({
    attachTo: ["top"],
    include: "*.youtube.com",
    contentScriptFile: [
        "./script/jquery-1.11.3.min.js",
        "./script/utils.js",
        "./script/interface.js",
        "./script/htube.js"
    ],
    contentStyleFile: "./style/hstyle.css"
});

var defaultQuality = preferences.prefs["defaultQuality", function () {
    pageMod.port.emit("onDefaultQualityChange", arguments);
}];

