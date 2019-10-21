document.getElementById("playerName").addEventListener("keydown", (event)=>{
    document.cookie = `nickname=${event.target.value};`
})