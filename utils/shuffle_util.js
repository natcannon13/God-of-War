function shuffle(list){
    let array = [...list]
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const newPos = array[i];
        array[i] = array[j];
        array[j] = newPos;
    }
    return array;
}

module.exports = {
    shuffle
}