const {generateId} = require('../utils/id_util');
const DatabaseManager = require('../database/DatabaseManager');
const ScheduledGame = require('./ScheduledGame');

    async function scheduleGame(guildId, channelId, time, players){
        let id = generateId();
        try{
            let game = new ScheduledGame(id, channelId, guildId, time, players);
            await DatabaseManager.scheduleGame(game);
            return `Game Scheduled!
            ${game.toString()}`
        } catch (err){
            console.error(err);
        }
    }

    async function findGame(guildId, id){
        this.loadSchedules(guildId);
        return {id: id,
             game: this.games[id]};
    }

    async function getGames(guildId){

    }


module.exports = {
    scheduleGame, findGame, getGames
}