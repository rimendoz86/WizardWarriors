function controllerClass() {
  window.GlobalControllerRef = this;
  this.Model = new modelClass();
  AppStorage.Authentication.clear();

  this.LoginForm = new FormBinding(this.Model.Authentication, 'loginForm', (x) => {return}, (authModel) => {this.Login(authModel)});

  this.Login = function(authModel){
    Data.Post("Login",authModel).then((res) => {
    if(res.ValidationMessages.length > 0) {
      GlobalViewRef.ValidationMessage.SetInnerHTML(res.ValidationMessages[0]);
      return;
    }
    GlobalViewRef.LoginForm.Show(false);
    GlobalViewRef.ValidationMessage.SetInnerHTML("Success, <a href='/Game/index.html' class='btn'>Start</a> a new Game or Continue a Saved Game Below");
    Object.assign(this.Model.Authentication, res.Result[0]);
    AppStorage.Authentication.set(this.Model.Authentication);
    this.GetUserSaves();
    })
  }

  this.SignUp = function () {
    Data.Post('User',GlobalModelRef.Authentication).then((res) =>{
      if(res.ValidationMessages.length > 0) {
        GlobalViewRef.ValidationMessage.SetInnerHTML(res.ValidationMessages[0]);
        return;
      }

      GlobalViewRef.ValidationMessage.SetInnerHTML("Success, Please Login to Continue");
    });
  }

  this.GetTopScores = function(){
    Data.Get('GameStats').then((res) => {
      this.Model.TopScores = res.Result;
      GlobalViewRef.ShowTopScores(res.Result);
    });
  }

  this.GetUserSaves = function(){
    let userID = this.Model.Authentication.UserID;
    if (!userID) return;
    Data.Get('GameStats',`UserID=${userID}`).then((res) => {
      this.Model.SavedGames = res.Result;
      GlobalViewRef.ShowSavedGames(res.Result);
    });
  }

  this.ResumeGame = function(saveGameID){
    let saveGame = this.Model.SavedGames.filter(x => x.ID = saveGameID);
    if(saveGame.length == 0) return;
    AppStorage.SavedGame.set(saveGame[0])
    window.location.href = "/Game/index.html";
  }

  this.GetTopScores();
};