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

var pageMod = pageMods.PageMod({
    include: "*.youtube.com",
    contentScriptFile: data.url("htube.js")
});

var defaultQuality = preferences.prefs['defaultQuality', function (prefName) {
    console.log(arguments);
    pageMod.port.emit("onDefaultQualityChange", arguments);
}];

