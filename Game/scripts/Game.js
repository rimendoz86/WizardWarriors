function gameClass (){
    this.Controller = new controllerClass();
    this.Bindings = new bindingClass(this.Controller);

};

var Game = new gameClass();