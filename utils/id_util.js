function generateId(){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for(let i = 0; i < 6; i++){
        id += characters.charAt(Math.floor(Math.random() * 36));
    }
    return id;
}

module.exports = {
    generateId
}