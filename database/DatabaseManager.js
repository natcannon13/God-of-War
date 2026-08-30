const { MongoClient, ServerApiVersion } = require('mongodb');
const {uri} = require('../config.json');

class DatabaseManager{
    constructor(){
        this.client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });
        this._ready = this.client.connect().catch(async (err) => {
            const isTls = String(err.message).includes('SSL') || String(err.message).includes('tlsv1');
            if (isTls) {
                let publicIp = 'unknown';
                try {
                    publicIp = await fetch('https://api.ipify.org').then((r) => r.text());
                } catch (_) {}
                console.error(`MongoDB TLS handshake failed (SSL alert 80). Atlas typically does this when this machine's IP is not on the cluster Network Access list. In Atlas: Network Access → Add IP Address, add ${publicIp} (or 0.0.0.0/0 for testing), wait about a minute, then restart the bot.`);
            }
            throw err;
        });
    }

    async _ensureConnected(){
        await this._ready;
    }

    async findGame(id){
        let game = null;
        try{
            await this._ensureConnected();
            game = await this.client.db("root-scheduling").collection("matches").findOne({_id: id});
        }
        catch(err){
            throw(err);
        }
        finally{
            
            return game;
        }
        
    }

    async checkDuplicates(id, time, players){
        await this._ensureConnected();
        const found = await this.client.db("root-scheduling").collection("matches").findOne({
            $or: [
                { _id: id },
                { time: time, players: players }
            ]
        });
        return !!found;
    }

    async reschedule(id, newTime){
        try{
            await this._ensureConnected();
            await this.client.db("root-scheduling").collection("matches").updateOne({_id: id}, {$set : {time: newTime, reminderSent: false}})
        }
        catch(err){
            console.error(err);
        }
        finally{
            
        }
    }

    async substitute(id, oldPlayer, newPlayer){
        try{
            await this._ensureConnected();
            await this.client.db("root-scheduling").collection("matches").updateOne(
                {_id: id,
                    players: oldPlayer
                },
                {
                    $set: {
                        "players.$" : newPlayer
                    }
                }
            )
        }
        catch(err){
            console.error(err);
        }
        finally{
            
        }
    }
    

    async scheduleGame(game){
        await this._ensureConnected();
        if(await this.checkDuplicates(game._id, game.time, game.players)){
            throw new Error("This game is already scheduled!");
        }
        try{
            await this.client.db("root-scheduling").collection("matches").insertOne({
                _id: game._id,
                channelId: game.channelId,
                guildId: game.guildId,
                time: game.time,
                players: game.players,
                mod: game.mod,
                tournament: game.tournament,
                reminderSent: false,
                submitted: false
            });
        }
        catch(err){
            if(err.code === 11000){
                throw new Error("This thread already has a game scheduled!");
            }
            throw err;
        }
    }

    async deleteGame(id){
        try{
            await this._ensureConnected();
            await this.client.db("root-scheduling").collection("matches").deleteOne({_id: id});
        }
        catch(err){
            console.error(err);
        }
        finally{
            
        }
    }

    async cleanCompletedGames(){
        try{
            const currentTime = Date.now()/1000;
            await this._ensureConnected();
            await this.client.db("root-scheduling").collection("matches").deleteMany({
                time:{
                    $lt: currentTime
                },
                submitted: true
            });
        }
        catch(err){
            console.error(err);
        }
    }

    async getImminentGames(minutes){
        const currentTime = Date.now() / 1000;
        const reminderLead = 60 * minutes;
        let games = [];
        try{
            await this._ensureConnected();
            games = await this.client.db("root-scheduling").collection("matches").find({
                time: {
                    $gt: currentTime,
                    $lte: currentTime + reminderLead * 2
                },
                reminderSent: { $ne: true }
            }).toArray();
        }
        catch(err){
            console.error(err);
        }
        return games;
    }

    async markReminderSent(id){
        try{
            await this._ensureConnected();
            await this.client.db("root-scheduling").collection("matches").updateOne({_id: id}, {$set : {reminderSent: true}});
        }
        catch(err){
            console.error(err);
        }
    }

    async getPlayerSchedule(playerId, guildId){
        let games = [];
        try{
            let currentTime = Date.now() / 1000;
            await this._ensureConnected();
            games = await this.client.db("root-scheduling").collection("matches").find({players: playerId, guildId: guildId, time:{$gt: currentTime}}).toArray();
        }
        catch(err){
            console.error(err);
        }
        return games;
    }

    async saveConfig(guildId, config){
        try{
            await this._ensureConnected();
            await this.client.db("root-scheduling").collection("server-config").updateOne({_id: guildId}, {$set : config}, {upsert: true});
        }
        catch(err){
            console.error(err);
        }
        finally{
            
        }
    }

    async getConfig(guildId){
        let guildConfig = null;
        try{
            await this._ensureConnected();
            guildConfig = await this.client.db("root-scheduling").collection("server-config").findOne({_id: guildId});
        }
        catch(err){
            console.error(err);
        }
        finally{
            
            return guildConfig;
        }
    }
    
}

module.exports = new DatabaseManager();
