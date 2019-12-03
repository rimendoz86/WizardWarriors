function viewClass (){
    this.PlayerLevel = new DomRef('playerLevel');
    this.PlayerHealth = new DomRef('playerHealth')

    this.SetPlayerLevel = function(playerLevel = 0){
        this.PlayerLevel.SetInnerHTML(`Level: ${playerLevel}`);
    }
    this.SetPlayerHealth = function(health, maxHealth){
        this.PlayerHealth.SetInnerHTML(`Health: ${health}/${maxHealth}`);
    }

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
            this.DomRef.AppendChild(newSpan);
            this.DomRef.nativeElementRef.scrollTop = this.DomRef.nativeElementRef.scrollHeight;
        }
    }

    window.GlobalViewRef = this;
};