function modelClass (){
    this.View = new viewClass();
    this.AllGameUnits = [];
    this.Authentication = new Authentication();
    this.Enemies = () => {
        return this.AllGameUnits
        .filter(units => units.GameUnitType == GameUnitType.Enemy && units.Stats.IsAlive);
    }
    this.Allies = () => {
        return this.AllGameUnits
        .filter(units => units.GameUnitType != GameUnitType.Enemy && units.Stats.IsAlive);
    }
    this.Player;
    this.GameStats = new GameStats();
    this.IsGameOver = false;
    window.GlobalModelRef = this;
}