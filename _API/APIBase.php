<?php
namespace API;
if ( session_status() ===  PHP_SESSION_NONE) { 
    session_start();
}
include 'Models.php';
header("Content-Type: application/json; charset=UTF-8");
class APIBase {
    public $Sess_Auth;
    public $Response;
    function __construct(){
        $this->Sess_Auth = new Sess('Auth');
        $RequestMethod = $_SERVER['REQUEST_METHOD'];
        $this->Response = new Response();
        switch ($RequestMethod) {
            case 'GET':
                $RequestObject = (object) $_GET;
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
                break;
            case 'DELETE':
                $RequestObject = (object) $_GET;
                $this->Delete($RequestObject->id);
                break;
            default:
                break;
        }
        $this->SendResponse(200);
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
        die(json_encode($this->Response));
    }  
    function AddValidationMessage($validationMessage){
        if (empty($validationMessage)) return;
        array_push($this->Response->ValidationMessages,$validationMessage);
    }
}
?>