<?php
namespace API;
include_once '../APIBase.php';
include_once '../Data/Repository.php';
use API;
use Data\Repository;

class GameStats extends API\APIBase{
    function Post($req){
        //var_dump($req);
        //Validation: Ensure request has required params
        if(empty($req->UserID)){
            array_push($this->Response->ValidationMessages,"UserID");

        }
        //Logic: call to method in data layer. map to response
        $repository = new Repository\User();
        $isUserExists = $repository->CheckForUser($req);

        if(count($isUserExists) > 0) 
        array_push($this->Response->ValidationMessages,"Login is Taken");

        if(count($this->Response->ValidationMessages) > 0){
            $this->SendResponse(200);
        }

        //Response: return response
        $this->Response->Result = $repository->Register($req);
        $this->SendResponse(200);

    }

}
new GameStats();
?>