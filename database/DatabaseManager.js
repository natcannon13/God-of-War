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
            game = await this.client.db("root-scheduling").collection("matches").findOne({id: id});
        }
        catch(err){
            throw(err);
        }
        finally{
            await this.client.close();
            return game;
        }
        
    }

    async checkDuplicates(time, players){
        try{
            await this.client.connect();
            let found = await this.client.db("root-scheduling").collection("matches").findOne({time: time, players: players});
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
            await this.client.db("root-scheduling").collection("matches").updateOne({id: id}, {$set : {time: newTime}})
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
            await this.client.db("root-scheduling").collection("matches").updateOne({id: id}, {$set : {players: newPlayers}})
        }
        catch(err){
            console.error(err);
        }
        finally{
            await this.client.close();
        }
    }
    

    async scheduleGame(game){
        if(this.checkDuplicates(game.time, game.players)){
            throw("This game is already scheduled!");
        }
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
            await this.client.db("root-scheduling").collection("matches").deleteOne({id: id});
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
    
}

module.exports = new DatabaseManager();