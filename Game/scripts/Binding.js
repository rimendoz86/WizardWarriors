function bindingClass (controllerRef){
    this.ControllerRef = controllerRef;
    this.ConfigureKeyBindings();
    this.MouseTracking();
    this.SetGlobalTimer();
    this.TimerActions = [
        new TimerAction()
    ];

    window.GlobalBindingRef = this;
};

bindingClass.prototype.KeyBindings = [
    new KeyBind('KeyW', () => {GlobalControllerRef.MovePlayerUp()}),
    new KeyBind('KeyA', () => {GlobalControllerRef.MovePlayerLeft()}),
    new KeyBind('KeyS', () => {GlobalControllerRef.MovePlayerDown()}),
    new KeyBind('KeyD', () => {GlobalControllerRef.MovePlayerRight()}),
]

bindingClass.prototype.ConfigureKeyBindings = function(){
    window.addEventListener("keydown", (event) => {
        console.log(event);
        let bindings = this.KeyBindings.filter(x => x.KeyCode == event.code);
        bindings.forEach((binding) => {
            binding.KeyDown();
        });
    });

    window.addEventListener("keyup", (event) => {
        let bindings = this.KeyBindings.filter(x => x.KeyCode == event.code);
        bindings.forEach((binding) => { 
            binding.KeyUp(); 
        });
    });
}

bindingClass.prototype.MouseTracking = function(){
    var playArea = new DomRef('playArea');
    playArea.nativeElementRef.addEventListener("mousemove" , (e) => {
        this.ControllerRef.SetMousePosition(e.clientY, e.clientX)
    });
}

bindingClass.prototype.SetGlobalTimer = function(){
    var _globalTimer = setInterval(() => {

        this.TimerActions.forEach((timerAction) => {
            if(( timerAction.Iteration % timerAction.RunEvery) == 0)  
                timerAction.Action();

            timerAction.Iteration += 1; 
            if (timerAction.Iteration > timerAction.RunMax) timerAction.Dispose = true;
        });

        this.TimerActions = this.TimerActions.filter(x => x.Dispose == false);
    }, 1000);
}