import Model from './Model.js.js';
export default class Controller{
    Model = new Model();
    
    constructor(){}

    static SendToConsole(message){
        if (!message) return;
        Model.SendToConsole(message);
    }
}