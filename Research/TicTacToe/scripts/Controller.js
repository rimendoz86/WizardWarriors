import { Model } from './Model.js';

export class Controller{
    Model = new Model();

    constructor(){
        window.controllerModule = this;
    }

    ComputerTurn(){
        this.Model.ComputerTurn();
    }

    CheckForWinner(ticValue){
        this.Model.CheckForWinner(ticValue);
    }
}