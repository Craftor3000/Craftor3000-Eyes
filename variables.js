const {createAudioPlayer} = require("@discordjs/voice");

var connection = null;
var connectionChannelId = null;
var connectionChange = [];
var lastPlayerStream = null;
const player = createAudioPlayer();
var playerPause = false;
var musicQueue = [];
var audioPlaying = false;
var uploadTicketEmbed = false;
var lastTicketData = [];

var globalVars = new Map();
globalVars.set("connection", connection).set("connectionChannelId", connectionChannelId).set("connectionChange", connectionChange).set("lastPlayerStream", lastPlayerStream).set("player", player).set("playerPause", playerPause).set("musicQueue", musicQueue).set("audioPlaying", audioPlaying).set("uploadTicketEmbed", uploadTicketEmbed).set("lastTicketData", lastTicketData);

module.exports = {
    name: "Global Variables",
    description: "Stock all the global variables",
    get (varName){
        if(globalVars.has(varName)){
            return globalVars.get(varName);
        } else {
            return null;
        }
    },
    set (varName, value){
        if(globalVars.has(varName)){
            globalVars.set(varName, value);
            return true;
        } else {
            return false;
        }
    },
    reset () {
        connection = null;
        connectionChannelId = null;
        connectionChange = [];
        lastPlayerStream = null;
        player = createAudioPlayer();
        playerPause = false;
        musicQueue = [];
        audioPlaying = false;
        uploadTicketEmbed = false;
        lastTicketData = [];
        var globalVars = new Map();
        globalVars.set("connection", connection).set("connectionChannelId", connectionChannelId).set("connectionChange", connectionChange).set("lastPlayerStream", lastPlayerStream).set("player", player).set("playerPause", playerPause).set("musicQueue", musicQueue).set("audioPlaying", audioPlaying).set("uploadTicketEmbed", uploadTicketEmbed).set("lastTicketData", lastTicketData);
    }
}