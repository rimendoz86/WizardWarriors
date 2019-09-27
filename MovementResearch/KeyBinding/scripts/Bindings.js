import Controller from './Controller.js'
import KeyBind from './Models/KeyBind.Model.js';

export default class Bindings{
    Controller = new Controller();
    constructor(){
        this.configureKeyBindings();
    }

    KeyBindings = [
        new KeyBind('KeyA',
        () => Controller.SendToConsole('You Pressed A'),
        () => Controller.SendToConsole('You Released A'))
    ]

    configureKeyBindings(){
        window.addEventListener("keydown", (event) => {
            let bindings = this.KeyBindings.filter(x => x.KeyCode == event.code);
            bindings.forEach((binding) => {
                binding.KeyDown();
            });
        });

        window.addEventListener("keyup", (event) => {
            let bindings = this.KeyBindings.filter(x => x.KeyCode == event.code);
            bindings.forEach((binding) => { 
                binding.KeyUp(); 
            });
        });
    }
}