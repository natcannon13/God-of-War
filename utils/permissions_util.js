const {getModRole} = require ('./config_util');

async function isMod(guildId, user){
    const modRole = await getModRole(guildId);
    return !!modRole && user.roles.cache.has(modRole);
}

function isInGame(user, players){
    return players.includes(user);
}

module.exports = {
    isMod,
    isInGame,
}