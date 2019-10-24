function Player (){
    this.UnitLocation = new UnitLocation('player');
    this.DomRef = new DomRef('player');
    this.Stats = new Stats();
    this.Stats.Name = "";
    this.Stats.Speed = 10;
    this.Stats.Health = 100;
    this.Stats.MaxHealth = 100;
    this.Stats.Attack = 20;
    this.Stats.AtkSpeed = 2;
    this.Stats.Level = 1;
    this.experience = 0;
    //c++ functions
    this.checkLevel = function(){
        var targetExperience = 400 * this.Level;
        if(experience >= targetExperience) {
            this.Level += 1;
            experience = 0;
            var AtkBonus = 2;
            var HealthBonus = 5;
            this.Attack += AtkBonus;
            this.Health = this.MaxHealth + HealthBonus;
        }
    }
    
    this.addXP = function(n){
        experience = experience + n;
        this.Player.checkLevel();
    }
}

function Stats(){
    this.Name = "Dummy";

    //c++ functions
    this.getHealth = function(){
        return Health;
    }
    
    this.getName = function(){
        return Name;
    }
    
    this.getLevel = function(){
        return Level;
    }
    this.getAtk = function(){
        return Attack;
    }
    
    this.takeDmg = function(d){
    Health -= d;
    } 
    
    this.getSpeed = function(){
        return Speed;
    }
    
    this.getASpeed = function(){
        return AtkSpeed;
    }
}

function Enemy(id) {            //Place holder enemy, can add more later
    this.UnitLocation = new UnitLocation(id);
    this.DomRef = new DomRef('player');
    this.Stats = new Stats();
    this.Stats.Speed = 10;
    this.Stats.Health = 30;
    this.Stats.MaxHealth = 30;
    this.Stats.Attack = 5;
    this.Stats.AtkSpeed = 2;     
    this.Stats.Level = 1;
    this.Xp;
    this.Distance;      
    this.Detection;             //distance they can detect someone
    Xp = this.Health * this.Attack;
    //c++ functions
    this.getXP = function(){
        return Xp;
    }
    
    this.agro = function(){
        
    }
}

function Ally(id) {            //Place holder ally, same as enemy to test
    this.UnitLocation = new UnitLocation(id);
    this.DomRef = new DomRef('player');
    this.Stats = new Stats();
    this.Stats.Speed = 10;
    this.Stats.Health = 30;
    this.Stats.MaxHealth = 30;
    this.Stats.Attack = 5;
    this.Stats.AtkSpeed = 2;     
    this.Stats.Level = 1;
    this.Distance;
    this.Detection;             //distance they can detect someone
    //c++ functions
    this.agro = function(){
        
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