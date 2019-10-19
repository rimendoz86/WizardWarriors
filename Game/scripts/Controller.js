function controllerClass (){
  window.GlobalControllerRef = this;
    this.Model = new modelClass();
    this.SpawnPlayer();
    this.RegisterPlayerMovement();
};

controllerClass.prototype.RegisterPlayerMovement = function() {
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyRelease);
  setInterval(
    () => { this.loopMoveUnit(this.Model.Player);}, 90
  )
}

controllerClass.prototype.SetMousePosition = function(mouseTop, moustLeft){
    this.Model.Player.UnitLocation.UpdateRotateDeg(moustLeft, mouseTop);
}

controllerClass.prototype.SpawnPlayer = function () {
    var player  = new Player();
    player.UnitLocation.Left = 50;
    player.UnitLocation.Top = 50;
    player.UnitLocation.UpdateLocation();
    this.Model.Player = player;
}

controllerClass.prototype.loopMoveUnit = function(gameUnit) {
  if (gameUnit.UnitLocation.MOVE_UP) { gameUnit.UnitLocation.Top -= gameUnit.Stats.Speed; };
  if (gameUnit.UnitLocation.MOVE_DOWN) { gameUnit.UnitLocation.Top += gameUnit.Stats.Speed; };
  if (gameUnit.UnitLocation.MOVE_RIGHT) { gameUnit.UnitLocation.Left += gameUnit.Stats.Speed; };
  if (gameUnit.UnitLocation.MOVE_LEFT) { gameUnit.UnitLocation.Left -= gameUnit.Stats.Speed;  };

  gameUnit.UnitLocation.UpdateLocation();
}

function keyDown(e) {
  if (e.keyCode === 87) { GlobalControllerRef.Model.Player.UnitLocation.MOVE_UP = true };
  if (e.keyCode === 83) { GlobalControllerRef.Model.Player.UnitLocation.MOVE_DOWN = true };
  if (e.keyCode === 68) { GlobalControllerRef.Model.Player.UnitLocation.MOVE_RIGHT = true };
  if (e.keyCode === 65) { GlobalControllerRef.Model.Player.UnitLocation.MOVE_LEFT = true };
}

function keyRelease(e) {
  if (e.keyCode === 87) { GlobalControllerRef.Model.Player.UnitLocation.MOVE_UP = false };
  if (e.keyCode === 83) { GlobalControllerRef.Model.Player.UnitLocation.MOVE_DOWN = false };
  if (e.keyCode === 68) { GlobalControllerRef.Model.Player.UnitLocation.MOVE_RIGHT = false };
  if (e.keyCode === 65) { GlobalControllerRef.Model.Player.UnitLocation.MOVE_LEFT = false };
}