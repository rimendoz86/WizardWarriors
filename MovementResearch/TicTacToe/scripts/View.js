import { DomInfo } from "./Models/DomInfo.Model.js";

export class View {
    constructor(){}

    static MessageCenterDom = new DomInfo('messageCenter');
    static PromptDom = new DomInfo('GameFinished');

    static DisplayMessage(message){
        this.MessageCenterDom.SetInnerHTML(message);
    }

    static DeclareWinner(winner){
        let winnerMessage = winner == "X" ? "You Win" : "You Lose";
        View.DisplayMessage(winnerMessage);
        View.PromptDom.ReplaceClass(null, "showPrompt");
    }
}
