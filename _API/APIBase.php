<?php
namespace API;
if ( session_status() ===  PHP_SESSION_NONE) { 
    session_start();
}
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
class APIBase {
    public $Response;
    function __construct(){
        $RequestMethod = $_SERVER['REQUEST_METHOD'];
        $RequestObject;
        $this->Response = new \ stdClass();;
        $this->Response->ValidationMessages = [];
        $this->Response->Result = null;
        
        switch ($RequestMethod) {
            case 'GET':
                $RequestObject = (object) $_GET;
                var_dump($RequestObject);
                if(!(array)$RequestObject){
                    $this->Get();
                }else{
                    $this->GetWith($RequestObject);
                }
                break;
            case 'POST':
                $RequestObject = json_decode(file_get_contents('php://input'));
                $this->Post($RequestObject);
                break;
            case 'PUT':
                $RequestObject = json_decode(file_get_contents('php://input'));
                $this->Put($RequestObject);
            case 'DELETE':
                $RequestObject = json_decode(file_get_contents('php://input'));
                $this->Delete($RequestObject);
            break;
            default:
                break;
        }
    }
    function Post($requestObject){
        echo json_encode($this->Response);
    }
    function Put($requestObject){
        echo json_encode($this->Response);
    }
    function Delete($requestObject){
        echo json_encode($this->Response);
    }
    function Get(){
        echo json_encode($this->Response);
    }
    function GetWith($requestObject){
        echo json_encode($this->Response);
    }
    function SendResponse($responseCode){
        http_response_code($responseCode);
        echo json_encode($this->Response);
        die();
    }
}
?>