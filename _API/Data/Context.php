<?php 
namespace Data\Context;

class Connection {
    public $Servername = "localhost";
    public $Username = "serviceAcct";
    public $Password = "6iUgHc0xxL3dMf4F";
    public $Database = "WizardWarrors";
    public $Port = 3306;
    public $Conn;

    function __construct() {
        $conn = new \ mysqli($this->Servername, $this->Username,$this->Password, $this->Database, $this->Port);

        if ($conn->connect_error) {
            die('["Connection Failed"]' . $conn->connect_error);
            return null;
        }
        $this->Conn = $conn;
    }
}
?>