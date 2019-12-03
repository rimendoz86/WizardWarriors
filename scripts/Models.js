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

function Authentication() {
    this.UserID = null;
    this.Login = null;
    this.Password = null;
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
    
    this.SetInnerHTML = function(innerHTML){
        this.nativeElementRef.innerHTML = innerHTML;
    }

    this.SetValue = function(value){
        this.nativeElementRef.value = value;
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

    this.AppendChild = function(htmlNode){
        this.nativeElementRef.appendChild(htmlNode);
    }

    this.Reset = function(){
        this.nativeElementRef.reset();
    }

    this.Remove = function() {
        this.nativeElementRef.remove()
    }

    this.Show = function (isShow) {
        if (isShow) {
            this.ReplaceClass("hide", null);
        } else {
            this.ReplaceClass(null, "hide");
        }
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
    Get: (controller, params = '') => {
        return Data._ReqWithURI('GET',controller,params)
    },
    Post:(controller, params) => {
        return Data._ReqWithBody('POST',controller,params)
    },
    Put:(controller, params) => {
        return Data._ReqWithBody('PUT',controller,params)
    },
    Delete: (controller, id) => {
        return Data._ReqWithURI('DELETE',controller,`id=${id}`)
    },
    _ReqWithBody: (verb, controller, params) => {
        let promise = new Promise((resolve, reject) => {
            let BaseURL = "\\_API\\Controllers\\";
            let req = new XMLHttpRequest;
            req.open(verb,BaseURL+controller+".php",true);
            req.setRequestHeader("Content-Type", "application/json");
            req.onreadystatechange = (event) => {
                let res = event.currentTarget;
                if(res.readyState == 4 && res.status == 200){
                    try{
                        resolve(JSON.parse(res.responseText));
                    }catch(err){
                        console.log(res.responseText);
                        reject(err);
                    }
                }else if (res.readyState == 4 && res.status != 200){
                    reject(event);
                }
            }
            let paramsJson = JSON.stringify(params);
            req.send(paramsJson);
        })
        return promise;
    },
    _ReqWithURI: (verb, controller, params) => {
        let promise = new Promise((resolve, reject) => {
            let BaseURL = "\\_API\\Controllers\\";
            let req = new XMLHttpRequest;
            req.open(verb,BaseURL+controller+".php?"+params,true);
            req.setRequestHeader("Content-type", "application/json");
            req.onreadystatechange = (event) => {
                let res = event.currentTarget;
                if(res.readyState == 4 && res.status == 200){
                    try{
                        resolve(JSON.parse(res.responseText));
                    }catch(err){
                        console.log(res.responseText);
                        reject(err);
                    }
                }else if (res.readyState == 4 && res.status != 200){
                    reject(event);
                }
            }
            req.send();
        })
        return promise;
    }
}

function GameStats(){
    this.ID;
    this.UserID;
    this.TeamDeaths = 0;
    this.TeamKills = 0;
    this.PlayerLevel = 0;
    this.PlayerKills = 0;
    this.PlayerKillsAtLevel = 0;
    this.TotalAllies = 0;
    this.TotalEnemies = 0;
    this.IsGameOver = false;
    this.AddKillTo = function (gameUnit) {
        gameUnitType = gameUnit.GameUnitType;
        switch (gameUnitType) {
            case GameUnitType.Ally:
                this.TeamKills += 1;
                break;
            case GameUnitType.Player:
                this.PlayerKills += 1;
                this.PlayerKillsAtLevel += 1;
                break;
        
            case GameUnitType.Enemy:
                this.TeamDeaths += 1;
                break;
        }
    }
}
//UnitActions
var Attack = {
    Basic: (fromGameUnit, toGameUnit) => {
        if (!toGameUnit.Stats.IsAlive) return;
        let attackDamage = fromGameUnit.Stats.getAttackDamage();
        let damageInflicted = toGameUnit.Stats.receiveAttackDamage(attackDamage);
        if (damageInflicted > 0)
        GlobalViewRef.MessageCenter.Add(`${fromGameUnit.ID} attacked ${toGameUnit.ID} with ${damageInflicted} damage`) 
        
        if(!toGameUnit.Stats.IsAlive) GlobalModelRef.GameStats.AddKillTo(fromGameUnit);


        if(toGameUnit.GameUnitType == GameUnitType.Player){
            GlobalViewRef.SetPlayerHealth(toGameUnit.Stats.Health,toGameUnit.Stats.MaxHealth)
        }
    
        if (fromGameUnit.GameUnitType == GameUnitType.Player 
            && GlobalModelRef.GameStats.PlayerKillsAtLevel >= fromGameUnit.Stats.Level){
                let newLevel = fromGameUnit.Stats.Level + 1;
                fromGameUnit.Stats = new Stats(newLevel);
                GlobalControllerRef.SaveGame();
                GlobalModelRef.GameStats.PlayerKillsAtLevel = 0;
                GlobalViewRef.MessageCenter.Add(`Player is now level ${newLevel}`);
                GlobalViewRef.SetPlayerHealth(fromGameUnit.Stats.Health, fromGameUnit.Stats.MaxHealth)
                GlobalViewRef.SetPlayerLevel(newLevel);
        }

        if (toGameUnit.GameUnitType == GameUnitType.Player 
            && !toGameUnit.Stats.IsAlive){
                GlobalModelRef.IsGameOver  = true;
                GlobalControllerRef.SaveGame();
            }

    }
}

var RegexType = {
    Username: `^[a-z0-9_-]{3,15}$`,
    Password: `((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})`,
    Hexadecimal: `^#([\iA-Fa-f0-9]{6}|[\iA-Fa-f0-9]{3})$`,
    Email: `^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$`,
    Image: `([^\\s]+(\\.(jpg|png|gif|bmp))$)`,
    IP: `^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])$`,
    Time: `(1[012]|[1-9]):[0-5][0-9](\\\\s)?(am|pm)`,
    Time24: `([01]?[0-9]|2[0-3]):[0-5][0-9]`,
    DateFormat: `(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/((19|20)\\d\\d)`,
    HTML: `<("[^"]*"|'[^']*'|[^'">])*>`,
    HTMLink: `<a([^>]+)>(.+?)<\/a>`
};

String.prototype.IsType = function(regex, modifier = null){
let val = this.toString()
var re = !modifier ? new RegExp(regex) : new RegExp(regex, modifier);
return val.match(re) ? true: false;
}

function FormBinding(objectRef,formID, onChange = (modelData) =>{ return; }, onSubmit = (modelData) =>{ console.log(modelData); return; }) {
    this.ObjectRef = objectRef;
    this.FormID = formID;
    this.FormRef = new DomRef(formID);
    this.OnChange = onChange;
    this.OnSubmit = onSubmit;

    this.BindFormToModel = function() {
    this.FormRef.nativeElementRef.addEventListener("keyup", (event) => {
        if(this.FormToModel(this.ObjectRef,this.FormID)) 
            this.OnChange(this.ObjectRef);
    });

    this.FormRef.nativeElementRef.addEventListener("change", (event) => {
        if(this.FormToModel(this.ObjectRef,this.FormID))
            this.OnChange(this.ObjectRef);
    });

    this.FormRef.nativeElementRef.addEventListener("submit", (event) => {
        event.preventDefault();
        if(this.FormToModel(this.ObjectRef,this.FormID))
            this.OnChange(this.ObjectRef);
        this.OnSubmit(this.ObjectRef);
    });
    }

    this.ModelToForm = function (objectRef = this.ObjectRef, formID = this.FormID) {
    let objKeys = Object.keys(objectRef);
    let formRef = document.getElementById(formID);
    let changeFound = false;
    objKeys.forEach((key) => {
        let formInput = formRef.elements[key];
        if (formInput && formInput.value != objectRef[key]){
          formInput.value = objectRef[key] ? objectRef[key] : '';
          changeFound = true;
        } 
        });
        return changeFound;
    };

    this.FormToModel = function (objectRef = this.ObjectRef, formID = this.FormID){
        let objKeys = Object.keys(objectRef);
        let formRef = document.getElementById(formID);
        let changeFound = false;
        objKeys.forEach((key) => {
            let formInput = formRef.elements[key];
            if (formInput && formInput.value != objectRef[key]){
                objectRef[key] = formInput.value ? formInput.value : '';
                changeFound = true;
            } 
            });
            return changeFound;
    };
    this.BindFormToModel();
}

var AppStorage = {
    Authentication: {
        get: () => {
            return JSON.parse(sessionStorage.getItem('Authentication'));
        },
        set: (authentication) => {
            sessionStorage.setItem('Authentication',JSON.stringify(authentication));
        },
        clear: () => {
            sessionStorage.removeItem('Authentication');
        }
    },
    SavedGame: {
        get: () => {
            return JSON.parse(sessionStorage.getItem('SavedGame'));
        },
        set: (savedGame) => {
            sessionStorage.setItem('SavedGame',JSON.stringify(savedGame));
        },
        clear: () => {
            sessionStorage.removeItem('SavedGame');
        }
    }
}