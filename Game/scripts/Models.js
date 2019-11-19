function GameUnit(unitID){
    this.ID = unitID;
    this.UnitLocation = new UnitLocation(unitID);
    this.DomRef = new DomRef(unitID);
    this.Stats = new Stats();
    this.Nickname = "TestPlayer";
    this.GameUnitType;
    this.Target;
    this.ClickAction = () => { GlobalViewRef.MessageCenter.Add(`You clicked ${this.ID}`)};

    this.SetTarget = (gameUnit) => {
        this.Target = gameUnit;
    }   
    
    this.IsTargetInRange = (range) => {
        if (!this.Target) return;
        unitLocation = this.UnitLocation;
        targetUnitLocation = this.Target.UnitLocation;

        return Math.abs(unitLocation.Top  - targetUnitLocation.Top) < range
        && Math.abs(unitLocation.Left  - targetUnitLocation.Left) < range;
    }
}

function Stats(level = 1){
    this.Level = level;
    this.Speed = 2;
    this.Defense = 2;
    this.Health = 100 * this.Level;
    this.MaxHealth = 100 * this.Level;
    this.Attack = 15 + (5 * this.Level);
    this.AtkSpeed = 2 * (.2 * this.Level);
    this.CritChance = .1 + (.01 * this.Level);
    this.CritMultiplier = 2;
    this.Aggro = this.Alive ? this.Health + this.Attack : 0;
    this.IsAlive = true;
    
    this.receiveAttackDamage = (damage) => {
        if(!this.IsAlive) return 0;
        let mitigatedDamage = damage - this.Defense;
        this.Health -= mitigatedDamage;
        this.IsAlive = this.Health > 0;
        return mitigatedDamage;
    }

    this.getAttackDamage = () => {
        if(!this.IsAlive) return 0;
        let rawDamage = (Math.random() < this.CritChance) ? this.Attack * this.CritMultiplier : this.Attack;
        return parseInt(rawDamage);
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
        GlobalViewRef.UpdateRotate(this.DomID, playerAngle-90)
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

    this.AddChildNode = function(htmlNode){
        this.nativeElementRef.appendChild(htmlNode);
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
    },
    RandomFromArray: (array = []) => {
        if (array == null) return [];
        let arrayLen = array.length;
        let address = Math.floor(Math.random() * arrayLen);
        return array[address];
    }
}

var Data = {
    Get: (controller, params) => {
        let promise = new Promise((resolve, reject) => {
            let req = new XMLHttpRequest;
            req.open("GET","\\_API\\Controllers\\"+controller+"?"+params,true);
            req.setRequestHeader("Content-type", "application/json");
            req.onreadystatechange = (event) => {
                let res = event.currentTarget;
                if(res.readyState == 4 && res.status == 200){
                    resolve(JSON.parse(res.responseText));
                }else if (res.readyState == 4 && res.status != 200){
                    reject(event);
                }
            }
            req.send();
        })
        return promise;
    },
    Post: (controller, params) => {
        let promise = new Promise((resolve, reject) => {
            let req = new XMLHttpRequest;
            req.open("POST","\\_API\\Controllers\\"+controller,true);
            req.setRequestHeader("Content-Type", "application/json");
            req.onreadystatechange = (event) => {
                let res = event.currentTarget;
                if(res.readyState == 4 && res.status == 200){
                    resolve(JSON.parse(res.responseText));
                }else if (res.readyState == 4 && res.status != 200){
                    reject(event);
                }
            }
            let paramsJson = JSON.stringify(params);
            req.send(paramsJson);
        })
        return promise;
    }
}

//UnitActions
var Attack = {
    Basic: (fromGameUnit, toGameUnit) => {
        let attackDamage = fromGameUnit.Stats.getAttackDamage();
        let damageInflicted = toGameUnit.Stats.receiveAttackDamage(attackDamage);
        if (damageInflicted > 0)
        GlobalViewRef.MessageCenter.Add(`${fromGameUnit.ID} attacked ${toGameUnit.ID} with ${damageInflicted} damage`)
    },  
}