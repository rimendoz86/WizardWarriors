import Player from "./Models/Player.Model.js";
import View from './View.js'
export default class Model{
    View = new View();

    Player;
    constructor(){
        this.Player =  new Player();
    }

    static SendToConsole(message){
        View.SendToConsole(message)
    }
}