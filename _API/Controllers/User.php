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
        $result = $repository->Save($UserName, $ReturnKey);

        if($result != null){
            
            echo $result;
        }else{
            echo "['Fail to insert user']";
        }
        //Response: echo response
        
    }

}
new User();
?>