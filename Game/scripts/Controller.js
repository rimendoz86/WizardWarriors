function controllerClass (){
    this.Model = new modelClass();
    this.SpawnPlayer();
    window.GlobalControllerRef = this;
};

controllerClass.prototype.SetMousePosition = function(mouseTop, moustLeft){
    this.Model.SetMousePosition(mouseTop, moustLeft);
}

controllerClass.prototype.SpawnPlayer = function () {
    let player  = new Player();
    player.UnitLocation.Left = 50;
    player.UnitLocation.Top = 50;
    player.UnitLocation.UpdateLocation();
    this.Model.Player = player;
}

controllerClass.prototype.MovePlayerLeft = function(){
    this.Model.Player.MovePlayerLeft();
}

controllerClass.prototype.MovePlayerUp = function(){
    this.Model.Player.MovePlayerUp();
}

controllerClass.prototype.MovePlayerRight = function(){
    this.Model.Player.MovePlayerRight();
}

controllerClass.prototype.MovePlayerDown = function(){
    this.Model.Player.MovePlayerDown();
}