import Controller from './Controller.js'

export default class Bindings{
    Controller = new Controller();
    constructor(){
        this.configureKeyBindings();
    }

    static KeyBind = {keyCode: '', keydown: () => { return;}, keyup: () => { return;} }
    KeyBindings = [
        { 
            keyCode: 'KeyA',
            keyDown: () => Controller.SendToConsole('You Pressed A'), 
            keyUp: () =>  Controller.SendToConsole('You Released A')
        }
    ]

    configureKeyBindings(){
        window.addEventListener("keydown", (event) => {
            let obj = this.KeyBindings.filter(x => x.keyCode == event.code)[0];
            if (obj) obj.keyDown();
            return;
        })

        window.addEventListener("keyup", (event) => {
            let obj = this.KeyBindings.filter(x => x.keyCode == event.code)[0];
            if (obj) obj.keyUp();
            return;
        })
    }

}