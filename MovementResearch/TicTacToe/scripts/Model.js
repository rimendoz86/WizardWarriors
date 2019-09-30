import { View } from './View.js'
import { Tic } from './Models/Tic.Model.js';

export class Model{
    TicList = [];
    SelectableTicList = [];
    GameIsWon = false;
    
    constructor(){
        this.StartGame();
    }

    StartGame(){
        this.CreateArrOffTics();
        if (Math.random() < .5){
            View.DisplayMessage("Computer went first");
            this.ComputerTurn();
        }else{
            View.DisplayMessage("You turn first");
        } 
    }

    CreateArrOffTics(){
        for(var i = 0; i <= 8; i++){
            this.TicList.push(
                new Tic(i)
            );
        };
        this.SetSelectableTics();
    }

    SetSelectableTics(){
        this.SelectableTics = this.TicList.filter(x => x.Value == null);
    }

    CheckForWinner(ticValue){
        if (this.GameIsWon) return;

        let t = this.TicList;
        this.SetSelectableTics();

        this.GameIsWon = t[0].Value == ticValue && t[1].Value == ticValue && t[2].Value == ticValue
                        || t[3].Value == ticValue && t[4].Value == ticValue && t[5].Value == ticValue
                        || t[6].Value == ticValue && t[7].Value == ticValue && t[8].Value == ticValue
                        || t[0].Value == ticValue && t[3].Value == ticValue && t[6].Value == ticValue
                        || t[1].Value == ticValue && t[4].Value == ticValue && t[7].Value == ticValue
                        || t[2].Value == ticValue && t[5].Value == ticValue && t[8].Value == ticValue
                        || t[0].Value == ticValue && t[4].Value == ticValue && t[8].Value == ticValue
                        || t[2].Value == ticValue && t[4].Value == ticValue && t[6].Value == ticValue;

        if (this.GameIsWon) {
            View.DeclareWinner(ticValue);
            return;
        }

        if (this.SelectableTics.length == 0) 
            View.DisplayMessage("The game is tied.");
    }

    ComputerTurn(){
        if(this.GameIsWon || this.SelectableTics.length == 0) return;

        let ticToTac = Math.random() * this.SelectableTics.length;

        setTimeout(() => {
            this.SelectableTics[Math.floor(ticToTac)].Turn("O");
            this.CheckForWinner("O");
        }, 100)
        
    }
}