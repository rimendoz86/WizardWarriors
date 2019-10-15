import { Bindings } from './Bindings.js'
import { Controller } from './Controller.js';

export class Game{
    Bindings;
    Controller;
    constructor(){
        this.Bindings = new Bindings();
        this.Controller = new Controller();
    }
}
var gameModule = new Game();