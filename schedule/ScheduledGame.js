class ScheduledGame{
    constructor(id, channelId, guildId, time, players){
        this.id = id;
        this.channelId = channelId;
        this.guildId = guildId;
        this.time = time;
        this.player1 = players[0];
        this.player2 = players[1];
        this.player3 = players[2];
        this.player4 = players[3];
        if(players[4]){
            this.player5 = players[4];
        }
        else{
            this.player5 = null;
        }
    }

    toString(){
        return `
    Game ID: ${this.id}
    Time: <t:${this.time}>
    Players: <@${this.player1}>, <@${this.player2}>, <@${this.player3}>, <@${this.player4}>${this.player5 ? ', <@' + player5 + '>' : ''}
        `;
    }
}
module.exports = ScheduledGame;