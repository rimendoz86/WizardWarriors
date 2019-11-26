<?php 
namespace Data\Repository;
include 'Connection.php';
use Data;

class Score extends Data\Connection{

    function Save(){
        
        return 1;
    } 

    function Get(){
        return "[{'id':'0', 'name':'Superman','Score':'1000'}]";
    }
}

class Login extends Data\Connection{
    function CheckLogin($authModel){
        //var_dump($authModel);
        return $this->dbSelect("
        Select UserID, Login, Password
        FROM entity_user
        Where Login = '$authModel->Login' 
        && Password =  BINARY '$authModel->Password' 
        && IsActive = 1");
    }
}

class User extends Data\Connection{
    function CheckForUser($req){
        $sql = "Select UserID
        FROM entity_user
        WHERE Login = '$req->Login'";
        return $this->dbSelect($sql);
    } 
    
    function Register($req){
        $sql = "INSERT INTO entity_user
        (Login, Password)
        Values
        ('$req->Login','$req->Password')";
        return $this->dbInsert($sql);
    }
}
?>