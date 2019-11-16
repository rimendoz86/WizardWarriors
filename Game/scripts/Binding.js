function bindingClass (controllerRef){
    this.ControllerRef = controllerRef;
    this.MouseTracking();
    this.SetGlobalTimer();
    this.RegisterPlayerMovement();
    this.TimerActions = [
        new TimerAction( () => {this.RunsEverySecond()}, 1, null),
        new TimerAction( () => {this.SpawnEnemy()}, 5, null ),
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
        this.ControllerRef.MoveUnit(this.ControllerRef.Model.Player); 
        GlobalModelRef.Enemies.forEach((enemy) => 
        {
            if(enemy.Target && enemy.Stats.IsAlive)
                this.ControllerRef.MoveToTarget(enemy);
        });
    }, 20
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
            //If unit is alive, make it look dead and then despawn after 5 seconds
            gameUnit.DomRef.ReplaceClass(null,"isDead");
            setTimeout(()=> { gameUnit.DomRef.Remove()}, 5000);
            GlobalViewRef.MessageCenter.Add(`${gameUnit.ID} has been killed`);
        }else{
            gameUnit.SetTarget(GlobalModelRef.Player);
        }
    });
    GlobalModelRef.AllGameUnits = allGameUnits.filter( x => x.Stats.IsAlive == true);
    console.log("This Runs Forever");
  }

  bindingClass.prototype.SpawnEnemy = function () {
    let enemyId = GlobalModelRef.Enemies.length + 1;
    let spawnX = parseInt(Math.random() * PlayArea.MaxRight);
    let spawnY = parseInt(Math.random() * 200);

    this.ControllerRef.SpawnUnit('Demon '+enemyId, GameUnitType.Enemy, spawnX, spawnY);
  }

  bindingClass.prototype.TargetPlayer = function (){
    let model = GlobalModelRef;
    model.Enemies.forEach((enemy) => {
        let player = model.Player
        enemy.setTarget(player);
    });
  }

  bindingClass.prototype.AttackTarget = function () {
    let model = GlobalModelRef;
    model.Enemies.forEach((enemy) => {
        if(enemy.IsTargetInRange(30)) 
            Attack.Basic(enemy, enemy.Target)
    });
  }