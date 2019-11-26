function modelClass (){
    this.View = new viewClass();
    window.GlobalModelRef = this;
    this.Authentication = new Authentication();
}