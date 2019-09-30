import { KeyBind } from './Models/KeyBind.Model.js';

export class Bindings{
    constructor(){
        this.ConfigureKeyBindings();
    }

    KeyBindings = [
        new KeyBind('KeyA',
        () => View.DisplayMessage('You Pressed A'),
        () => View.DisplayMessage('You Released A'))
    ];

    ConfigureKeyBindings(){
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