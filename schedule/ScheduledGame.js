class ScheduledGame{
    constructor(id, channelId, guildId, time, players){
        this._id = id;
        this.channelId = channelId;
        this.guildId = guildId;
        this.time = time;
        this.players = players;
        this.mod = null;
        this.tournament = false;
    }

    toString(){
        return `
    Game ID: ${this._id}
    Time: <t:${this.time}:F>
    Players: <@${this.players[0]}>, <@${this.players[1]}>, <@${this.players[2]}>, <@${this.players[3]}>${this.players[4] ? ', <@' + this.players[4] + '>' : ''}
        `;
    }

    
}
module.exports = ScheduledGame;