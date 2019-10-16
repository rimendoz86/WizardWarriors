function viewClass (){
    this.UpdateLocation = function (DomID, Left, Top){
        let domRef = new DomRef(DomID);
        domRef.SetLocation(Left, Top)
    }

    this.UpdateRotate = function (DomID,RotateDeg){
        let domRef = new DomRef(DomID);
        domRef.SetRotation(RotateDeg)
    }

    window.GlobalViewRef = this;
};