<?php
namespace API;
include_once '../APIBase.php';
include_once '../Data/Repository.php';
use API;
use Data\Repository;

class User extends API\APIBase{
    function Get($req){
        //Validation: Ensure request has required params

        //Logic: Map request to variables/object

        //Data: Get/Save to Data Layer

        //Response: echo response
        echo json_encode($req);
    }

    function Post($req){
        //Validation: Ensure request has required params
        
        //Logic: Map request to variables/object
        $UserName = $req["UserName"];
        $ReturnKey = $req["ReturnKey"];

        //Data: Get/Save to Data Layer
        $repository = new Repository\User();
        $repository->Save($UserName, $ReturnKey);

        //Response: echo response
        echo "[1]";
    }

}
new User();
?>