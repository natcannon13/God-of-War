const { shuffle } = require("../utils/shuffle_util");

require ("../utils/shuffle_util.js");

const militants = ["Marquise de Cat", "Eyrie Dynasties", "Underground Duchy", "Lord of the Hundreds", "Keepers in Iron", "Lilypad Diaspora"];
const insurgents = ["Woodland Alliance", "Lizard Cult", "Riverfolk Company", "Corvid Conspiracy", "Twilight Council", "Knaves of the Deepwood"];

function generatePool(playerCount){
    let factions = shuffle(militants);
    let pool = [factions.pop()];
    factions = shuffle(factions.concat(insurgents));
    for(let i = 0; i < playerCount; i++){
        pool.push(factions.pop());
    }
    return pool;
}

module.exports = {
    generatePool
}