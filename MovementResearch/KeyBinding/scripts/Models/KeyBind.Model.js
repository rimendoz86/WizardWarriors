export default class KeyBind{
    KeyCode = '';
    KeyDown = () => { return };
    KeyUp = () => { return };
    
    constructor(keyCode, keyDown, keyUp){
        this.KeyCode = keyCode;
        this.KeyDown = keyDown;
        this.KeyUp = keyUp;
    }
}