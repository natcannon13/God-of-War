const {SlashCommandBuilder} = require('discord.js');
const {generatePool} = require("../draft/draft_generator.js");

const command = new SlashCommandBuilder()
    .setName('draft')
    .setDescription('Generates a drafting pool for Advanced Setup')
    .addIntegerOption(option =>
        option.setName('playercount')
            .setDescription('The number of players in the game. Defaults to 4')
            .setRequired(false)
    );

async function execute(interaction){
    const playerCount = interaction.options.getInteger('playerCount')
    const draftPool = generatePool((playerCount || 4));
    let message = "__**Advanced Setup Draft**__\n";
    for(const faction of draftPool){
        message += `- **${faction}**\n`;
    }
    await interaction.reply(message);
}

module.exports = {
    data: command,
    execute
}