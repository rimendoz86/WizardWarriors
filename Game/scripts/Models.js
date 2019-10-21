function Player (){
    this.UnitLocation = new UnitLocation('player');
    this.DomRef = new DomRef('player');
    this.Stats = new Stats();
    this.Stats.Speed = 2;
}

function Stats(){
    this.Nickname = "TestPlayer";
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
    this.MOVE_UP = false;
    this.MOVE_DOWN = false;
    this.MOVE_LEFT = false;
    this.MOVE_RIGHT = false;
    this.Left;
    this.Top;
    this.RotateDeg;

    this.UpdateLocation = function() {
        window.GlobalViewRef.UpdateLocation(this.DomID, this.Left, this.Top);
    }
    
    this.UpdateRotateDeg = function(LookToX, LookToY){
        let playerAngle = Utility.Angle360(LookToX, LookToY, this.Left, this.Top);
        window.GlobalViewRef.UpdateRotate('player', playerAngle-90)
    }

}

function TimerAction(action = () => {return}, runEvery = 5, runMax = 15){
    this.Action = action;
    this.RunEvery = runEvery;
    this.RunMax = runMax;
    this.Iteration = 0;
    this.Dispose = false;
}

function DomRef(id){

    let domObj = document.getElementById(id);
    if(domObj == undefined){
        domObj = document.createElement("div");
        domObj.setAttribute("id", id);
        domObj.setAttribute("class", "gameUnit");
        document.getElementById('playArea').appendChild(domObj);
    }
    this.nativeElementRef = domObj;

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

    this.Remove = function() {
        this.nativeElementRef.remove()
    }
}

//Static Methods
var PlayArea = {
    MaxLeft: 0,
    MaxRight: 1260,
    MaxTop: 0,
    MaxBottom: 700,
    getDomRef: () => {
        return new DomRef('playArea');
    }
}

//UtilityFunctions
var Utility = {
    Angle360: (cx, cy, ex, ey) => {
        let dy = ey - cy;
        let dx = ex - cx;
        let theta = Math.atan2(dy, dx); 
        theta *= 180 / Math.PI; 
        if (theta < 0) theta += 360;
        return theta;
    }
}
