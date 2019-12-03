<?php 
namespace Data\Repository;
include 'Connection.php';
use Data;

class GameStats extends Data\Connection{

    function SelectAll(){
        $sql = "Select ID,
        UserID, 
        TeamDeaths, 
        TeamKills, 
        PlayerLevel, 
        PlayerKills,
        PlayerKillsAtLevel,
        TotalAllies,
        TotalEnemies,
        IsGameOver
        FROM entity_gamestats
        WHERE IsActive = true AND IsGameOver = true
        ORDER BY PlayerLevel DESC, PlayerKills DESC;";

        return $this->dbSelect($sql);
    }

    function SelectByUser($req){
        $sql = "Select ID,
        UserID, 
        TeamDeaths, 
        TeamKills, 
        PlayerLevel, 
        PlayerKills,
        PlayerKillsAtLevel,
        TotalAllies,
        TotalEnemies,
        IsGameOver
        FROM entity_gamestats
        WHERE IsActive = true AND UserID = $req->UserID;";

        return $this->dbSelect($sql);
    }

    function Insert($req){
        $isGameOver = (int) $req->IsGameOver;
        $sql = "INSERT INTO entity_gamestats
        (
            UserID, 
            TeamDeaths, 
            TeamKills, 
            PlayerLevel, 
            PlayerKills,
            PlayerKillsAtLevel,
            TotalAllies,
            TotalEnemies,
            IsGameOver
        )
        VALUES
        (
            $req->UserID, 
            $req->TeamDeaths, 
            $req->TeamKills, 
            $req->PlayerLevel, 
            $req->PlayerKills,
            $req->PlayerKillsAtLevel,
            $req->TotalAllies,
            $req->TotalEnemies,
            $isGameOver
        );";
        return $this->dbInsert($sql);
    }

    function Update($req){
        $isGameOver = (int) $req->IsGameOver;
        $sql = "
        UPDATE entity_gamestats SET 
        UserID = $req->UserID, 
        TeamDeaths = $req->TeamDeaths, 
        TeamKills = $req->TeamKills, 
        PlayerLevel = $req->PlayerLevel, 
        PlayerKills = $req->PlayerKills,
        PlayerKillsAtLevel = $req->PlayerKillsAtLevel,
        TotalAllies = $req->TotalAllies,
        TotalEnemies = $req->TotalEnemies,
        IsGameOver =  $isGameOver 
        WHERE ID = $req->ID";

        return $this->dbUpdate($sql);
    }
}

class Login extends Data\Connection{
    function CheckLogin($authModel){
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