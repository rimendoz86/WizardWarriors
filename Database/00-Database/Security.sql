Drop USER 'serviceAcct'@'localhost';
CREATE USER 'serviceAcct'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE, FILE ON *.* TO 'serviceAcct'@'localhost'
REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT ALL PRIVILEGES ON `wizardwarrors`.* TO 'serviceAcct'@'localhost';
