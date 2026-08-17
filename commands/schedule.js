const {SlashCommandBuilder} = require('discord.js');
const {generatePool} = require("../draft/draft_generator.js");
const schedule_manager = require("../schedule/schedule_manager.js");

const command = new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Schedules a Root game for the future')
    .addIntegerOption(option =>
        option.setName('time')
            .setDescription('The UTC timestamp of the game')
            .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('player1')
            .setDescription('Player 1 of the game')
            .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('player2')
            .setDescription('Player 2 of the game')
            .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('player3')
            .setDescription('Player 3 of the game')
            .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('player4')
            .setDescription('Player 4 of the game')
            .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('player5')
            .setDescription('Player 5 of the game')
            .setRequired(false)
    )
    ;

async function execute(interaction){
   const time = interaction.options.getInteger('time');
   const player1 = interaction.options.getUser('player1').id;
   const player2 = interaction.options.getUser('player2').id;
   const player3 = interaction.options.getUser('player3').id;
   const player4 = interaction.options.getUser('player4').id;
   const player5 = interaction.options.getUser('player5');
   const players = [player1, player2, player3, player4];
   if(player5){
    player5 = player5.id;
    players.push(player5);
   }
   const response = await schedule_manager.scheduleGame(interaction.guildId, interaction.channelId, time, players)
   return interaction.reply(response);
}

module.exports = {
    data: command,
    execute
}