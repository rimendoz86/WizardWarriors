<?php 
namespace API;
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

class APIBase {
    private $RequestMethod;
    private $RequestObject;
    function __construct(){
        $this->RequestMethod = $_SERVER['REQUEST_METHOD'];
        switch ($this->RequestMethod) {
            case 'GET':
                $this->RequestObject = $this->ArrayToObject($_GET);
                $this->Get($this->RequestObject);
                break;
            case 'POST':
                $this->RequestObject = $this->ArrayToObject($_GET);
                $this->Post($this->RequestObject);
                break;
            default:
                echo "The request method has not been defined";
                break;
        }
    }

    function Post($requestObject){
        echo "Post Method not defined";
        echo " Request:".json_encode($requestObject);
    }

    function Get($requestObject){
        echo "Get Method not defined";
        echo " Request:".json_encode($requestObject);
    }

    function ArrayToObject($fromArray){
        return json_decode(json_encode($fromArray));
    }
}
?>