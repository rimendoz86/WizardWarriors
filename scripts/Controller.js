function controllerClass() {
  window.GlobalControllerRef = this;
  this.Model = new modelClass();
  AppStorage.Authentication.clear();

  this.LoginForm = new FormBinding(this.Model.Authentication, 'loginForm', 
  (m) => {return;},
  (authModel) => {
    Data.Post("login",authModel).then((res) => {

    if(res.ValidationMessages.length > 0) {
      GlobalViewRef.ValidationMessage.SetInnerHTML(res.ValidationMessages[0]);
      return;
    }

    GlobalViewRef.ValidationMessage.SetInnerHTML("Success, Please Wait");
    Object.assign(this.Model.Authentication, res.Result[0]);
    AppStorage.Authentication.set(this.Model.Authentication);
    window.location.href = "/Game/index.html"
    console.log(res);
    })
  });

  this.SignUp = function () {
    Data.Post('User',GlobalModelRef.Authentication).then((res) =>{
      if(res.ValidationMessages.length > 0) {
        GlobalViewRef.ValidationMessage.SetInnerHTML(res.ValidationMessages[0]);
        return;
      }

      GlobalViewRef.ValidationMessage.SetInnerHTML("Success, Please Login to Continue");
    });
  }
};