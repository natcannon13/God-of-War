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
        this.client.connect();
    }

    async findGame(id){
        let game = null;
        try{
            
            game = await this.client.db("root-scheduling").collection("matches").findOne({_id: id});
        }
        catch(err){
            throw(err);
        }
        finally{
            
            return game;
        }
        
    }

    async checkDuplicates(time, players){
        let found = false;
        try{
            found = await this.client.db("root-scheduling").collection("matches").findOne({time: time, players: players});
        }
        catch(err){
            console.error(err);
        }
        finally{
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
            
            await this.client.db("root-scheduling").collection("matches").updateOne({_id: id}, {$set : {time: newTime}})
        }
        catch(err){
            console.error(err);
        }
        finally{
            
        }
    }

    async changePlayers(id, newPlayers){
        try{
            
            await this.client.db("root-scheduling").collection("matches").updateOne({_id: id}, {$set : {players: newPlayers}})
        }
        catch(err){
            console.error(err);
        }
        finally{
            
        }
    }
    

    async scheduleGame(game){
        try{
            
            if(await this.checkDuplicates(game.id, game.time, game.players)){
                throw("This game is already scheduled!");
            }
            await this.client.db("root-scheduling").collection("matches").insertOne(game);
        }
        catch(err){
            console.error(err);

        }
        finally{
            
        }
    }

    async deleteGame(id){
        try{
            
            await this.client.db("root-scheduling").collection("matches").deleteOne({_id: id});
        }
        catch(err){
            console.error(err);
        }
        finally{
            
        }
    }

    async getGames(guildId){
        try{
            
            const games = await this.client.db("root-scheduling").collection("matches").find({guildId, guildId});
        }
        catch(err){
            console.error(err);
        }
        finally{
            
        }
        return games;
    }

    async saveConfig(guildId, config){
        try{
            
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