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
    include: "*.youtube.com",
    contentScriptFile: [
        selfLib.data.url("script/utils.js"),
        selfLib.data.url("script/ui.js"),
        selfLib.data.url("script/htube.js")
    ],
    contentStyleFile: [selfLib.data.url("style/hstyle.css")]
});

var defaultQuality = preferences.prefs["defaultQuality", function (prefName) {
    pageMod.port.emit("onDefaultQualityChange", arguments);
}];

