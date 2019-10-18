function controllerClass (){
    this.Model = new modelClass();
    this.SpawnPlayer();
    window.GlobalControllerRef = this;
};

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

// controllerClass.prototype.MovePlayerLeft = function(){
//     this.Model.Player.MovePlayerLeft();
// }

// controllerClass.prototype.MovePlayerUp = function(){
//     this.Model.Player.MovePlayerUp();
// }

// controllerClass.prototype.MovePlayerRight = function(){
//     this.Model.Player.MovePlayerRight();
// }

// controllerClass.prototype.MovePlayerDown = function(){
//     this.Model.Player.MovePlayerDown();
// }


window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyRelease);

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

function loopMovePlayer() {
  if (GlobalControllerRef.Model.Player.UnitLocation.MOVE_UP) { GlobalControllerRef.Model.Player.UnitLocation.Top -= GlobalControllerRef.Model.Player.Stats.Speed; };
  if (GlobalControllerRef.Model.Player.UnitLocation.MOVE_DOWN) { GlobalControllerRef.Model.Player.UnitLocation.Top += GlobalControllerRef.Model.Player.Stats.Speed; };
  if (GlobalControllerRef.Model.Player.UnitLocation.MOVE_RIGHT) { GlobalControllerRef.Model.Player.UnitLocation.Left += GlobalControllerRef.Model.Player.Stats.Speed; };
  if (GlobalControllerRef.Model.Player.UnitLocation.MOVE_LEFT) { GlobalControllerRef.Model.Player.UnitLocation.Left -= GlobalControllerRef.Model.Player.Stats.Speed;  };

  GlobalControllerRef.Model.Player.UnitLocation.UpdateLocation();
  window.requestAnimationFrame(loopMovePlayer);
}
window.requestAnimationFrame(loopMovePlayer);