<?php
namespace API\Score;
include_once '../APIBase.php';
use API;

class Score extends API\APIBase{
    function Get($req){
        //Validation: Ensure request has required params

        //Logic: call to method in data layer. map to response

        //Response: return response
        echo "this is a mutated get";
        echo json_encode($req);
    }
}
new Score();
?>