const {generateId} = require('../utils/id_util');
const DatabaseManager = require('../database/DatabaseManager');
const ScheduledGame = require('./ScheduledGame');

    async function scheduleGame(guildId, channel, time, players){
        let id = "";
        if(channel.isThread()){
            id = channel.name;
        }
        else{
            id = generateId();
        }

        try{
            let game = new ScheduledGame(id, channel.id, guildId, time, players);
            await DatabaseManager.scheduleGame(game);
            return `Game Scheduled!
        ${game.toString()}`
        } catch (err){
            console.error(err);
            return (err);
        }
    }

    async function reschedule(id, time){
        let found = await findGame(id);
        if(!found){
            return "No game found with that ID!";
        }
        else{
            try{
                await DatabaseManager.reschedule(id, time);
                let game = await findGame(id);
                return `Game Rescheduled!\n${toGameObject(game).toString()}`;
            }
            catch(err){
                console.error(err);
                return "There was an error rescheduling your game.";
            }
        }
    }

    async function cancel(id){
        let game = await findGame(id);
        if(!game){
            return "No game found with that ID!";
        }
        else{
            try{
                await DatabaseManager.deleteGame(id);
                return {
                    message: `Game Canceled!`,
                    info: toGameObject(game).toString()
                }
            }
            catch(err){
                console.error(err);
                return "There was an error deleting this game.";
            }
        }
    }

    async function findGame(id){
        try{
            let game = await DatabaseManager.findGame(id);
            return game;
        }
        catch(err){
            console.error(err);
            return "There was an error finding that game.";
        }
    }

    async function getGames(guildId){

    }

    function toGameObject(dbData){
        return Object.assign(new ScheduledGame(), dbData);
    }


module.exports = {
    scheduleGame, findGame, getGames, reschedule, cancel
}