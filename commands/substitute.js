const {SlashCommandBuilder} = require('discord.js');
const {generatePool} = require("../draft/draft_generator.js");
const schedule_manager = require("../schedule/schedule_manager.js");

const command = new SlashCommandBuilder()
    .setName('substitute')
    .setDescription('Substitutes a player from an existing Root game')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('The ID of the game needing a substitute')
            .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('oldplayer')
            .setDescription('The player being replaced')
            .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('newplayer')
            .setDescription("The player replacing the original player")
            .setRequired(true)
    )
    ;

async function execute(interaction){
   const id = interaction.options.getString('id');
   const oldPlayer = interaction.options.getUser('oldplayer').id;
   const newPlayer = interaction.options.getUser('newplayer').id;
   const response = await schedule_manager.substitute(interaction.member, id, oldPlayer, newPlayer);
   return interaction.reply(response);
}

module.exports = {
    data: command,
    execute
}