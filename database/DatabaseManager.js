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
    }

    async findGame(id){
        let game = null;
        try{
            await this.client.connect();
            game = await this.client.db("root-scheduling").collection("matches").findOne({_id: id});
        }
        catch(err){
            throw(err);
        }
        finally{
            await this.client.close();
            return game;
        }
        
    }

    //doesn't work right now. Need to fix this.
    async checkDuplicates(time, players){
        let found = false;
        try{
            await this.client.connect();
            found = await this.client.db("root-scheduling").collection("matches").findOne({time: time, players: players});
        }
        catch(err){
            console.error(err);
        }
        finally{
            await this.client.close();
        }
        if(found){
            return true;
        }
        else{
            return false;
        }
    }

    async reschedule(id, newTime){
        try{
            await this.client.connect();
            await this.client.db("root-scheduling").collection("matches").updateOne({_id: id}, {$set : {time: newTime}})
        }
        catch(err){
            console.error(err);
        }
        finally{
            await this.client.close();
        }
    }

    async changePlayers(id, newPlayers){
        try{
            await this.client.connect();
            await this.client.db("root-scheduling").collection("matches").updateOne({_id: id}, {$set : {players: newPlayers}})
        }
        catch(err){
            console.error(err);
        }
        finally{
            await this.client.close();
        }
    }
    

    async scheduleGame(game){
        /*if(this.checkDuplicates(game.time, game.players)){
            throw("This game is already scheduled!");
        }*/
        try{
            await this.client.connect();
            await this.client.db("root-scheduling").collection("matches").insertOne(game);
        }
        catch(err){
            console.error(err);
        }
        finally{
            await this.client.close();
        }
    }

    async deleteGame(id){
        try{
            await this.client.connect();
            await this.client.db("root-scheduling").collection("matches").deleteOne({_id: id});
        }
        catch(err){
            console.error(err);
        }
        finally{
            await this.client.close();
        }
    }

    async getGames(guildId){
        try{
            await this.client.connect();
            const games = await this.client.db("root-scheduling").collection("matches").find({guildId, guildId});
        }
        catch(err){
            console.error(err);
        }
        finally{
            await this.client.close();
        }
        return games;
    }

    async saveConfig(guildId, config){
        try{
            await this.client.connect();
            await this.client.db("root-scheduling").collection("server-config").updateOne({_id: guildId}, {$set : config}, {upsert: true});
        }
        catch(err){
            console.error(err);
        }
        finally{
            await this.client.close();
        }
    }

    async getConfig(guildId){
        let guildConfig = null;
        try{
            await this.client.connect();
            guildConfig = await this.client.db("root-scheduling").collection("server-config").findOne({_id: guildId});
        }
        catch(err){
            console.error(err);
        }
        finally{
            await this.client.close();
            return guildConfig;
        }
    }
    
}

module.exports = new DatabaseManager();