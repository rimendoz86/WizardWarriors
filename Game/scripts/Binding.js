function bindingClass (controllerRef){
    this.ControllerRef = controllerRef;
    this.MouseTracking();
    this.SetGlobalTimer();
    this.RegisterPlayerMovement();
    this.TimerActions = [
        new TimerAction( function () {this.ControllerRef.RunsEverySecond()}, 1, null)
    ];
    window.GlobalBindingRef = this;
};

bindingClass.prototype.RegisterPlayerMovement = function () {
    window.addEventListener("keydown", this.KeyDown);
    window.addEventListener("keyup", this.KeyRelease);
    setInterval(
      () => { this.ControllerRef.MoveUnit(this.ControllerRef.Model.Player); }, 20
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