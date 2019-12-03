<?php 
namespace Data;
class Connection {
    public $Servername = "localhost";
    public $Username = "wizardwarrior";
    public $Password = "6iUgHc0xxL3dMf4F";
    public $Database = "WizardWarriors";
    public $Port = 3306;
    public $Conn;

    function __construct() {
        $conn = new \ mysqli($this->Servername, $this->Username,$this->Password, $this->Database, $this->Port);
        if ($conn->connect_error) {
            die("['Connection Failed',$conn->connect_error]");
            return null;
        }
        $this->Conn = $conn;
    }
    function StmtToList($stmt){
        $results = [];
        $res = $stmt->get_result();
        //var_dump($res);
        while ($model = $res->fetch_object()) {
            array_push($results, $model);
        };
        return $results;
    }
    
    function dbUpdate($SQLCommand){
        $stmt = $this->Conn->prepare($SQLCommand);   
        if($stmt == false){
            echo $SQLCommand;
            die(json_encode($this->Conn->error_list));
        }
        $res = $stmt->execute();
        $stmt->close();
        return $res;
    }
    function dbSelect($SQLCommand){
        $stmt = $this->Conn->prepare($SQLCommand);   
        if($stmt == false){
            echo $SQLCommand;
            die(json_encode($this->Conn->error_list));
        }
        $stmt->execute();
        $res = $this->StmtToList($stmt);
        $stmt->close();
        return $res;
    }
    
    function dbInsert($SQLCommand){
        $stmt = $this->Conn->prepare($SQLCommand);   
        if($stmt == false){
            echo $SQLCommand;
            die(json_encode($this->Conn->error_list));
        }
        $stmt->execute();
        $stmt->close();
        return $this->Conn->insert_id;
    }
}
?>