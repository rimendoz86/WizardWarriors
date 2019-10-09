function viewClass (){
    this.UpdateLocation = function (DomID, Left, Top){
        let domRef = new DomRef(DomID);
        domRef.SetLocation(Left, Top)
    }

    window.GlobalViewRef = this;
};