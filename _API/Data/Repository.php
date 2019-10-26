<?php 
namespace Data\Repository;
include 'Context.php';
use Context;

class Score {
    public $conn;
    function __construct() {
        $this->conn = new \Data\Context\Connection();
    }

    function Save(){
        
        return 1;
    } 

    function Get(){
        return "[{'id':'0', 'name':'Superman','Score':'1000'}]";
    }
}

class User {
    public $conn;
    function __construct() {
        $tmp = new \Data\Context\Connection();
        $this->conn = $tmp->Conn;
    }
    function Save($userName, $returnKey){
        $stmt = $this->conn->prepare(
        "INSERT INTO `users` 
        (`ID`,`UserName`,`ReturnKey`,`CreatedOn`,`CreatedBy`,`UpdatedOn`,`UpdatedBy`)
        VALUES 
        (NULL, ?, ?, current_timestamp(),'TestUser', current_timestamp(),'TestUser');");
        $stmt->bind_param("ss", $userName, $returnKey);
        $stmt->execute();
        $stmt->close();
    } 

    function Get(){
        // return "[{'id':'0', 'name':'Superman','Score':'1000'}]";
    }

}
?>