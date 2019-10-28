function viewClass (){
    this.UpdateLocation = function (DomID, Left, Top){
        let domRef = new DomRef(DomID);
        domRef.SetLocation(Left, Top)
    }

    this.UpdateRotate = function (DomID,RotateDeg){
        let domRef = new DomRef(DomID);
        domRef.SetRotation(RotateDeg)
    }

    this.MessageCenter = {
        DomRef: new DomRef("messageCenter"),
        Add: function(message){ 
            var newSpan = document.createElement('span');
            newSpan.innerHTML = message;
            this.DomRef.AddChildNode(newSpan);
            this.DomRef.nativeElementRef.scrollTop = this.DomRef.nativeElementRef.scrollHeight;
        }
    }

    window.GlobalViewRef = this;
};