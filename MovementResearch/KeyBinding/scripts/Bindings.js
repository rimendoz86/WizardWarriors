export default class Bindings{
    static Apple='';
    static KeyBind = {keyCode: '', keydown: () => { return;}, keyup: () => { return;}}
    static KeyBindings = [

            new Bindings.KeyBind() = { keyCode: 'KeyA', keydown: () => {console.log("You pressed a")}, keyup: () => {console.log("You released a")}}
]

    constructor(){
        this.configureKeyBindings();
    }

    configureKeyBindings(){
        window.addEventListener("keydown", (event) => {
            let keyPressed = event.code;
            this.KeyBindings
        })

        window.addEventListener("keyup", (event) => {
            console.log(event);
        })
    }

}