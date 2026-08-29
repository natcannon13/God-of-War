const {generateId} = require('../utils/id_util');
const DatabaseManager = require('../database/DatabaseManager');
const ScheduledGame = require('./ScheduledGame');
const ReminderManager = require('./ReminderManager');
const { isMod, isInGame } = require('../utils/permissions_util');

    async function scheduleGame(user, guildId, channel, time, players){
        let id = "";
        if(channel.isThread()){
            id = channel.name;
        }
        else{
            id = generateId();
        }
        if(!(await isMod(guildId, user)) && !isInGame(user.id, players)){
            return "Only moderators can schedule games they are not in."
        }
        try{
            let game = new ScheduledGame(id, channel.id, guildId, time, players);
            await DatabaseManager.scheduleGame(game);
            ReminderManager.scheduleReminder(game);
            return `Game Scheduled!
        ${game.toString()}`
        } catch (err){
            console.error(err);
            return err.message || String(err);
        }
    }

    async function reschedule(user, id, time){
        let found = await findGame(id);
        if(!found){
            return "No game found with that ID!";
        }
        if(!await isMod(found.guildId, user) && !isInGame(user.id, found.players)){
            return "Only moderators can reschedule games they are not in."
        }
        else{
            try{
                await DatabaseManager.reschedule(id, time);
                ReminderManager.cancelReminder(id);
                let game = await findGame(id);
                ReminderManager.scheduleReminder(toGameObject(game));
                return `Game Rescheduled!\n${toGameObject(game).toString()}`;
            }
            catch(err){
                console.error(err);
                return "There was an error rescheduling your game.";
            }
        }
    }

    async function cancel(user, id){
        let game = await findGame(id);
        if(!game){
            return "No game found with that ID!";
        }
        if(!await isMod(game.guildId, user) && !isInGame(user.id, game.players)){
            return "Only moderators can cancel games they are not in."
        }
        else{
            try{
                await DatabaseManager.deleteGame(id);
                ReminderManager.cancelReminder(id);
                return `Game Canceled!` + toGameObject(game).toString();
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

    async function getSchedule(guildId, playerId){
        let games = await DatabaseManager.getPlayerSchedule(playerId, guildId);
        if(!games ||  games.length === 0){
            return null;
        }
        let gamesString = "";
        for(const g of games){
            let game = toGameObject(g);
            gamesString += game.toString();
            gamesString += "\n";
        }
        return gamesString;
    }

    function toGameObject(dbData){
        return Object.assign(new ScheduledGame(), dbData);
    }


module.exports = {
    scheduleGame, findGame, getSchedule, reschedule, cancel
}