function Player (){
    this.UnitLocation = new UnitLocation('player');
    this.DomRef = new DomRef('player');
    this.Stats = new Stats();
    this.Stats.Speed = 20;

    this.MovePlayerLeft = function() {
        this.UnitLocation.MoveLeft(this.Stats.Speed);
    }
    this.MovePlayerRight = function() {
        this.UnitLocation.MoveRight(this.Stats.Speed);
    }
    this.MovePlayerUp = function() {
        this.UnitLocation.MoveUp(this.Stats.Speed);
    }
    this.MovePlayerDown = function() {
        this.UnitLocation.MoveDown(this.Stats.Speed);
    }
}

function Stats(){
    this.Speed = 10;
    this.Health = 100;
    this.MaxHealth = 100;
    this.Attack = 100;
}

function Enemy(id) {
    this.UnitLocation = new UnitLocation(id);
    this.DomRef = new DomRef('player');
    this.Stats = new Stats();
}

function UnitLocation(domID){
    this.DomID = domID;
    this.Left;
    this.Top;
    this.RotateDeg;

    this.MoveLeft = function (feet) {
        this.Left -= feet;
        this.UpdateLocation();
    }

    this.MoveRight = function (feet) {
        this.Left += feet;
        this.UpdateLocation();
    }

    this.MoveUp = function (feet) {
        this.Top -= feet;
        this.UpdateLocation();
    }

    this.MoveDown = function (feet) {
        this.Top += feet;
        this.UpdateLocation();
    }

    this.UpdateLocation = function() {
        GlobalViewRef.UpdateLocation(this.DomID, this.Left, this.Top);
    }
    
    this.UpdateRotateDeg = function(LookToX, LookToY){
    
        var angle = (cx, cy, ex, ey) => {
            var dy = ey - cy;
            var dx = ex - cx;
            var theta = Math.atan2(dy, dx); // range (-PI, PI]
            theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
            return theta;
        }
    
        var angle360 = (cx, cy, ex, ey) => {
            var theta = angle(cx, cy, ex, ey); // range (-180, 180]
            if (theta < 0) theta = 360 + theta; // range [0, 360)
            return theta;
        }

        let playerAngle = angle360(LookToX, LookToY, this.Left, this.Top);
        window.GlobalViewRef.UpdateRotate('player',playerAngle-90)
    
    }

}

function TimerAction(action = () => {return}, runEvery = 5, runMax = 15){
    this.Action = action;
    this.RunEvery = runEvery;
    this.RunMax = runMax;
    this.Iteration = 0;
    this.Dispose = false;
}

function KeyBind(keyCode = '', keyDown = () => { return }, keyUp = () => { return }){
    this.KeyCode = keyCode;
    this.KeyDown = keyDown;
    this.KeyUp = keyUp;
}

function DomRef(id){
    this.nativeElementRef = document.getElementById(id);

    this.SetOnClick = function(methodByRef){
        this.nativeElementRef.addEventListener("click", methodByRef);
    }
    
    this.SetInnerHTML = function(innerHTML){
        this.nativeElementRef.innerHTML = innerHTML;
    }

    this.ReplaceClass = function(removeClass, addClass){
        this.nativeElementRef.classList.remove(removeClass);
        this.nativeElementRef.classList.add(addClass);
    }

    this.SetRotation = function(degree){
        this.nativeElementRef.style.transform = `rotate(${degree}deg)`;
    }

    this.SetLocation = function(left, top){
        this.nativeElementRef.style.top = `${top}px`;
        this.nativeElementRef.style.left = `${left}px`;
    }
}