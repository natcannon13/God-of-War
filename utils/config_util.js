const DatabaseManager = require("../database/DatabaseManager");

let configMap = new Map();

class Config{
    constructor(guildId){
        this._id = guildId;
        this.outputChannel = null;
        this.modRole = null;
        this.videoChannel = null;
    }

    setOutputChannel(channel){
        this.outputChannel = channel;
    }

    setModRole(role){
        this.modRole = role;
    }

    setVideoChannel(channel){
        this.videoChannel = channel;
    }

    toString(){
return(
`
Output Channel: <#${this.outputChannel}>
Mod Role: <@&${this.modRole}>
Video Channel: <#${this.videoChannel}>
`);
    }
}

async function saveConfig(guildId, outputChannel, modRole, videoChannel) {
    let guildConfig = new Config(guildId);

    guildConfig.setOutputChannel(outputChannel);
    guildConfig.setModRole(modRole);
    guildConfig.setVideoChannel(videoChannel);
    configMap.set(guildId, guildConfig);
    await DatabaseManager.saveConfig(guildId, guildConfig);
    return guildConfig.toString();
}

async function loadConfig(guildId) {
    const jsonData = await DatabaseManager.getConfig(guildId);
    if(!jsonData){
        return null;
    }
    const loadedConfig = Object.assign(new Config(), jsonData);
    configMap.set(guildId, loadedConfig);
    return loadedConfig;
}

async function getConfig(guildId){
    //loads config into Map if not already loaded
    let guildConfig = configMap.get(guildId);
    if(guildConfig){
        return guildConfig;
    }
    guildConfig = await loadConfig(guildId);
    return guildConfig;
}

async function displayConfig(guildId){
    let guildConfig = await getConfig(guildId);
    if(guildConfig){
        return guildConfig.toString();
    }
    return null;
}

async function getOutputChannel(guildId) {
    return (await getConfig(guildId))?.outputChannel;
}

async function getModRole(guildId) {
    return (await getConfig(guildId))?.modRole;
}

async function getVideoChannel(guildId) {
    return (await getConfig(guildId))?.videoChannel;
}

module.exports = {
    Config, saveConfig, loadConfig, getConfig, displayConfig, getOutputChannel, getModRole, getVideoChannel
}
