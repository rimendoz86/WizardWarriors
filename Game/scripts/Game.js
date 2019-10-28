function gameClass (){
    this.Controller = new controllerClass();
    this.Bindings = new bindingClass(this.Controller);

    gameClass.prototype.setCookie = function(cName, cValue, xDays) {
      var d = new Date();
      d.setTime(d.getTime() + (xDays * 24 * 60 * 60 * 1000));
      var expires = "expires=" +d.toGMTString();
      document.cookie = cName + "=" + cValue + ";" + expires;
    }

    gameClass.prototype.getCookie = function(cName) {
      var name = cName + "=";
      var cArray = document.cookie.split(';');

      for(var i = 0; i < cArray.length; i++) {
        var c = cArray[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    gameClass.prototype.checkCookie = function() {
      var user = this.getCookie('nickname');
      if (user != "") {
        return true;
      } else {
        return false;
      }
    }

    if(this.checkCookie('nickname')){
      GlobalViewRef.MessageCenter.Add("Welcome Back, WizardWarrior " + this.getCookie("nickname"));
    }else{
      this.setCookie("nickname", this.Controller.Model.Player.Stats.Nickname, 1);
      GlobalViewRef.MessageCenterAdd("Hello " + this.getCookie("nickname"));
    }
};

var Game = new gameClass();