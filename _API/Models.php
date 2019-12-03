<?php 
namespace API;
class Sess{
    public $VarName;
    function __construct($varName){
        $this->VarName = $varName;
    }
    public function get(){
        if(!isset($_SESSION[$this->VarName])){
            return;
        }
        return json_decode($_SESSION[$this->VarName]);
    }
    public function set($auth){
        $_SESSION[$this->VarName] = json_encode($auth);
        return $this->get();
    }
    public function clear(){
        unset($_SESSION[$this->VarName]);
    }
}
class Response{
    public $ValidationMessages = [];
    public $Result = [];
}

function DumpAndDie($obj){
    die(json_encode($obj));
}

?>