<?php
namespace API;
include_once '../APIBase.php';
include_once '../Data/Repository.php';
use API;
use Data\Repository;
class Login extends API\APIBase{
    function Post($authModel){
        //Validation: Ensure request has required params
        if(empty($authModel->Login) || empty($authModel->Password)){
            array_push($this->Response->ValidationMessages,"Login AND Password are required");
            $this->SendResponse(200);
        }
        //Logic: call to method in data layer. map to response
        $repository = new Repository\Login();
        $result = $repository->CheckLogin($authModel);

        if(empty($result)) 
            array_push($this->Response->ValidationMessages,"UserName/Password Not FoundDB");

        if(count($this->Response->ValidationMessages) > 0){
            $this->SendResponse(200);
        }
        //Response: return response
        $this->Response->Result = $result;
        $this->SendResponse(200);
    }
}
new Login();
?>