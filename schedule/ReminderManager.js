const DatabaseManager = require('../database/DatabaseManager');
const ScheduledGame = require('./ScheduledGame');
const MessageManager = require('../discord/MessageManager');

class ReminderManager{

    constructor(){
        this.client = null;
        this.messenger = null;
        this.timers = new Map();
        this.pollTimer = null;
        this.reminderMinutes = 60;
        this.pollIntervalMs = 60 * 60 * 1000;
    }

    async initialize(client){
        this.client = client;
        if(!this.messenger){
            this.messenger = new MessageManager(client);
        }
        console.log('ReminderManager initialized');
        try{
            await this.refresh();
        }
        catch(err){
            console.error('Reminder refresh failed:', err);
        }
        this.scheduleNextPoll();
    }

    scheduleNextPoll(){
        if(this.pollTimer){
            clearTimeout(this.pollTimer);
        }
        this.pollTimer = setTimeout(async () => {
            try{
                await this.refresh();
            }
            catch(err){
                console.error('Reminder refresh failed:', err);
            }
            this.scheduleNextPoll();
        }, this.pollIntervalMs);
    }

    async refresh(){
        const docs = await DatabaseManager.getImminentGames(this.reminderMinutes);
        if(!docs){
            return;
        }
        for(const doc of docs){
            this.scheduleReminder(this.toGameObject(doc));
        }
        console.log(`ReminderManager: tracking ${this.timers.size} upcoming reminder(s)`);
    }

    scheduleReminder(game){
        if(!this.messenger || !game || !game._id || this.timers.has(game._id)){
            return;
        }
        const reminderAtMs = (game.time - this.reminderMinutes * 60) * 1000;
        const delayMs = reminderAtMs - Date.now();
        if(delayMs > this.pollIntervalMs){
            return;
        }

        const fire = async () => {
            this.timers.delete(game._id);
            try{
                const sent = await this.messenger.sendReminder(game);
                if(sent){
                    await DatabaseManager.markReminderSent(game._id);
                }
            }
            catch(err){
                console.error(`Failed to fire reminder for game ${game._id}:`, err);
            }
        };

        if(delayMs <= 0){
            fire();
            return;
        }

        this.timers.set(game._id, setTimeout(fire, delayMs));
    }

    cancelReminder(id){
        const timer = this.timers.get(id);
        if(timer){
            clearTimeout(timer);
            this.timers.delete(id);
        }
    }

    toGameObject(dbData){
        return Object.assign(new ScheduledGame(), dbData);
    }

}

module.exports = new ReminderManager();
