<?php
namespace API;
include_once '../APIBase.php';
include_once '../Data/Repository.php';
use API;
use Data\Repository;

class GameStats extends API\APIBase{
    function Get(){
        $repository = new Repository\GameStats();
        $this->Response->Result = $repository->SelectAll();
    }

    function GetWith($req){
        $repository = new Repository\GameStats();
        $this->Response->Result = $repository->SelectByUser($req);
    }

    function Post($req){
        //Validation: Ensure request has required params
        if(empty($req->UserID)){
            array_push($this->Response->ValidationMessages,"UserID Is Missing");
        }

        if(count($this->Response->ValidationMessages) > 0){
            $this->SendResponse(200);
        }

        //Response: return response
        $repository = new Repository\GameStats();
        if(empty($req->ID)){
            $this->Response->Result = $repository->Insert($req);
        }else{
            $this->Response->Result = $repository->Update($req);
        }
    }

}
new GameStats();
?>