<?php 
namespace Model;
class Authentication {
    public $DBID;
    public $UserName;
    public $ReturnKey;
    public $SessionID;

    function __construct($userName, $returnKey, $sessionID){
        $this->setAuthentication($userName, $returnKey, $sessionID);
    }
    function setAuthentication($dBID, $userName, $returnKey, $sessionID){
        $this->dBID = $dBID;
        $this->UserName = $userName;
        $this->ReturnKey = $returnKey;
        $this->SessionID = $sessionID;

    }
    function getAuthentication(){
        return $this;
    }
}

class SessionStorage {
    function getAuthentication(){
        return $_SESSION['authenticationModel'];
    }
    function setAuthentication( $authenticationModel){
        $_SESSION['authenticationModel'] = $authenticationModel;
    }
}
?>