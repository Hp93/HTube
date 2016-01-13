//var self = require('sdk/self');

//// a dummy function, to show how tests work.
//// to see how to test this function, look at test/test-index.js
//function dummy(text, callback) {
//  callback(text);
//}

//exports.dummy = dummy;


var pageMods = require("sdk/page-mod");
var data = require("sdk/self").data;
//var preferences = require("sdk/simple-prefs");
//var panels = require("sdk/panel");
//var buttons = require("sdk/ui/button/toggle");


var pageMod = pageMods.PageMod({
    attachTo: ["top"],
    include: "*.youtube.com",
    contentScriptFile: [
        "./script/jquery-1.11.3.min.js",
        "./script/interface.js",
        "./script/htube.js"
    ],
    contentStyleFile: "./style/hstyle.css"
});

//var defaultQuality = preferences.prefs["defaultQuality", function () {
//    pageMod.port.emit("onDefaultQualityChange", arguments);
//}];


////====================== Option button ======================
//var button = buttons.ToggleButton({
//    id: "htube-option",
//    label: "HTube Option",
//    icon: {
//        "16": "./image/htube-logo-16.png",
//        "32": "./image/htube-logo-32.png",
//        "64": "./image/htube-logo-64.png"
//    },
//    onClick: handleChange
//});

//function handleChange(state) {
//    if (state.checked) {
//        panel.show({
//            position: button
//        });
//    }
//}


////====================== Option panel =======================
//var panel = panels.Panel({
//    width: 330,
//    height: 400,
//    contentURL: "./option.html",
//    onHide: handleHide
//});

//function handleHide() {
//    button.state("window", { checked: false });
//}

