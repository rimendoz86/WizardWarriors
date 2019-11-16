function bindingClass (controllerRef){
    this.ControllerRef = controllerRef;
    this.EnemyCounter = 0;
    this.AllyCounter = 0;
    this.MouseTracking();
    this.SetGlobalTimer();
    this.RegisterPlayerMovement();
    this.TimerActions = [
        new TimerAction( () => {this.RunsEverySecond()}, 1, null),
        new TimerAction( () => {this.SetTargets() },1,null),
        new TimerAction( () => {this.SpawnAlly()}, 7, null),
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
        }
    });
    GlobalModelRef.AllGameUnits = allGameUnits.filter( x => x.Stats.IsAlive == true);
    console.log("This Runs Forever");
  }

  bindingClass.prototype.SpawnEnemy = function () {
    let enemyId = ++this.EnemyCounter;
    let spawnX = parseInt(Math.random() * PlayArea.MaxRight);
    let spawnY = parseInt(Math.random() * 200);

    this.ControllerRef.SpawnUnit('Demon-'+enemyId, GameUnitType.Enemy, spawnX, spawnY);
  }

  bindingClass.prototype.SpawnAlly = function(){
    let allyID = ++this.AllyCounter;
    let spawnX = parseInt(Math.random() * PlayArea.MaxRight);
    let spawnY = 300 + parseInt(Math.random() * 200);

    this.ControllerRef.SpawnUnit('Knight-'+allyID, GameUnitType.Ally, spawnX, spawnY);
  }

  bindingClass.prototype.SetTargets = function (){
    let model = GlobalModelRef;

    model.Enemies.forEach((enemy) => {
        if (enemy.Stats.Health > 1)
            enemy.SetTarget(model.Player);
    });

    model.Allies.forEach((ally) => {
        if (model.Enemies.length < 1 || (ally.Target && ally.Target.Stats.Health > 0)) return;

        enemies = model.Enemies.filter( e => e.Stats.Health > 0)
        enemySelect = parseInt(Math.random() * enemies.length)
        ally.SetTarget(enemies[enemySelect]);
    });
  }

  bindingClass.prototype.AttackTarget = function () {
    let model = GlobalModelRef;
    
    model.Enemies.forEach((enemy) => {
        if(enemy.IsTargetInRange(30)) 
            Attack.Basic(enemy, enemy.Target)
    });

    model.Allies.forEach((ally) => {
        if (ally.Target && ally.IsTargetInRange(30))
            Attack.Basic(ally, ally.Target)
    });
  }