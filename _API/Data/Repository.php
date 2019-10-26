<?php 
namespace Data\Repository;
include './Context.php';

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

$tmp = new Score();
?>