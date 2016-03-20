var pageMods = require("sdk/page-mod");
var data = require("sdk/self").data;

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
