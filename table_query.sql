CREATE TABLE reservation_slot (
	id INT PRIMARY KEY AUTO_INCREMENT,
	firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(256),
    reserveTime datetime ON UPDATE CURRENT_TIMESTAMP
)