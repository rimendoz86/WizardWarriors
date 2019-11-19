function modelClass (){
    this.View = new viewClass();
    this.AllGameUnits = [];
    this.Enemies = () => {
        return this.AllGameUnits
        .filter(units => units.GameUnitType == GameUnitType.Enemy && units.Stats.IsAlive);
    }
    this.Allies = () => {
        return this.AllGameUnits
        .filter(units => units.GameUnitType != GameUnitType.Enemy && units.Stats.IsAlive);
    }
    this.Player;
    window.GlobalModelRef = this;
}