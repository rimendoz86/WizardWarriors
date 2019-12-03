function viewClass (){
    window.GlobalViewRef = this;
    this.ValidationMessage = new DomRef('validationMessage');
    this.LoginForm = new DomRef('loginForm');
    this.TopScoreTable = new DomRef('topScoreTable');
    this.SavedGamesTable = new DomRef('savedGamesTable')
};

viewClass.prototype.ShowTopScores = function(scores){
    if(scores.length == 0){
        this.TopScoreTable.SetInnerHTML('');
        return; 
    } 
    let tableContent = `<thead><tr><th>Login</th><th>PlayerKills</th><th>PlayerLevel</th></tr></thead>
                        <tbody>`;
    scores.forEach(score => {
        tableContent += `
        <tr>
            <td>${score.Login}</td>
            <td>${score.PlayerKills}</td>
            <td>${score.PlayerLevel}</td>
        </tr>
        `
    });
    tableContent += "</tbody>"
    this.TopScoreTable.SetInnerHTML(tableContent);
};

viewClass.prototype.ShowSavedGames = function (scores) {
    if(scores.length == 0){
        this.SavedGamesTable.SetInnerHTML('');
        return; 
    } 
    let tableContent = `<thead><tr><th>ID</th><th>PlayerKills</th><th>PlayerLevel</th><th></th></tr></thead>
                        <tbody>`;
    scores.forEach(score => {
        tableContent += `
        <tr>
            <td>${score.ID}</td>
            <td>${score.PlayerKills}</td>
            <td>${score.PlayerLevel}</td>
            <td><span class="btn" onclick="GlobalControllerRef.ResumeGame(${score.ID})"> Continue </span></td>
        </tr>
        `
    });
    tableContent += "</tbody>"
    this.SavedGamesTable.SetInnerHTML(tableContent);
}