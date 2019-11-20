function controllerClass() {
  window.GlobalControllerRef = this;
  this.Model = new modelClass();
  this.SpawnUnit('player', GameUnitType.Player, 600, 350);
};

controllerClass.prototype.SetMousePosition = function (mouseTop, moustLeft) {
  if(!this.Model.Player.Stats.IsAlive) return;
  this.Model.Player.UnitLocation.UpdateRotateDeg(moustLeft, mouseTop);
}

controllerClass.prototype.SpawnUnit = function (unitID, gameUnitType, spawnLeft, spawnTop ) {
  if (this.Model.AllGameUnits.filter( x => x.ID == unitID).length > 0){
    console.log("A unit with this ID already exists");
    return;
  }

  if(!GameUnitType.IsValid(gameUnitType)){
    console.log("This is not a valid unit type");
    return;
  }

  let defaultClickAction = () => { gameUnit.ClickAction()};
  var gameUnit = new GameUnit(unitID);
  gameUnit.UnitLocation.Left = spawnLeft;
  gameUnit.UnitLocation.Top = spawnTop;
  gameUnit.GameUnitType = gameUnitType;
  let playerLevel = this.Model.Player ? this.Model.Player.Stats.Level : 10;

  switch (gameUnitType) {
    case GameUnitType.Player:
      gameUnit.DomRef.ReplaceClass(null,'player')
      this.Model.Player = gameUnit;
      gameUnit.Stats = new Stats(playerLevel);
      break;
    case GameUnitType.Ally:
      gameUnit.DomRef.ReplaceClass(null,'ally')
      gameUnit.Stats = new Stats(playerLevel - 2);
      break;
    case GameUnitType.Enemy:
      gameUnit.DomRef.ReplaceClass(null,'enemy')
      gameUnit.Stats = new Stats(playerLevel - 1);
      defaultClickAction = () => { Attack.Basic(this.Model.Player, gameUnit) };
      break;
  }

  gameUnit.DomRef.SetOnClick(defaultClickAction);
  this.Model.AllGameUnits.push(gameUnit);
  gameUnit.UnitLocation.UpdateLocation();
}

controllerClass.prototype.MoveToTarget = function(gameUnit){
  unitLocation = gameUnit.UnitLocation;
  targetUnitLocation = gameUnit.Target.UnitLocation;

  if(gameUnit.IsTargetInRange(25) || !gameUnit.Stats.IsAlive) return
  unitLocation.MOVE_UP = unitLocation.Top > targetUnitLocation.Top;
  unitLocation.MOVE_DOWN = unitLocation.Top < targetUnitLocation.Top;
  unitLocation.MOVE_LEFT = unitLocation.Left > targetUnitLocation.Left;
  unitLocation.MOVE_RIGHT = unitLocation.Left < targetUnitLocation.Left;
  this.MoveUnit(gameUnit);
}

controllerClass.prototype.MoveUnit = function (gameUnit) {
  if(!gameUnit.Stats.IsAlive) return;

  if (gameUnit.UnitLocation.MOVE_UP) {
    gameUnit.UnitLocation.Top -= gameUnit.UnitLocation.Top - gameUnit.Stats.Speed < PlayArea.MaxTop
      ? 0
      : gameUnit.Stats.Speed;

  };
  if (gameUnit.UnitLocation.MOVE_DOWN) {
    gameUnit.UnitLocation.Top += gameUnit.UnitLocation.Top + gameUnit.Stats.Speed > PlayArea.MaxBottom
      ? 0
      : gameUnit.Stats.Speed;
  };
  if (gameUnit.UnitLocation.MOVE_RIGHT) {
    gameUnit.UnitLocation.Left += gameUnit.UnitLocation.Left + gameUnit.Stats.Speed > PlayArea.MaxRight
      ? 0
      : gameUnit.Stats.Speed;
  };
  if (gameUnit.UnitLocation.MOVE_LEFT) {
    gameUnit.UnitLocation.Left -= gameUnit.UnitLocation.Left - gameUnit.Stats.Speed < PlayArea.MaxLeft
      ? 0
      : gameUnit.Stats.Speed;
  };
}
