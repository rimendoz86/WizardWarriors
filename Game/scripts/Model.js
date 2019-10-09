function modelClass (){
    this.View = new viewClass();
    this.UserEnvironment = new UserEnvironment();

    this.Enemies = [];
    this.Allies = [];
    this.Player;

    this.SetMousePosition = function(mouseTop, mouseLeft) {
        this.UserEnvironment.MouseTop = mouseTop;
        this.UserEnvironment.MouseLeft = mouseLeft;
    }
}