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

    }

    async checkDuplicates(time, players){

    }

    async reschedule(id){

    }

    async scheduleGame(game){
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

    }

    async getGames(guildId){

    }
    
}

module.exports = new DatabaseManager();