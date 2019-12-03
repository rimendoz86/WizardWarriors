function bindingClass (controllerRef){
    this.ControllerRef = controllerRef;
    this.MouseTracking();
    this.SetGlobalTimer();
    this.RegisterPlayerMovement();
    this.TimerActions = [
        new TimerAction( () => {this.RunsEverySecond()}, 1, null),
        new TimerAction( () => {this.SetTargets() }, 1, null),
        new TimerAction( () => {this.ControllerRef.SpawnAlly()}, 10, null),
        new TimerAction( () => {this.ControllerRef.SpawnEnemy()}, 3, null ),
        new TimerAction( () => {this.AttackTarget()}, 2, null )
    ];
    window.GlobalBindingRef = this;
    console.log(this);
};

bindingClass.prototype.RegisterPlayerMovement = function () {
    window.addEventListener("keydown", this.KeyDown);
    window.addEventListener("keyup", this.KeyRelease);
    setInterval(
      () => { 
        let playerUnit = this.ControllerRef.Model.Player;
        if(!playerUnit.Stats.IsAlive){
            GlobalModelRef.IsGameOver = true;
            GlobalModelRef.GameStats.IsGameOver = true;
            return;
        }

        this.ControllerRef.MoveUnit(playerUnit); 
        GlobalModelRef.AllGameUnits.forEach((unit) => 
        {
            if(unit.Target 
                && unit.Stats.IsAlive 
                && unit.GameUnitType != GameUnitType.Player){
                    this.ControllerRef.MoveToTarget(unit);
                    unit.UnitLocation.UpdateRotateDeg(unit.Target.UnitLocation.Left, unit.Target.UnitLocation.Top);
                }
                unit.UnitLocation.UpdateLocation();
        });
    }, 33
    )
  }

bindingClass.prototype.MouseTracking = function(){
    var playArea = new DomRef('playArea');
    playArea.nativeElementRef.addEventListener("mousemove" , (e) => {
        this.ControllerRef.SetMousePosition(e.layerY, e.layerX)
    });
}

bindingClass.prototype.SetGlobalTimer = function(){
    var _globalTimer = setInterval(() => {

        this.TimerActions.forEach((timerAction) => {
            if(( timerAction.Iteration % timerAction.RunEvery) == 0)  
                timerAction.Action();

            timerAction.Iteration += 1; 
            if (timerAction.RunMax != null && timerAction.Iteration > timerAction.RunMax) timerAction.Dispose = true;
        });

        this.TimerActions = this.TimerActions.filter(x => x.Dispose == false);
    }, 1000);
}

bindingClass.prototype.KeyDown = function (e) {
    let playerRef = GlobalControllerRef.Model.Player.UnitLocation;
    if (e.keyCode === 87) { playerRef.MOVE_UP = true };
    if (e.keyCode === 83) { playerRef.MOVE_DOWN = true };
    if (e.keyCode === 68) { playerRef.MOVE_RIGHT = true };
    if (e.keyCode === 65) { playerRef.MOVE_LEFT = true };
  }
  
  bindingClass.prototype.KeyRelease = function(e) {
    let playerRef = GlobalControllerRef.Model.Player.UnitLocation;
    if (e.keyCode === 87) { playerRef.MOVE_UP = false };
    if (e.keyCode === 83) { playerRef.MOVE_DOWN = false };
    if (e.keyCode === 68) { playerRef.MOVE_RIGHT = false };
    if (e.keyCode === 65) { playerRef.MOVE_LEFT = false };
  }

  bindingClass.prototype.RunsEverySecond = () => {
    let allGameUnits = GlobalModelRef.AllGameUnits;
    allGameUnits.forEach(gameUnit => {

        if(!gameUnit.Stats.IsAlive) {
            //If unit is not alive, make it look dead and then despawn after 5 seconds
            gameUnit.DomRef.ReplaceClass(null,"isDead");
            setTimeout(()=> { gameUnit.DomRef.Remove()}, 5000);
            GlobalViewRef.MessageCenter.Add(`${gameUnit.ID} has been killed`);
        }
    });
    GlobalModelRef.AllGameUnits = allGameUnits.filter( x => x.Stats.IsAlive == true);
  }

  bindingClass.prototype.SetTargets = function (){
    let model = GlobalModelRef;
    let enemies = model.Enemies();
    let allies = model.Allies();
    let targetToSelect = model.Player;

    model.AllGameUnits.forEach((unit) => {
        if (unit.Target && unit.Target.Stats.IsAlive) return;

        switch (unit.GameUnitType) {
            case GameUnitType.Ally:
                if (enemies.length < 1) return;
                targetToSelect = Utility.RandomFromArray(enemies);
                break;

            case GameUnitType.Enemy:
                if (allies.length < 1) return;
                targetToSelect = Utility.RandomFromArray(allies);
                break;
        }
        unit.SetTarget(targetToSelect);
    });
  }

  bindingClass.prototype.AttackTarget = function () {
    let model = GlobalModelRef;

    model.AllGameUnits.forEach((unit) => {
        if(unit.GameUnitType == GameUnitType.Player || !unit.Target || !unit.IsTargetInRange(30)) return;
            
        Attack.Basic(unit, unit.Target)
    });
}