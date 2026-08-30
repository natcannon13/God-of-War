const { shuffle } = require("../utils/shuffle_util");
const {cats, birds, alliance, lizards, otters, moles, crows, rats, badgers, frogs, bats, knaves} = require("../utils/emoji_util.js");

require ("../utils/shuffle_util.js");

const militants = [`Marquise de Cat ${cats}`, `Eyrie Dynasties ${birds}`, `Underground Duchy ${moles}`, `Lord of the Hundreds ${rats}`, `Keepers in Iron ${badgers}`, `Lilypad Diaspora ${frogs}`];
const insurgents = [`Woodland Alliance ${alliance}`, `Lizard Cult ${lizards}`, `Riverfolk Company ${otters}`, `Corvid Conspiracy ${crows}`, `Twilight Council ${bats}`, `Knaves of the Deepwood ${knaves}`];

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