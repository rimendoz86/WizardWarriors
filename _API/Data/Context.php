<?php 
namespace Data\Context;
// use mysqli;

class Connection {
    public $Servername = "localhost";
    public $Username = "serviceAcct";
    public $Password = "6iUgHc0xxL3dMf4F";
    public $Database = "WizardWarrior";
    public $Port = 3306;

    function __construct() {
        $conn = new \ mysqli($this->Servername, $this->Username,$this->Password, $this->Database, $this->Port);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
            return null;
        }
        echo "Connected successfully";
        return $conn;
    }
}
?>