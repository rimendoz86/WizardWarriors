function controllerClass() {
  window.GlobalControllerRef = this;
  this.Model = new modelClass();
  this.SpawnUnit('player', GameUnitType.Player, 600, 350);
  this.SpawnUnit('enem_1', GameUnitType.Enemy, 600, 300);
  this.SpawnUnit('ally_1', GameUnitType.Ally, 600, 400);
};

controllerClass.prototype.SetMousePosition = function (mouseTop, moustLeft) {
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

  switch (gameUnitType) {
    case GameUnitType.Player:
      gameUnit.DomRef.ReplaceClass(null,'player')
      this.Model.Player = gameUnit;
      this.Model.Allies.push(gameUnit);
      break;
    case GameUnitType.Ally:
      gameUnit.DomRef.ReplaceClass(null,'ally')
      this.Model.Allies.push(gameUnit);
      break;
    case GameUnitType.Enemy:
      gameUnit.DomRef.ReplaceClass(null,'enemy')
      this.Model.Enemies.push(gameUnit);
      defaultClickAction = () => { Attack.Basic(this.Model.Player, gameUnit) };
      break;
  }

  gameUnit.DomRef.SetOnClick(defaultClickAction);
  this.Model.AllGameUnits.push(gameUnit);
  gameUnit.UnitLocation.UpdateLocation();
}

controllerClass.prototype.MoveUnit = function (gameUnit) {

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

  gameUnit.UnitLocation.UpdateLocation();
}