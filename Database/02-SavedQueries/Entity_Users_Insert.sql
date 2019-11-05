USE `wizardwarriors`;
DROP procedure IF EXISTS `Entity_Users_Insert`;

DELIMITER $$
USE `wizardwarriors`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `Entity_Users_Insert`(
in $UserName VARCHAR(50),
in $ReturnKey VARCHAR(50),
out $newID INT
)
BEGIN

INSERT INTO WizardWarriors.Entity_Users 
(`UserName`,
`ReturnKey`,
`CreatedOn`,
`CreatedBy`,
`UpdatedOn`,
`UpdatedBy`)
VALUES 
($UserName, 
$ReturnKey, 
current_timestamp(), 
$UserName, 
current_timestamp(), 
$UserName);

SET $newID = LAST_INSERT_ID();
END$$

DELIMITER ;

