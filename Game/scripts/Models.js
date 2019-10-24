function GameUnit(unitID){
    this.ID = unitID;
    this.UnitLocation = new UnitLocation(unitID);
    this.DomRef = new DomRef(unitID);
    this.Stats = new Stats(1);
    this.Nickname = "TestPlayer";
    this.GameUnitType;
    this.Target;
    this.ClickAction = () => { console.log(`You clicked ${this.ID}`)}
}

function Stats(level){
    this.Level = 1;
    this.Speed = 2;
    this.Defense = 2;
    this.Health = 100 * this.Level;
    this.MaxHealth = 1 * this.Level;
    this.Attack = 10 * this.Level;
    this.AtkSpeed = 2 * this.Level;
    this.CritChance = .1;
    this.CritMultiplier = 2;
    this.IsAlive = true;
    
    this.receiveAttackDamage = (damage) => {
        if(!this.IsAlive) return;
        let mitigatedDamage = damage - this.Defense;
        this.Health -= mitigatedDamage;
        this.IsAlive = this.Health > 0;
        console.log(this.Health);
    }

    this.getAttackDamage = () => {
        if(!this.IsAlive) return 0;
        return (Math.random() < this.CritChance) ? this.Attack * this.CritMultiplier : this.Attack;
    }
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

var GameUnitType = {
    Player: 0,
    Ally: 1,
    Enemy: 2,
    IsValid: (gameUnitType)=> gameUnitType == 0 || gameUnitType == 1 || gameUnitType == 2
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

var Attack = {
    Basic: (fromGameUnit, toGameUnit) => {
        let attackDamage = fromGameUnit.Stats.getAttackDamage();
        toGameUnit.Stats.receiveAttackDamage(attackDamage);
    },  
}
