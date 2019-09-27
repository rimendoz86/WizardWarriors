import Bindings from './Bindings.js'

export default class Init{
    Bindings;
    constructor(){
        this.Bindings = new Bindings();
    }
}
var init = new Init();