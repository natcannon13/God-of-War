const {shuffle} = require("../utils/shuffle_util");
const {generatePool} = require("../draft/draft_generator");

class MessageManager{

    constructor(client){
        this.client = client;
    }

    async sendReminder(game){
        let channel;
        try{
            channel = await this.client.channels.fetch(game.channelId);
        }
        catch(e){
            console.error(`Failed to fetch channel for game ${game._id}:`, e);
            return false;
        }
        if(!channel || typeof channel.send !== 'function'){
            console.error(`Channel for game ${game._id} is not sendable`);
            return false;
        }

        const players = shuffle(game.players);
        let msg = `Your game, **${game._id}**, is scheduled to begin <t:${game.time}:R>!\n`;
        msg += `\n**Seat order:**\n`;
        for(let p = 0; p < players.length; p++){
            msg += `${p + 1}. <@${players[p]}>\n`;
        }
        const factions = generatePool(players.length);
        msg += `\n**Advanced Setup Draft:**\n`;
        for(const f of factions){
            msg += `- **${f}**\n`;
        }
        try{
            await channel.send(msg);
            return true;
        }
        catch(e){
            console.error(`Failed to send reminder for game ${game._id}:`, e);
            return false;
        }
    }
}

module.exports = MessageManager
