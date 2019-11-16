function modelClass (){
    this.View = new viewClass();
    this.AllGameUnits = [];
    this.Enemies = [];
    this.Allies = [];
    this.Player;
    window.GlobalModelRef = this;
}