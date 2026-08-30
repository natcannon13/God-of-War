const {SlashCommandBuilder} = require('discord.js');
const {generatePool} = require("../draft/draft_generator.js");
const schedule_manager = require("../schedule/schedule_manager.js");

const command = new SlashCommandBuilder()
    .setName('reschedule')
    .setDescription('Reschedules an existing Root game')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('The ID of the game to reschedule')
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('time')
            .setDescription('The new UTC timestamp of the game')
            .setRequired(true)
    )
    ;

async function execute(interaction){
   const id = interaction.options.getString('id');
   const time = interaction.options.getInteger('time');
   const response = await schedule_manager.reschedule(interaction.member, id, time);
   return ({
    content: response,
    allowedMentions: {roles: []}
   });
}

module.exports = {
    data: command,
    execute
}