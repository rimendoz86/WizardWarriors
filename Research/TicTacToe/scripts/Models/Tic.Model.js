import { DomInfo } from './DomInfo.Model.js';
import { View } from '../View.js';

export class Tic{
    Id;
    Value;
    DomInfo;

    constructor (id){
        this.Id = id;
        this.DomInfo = new DomInfo(id);
        this.DomInfo.SetOnClick(() => this.OnClick());
    }

    OnClick(){
        if(this.Value) {
            View.DisplayMessage("This already has a value, try another");
            return;
        }
        View.DisplayMessage(null)
        this.Turn("X");
        controllerModule.ComputerTurn();
    }
    
    Turn(value){
        this.Value = value;
        let replaceClass = value == "X" ? "O" : "X";
        this.DomInfo.ReplaceClass(replaceClass, value);
        controllerModule.CheckForWinner("X");

    }

}