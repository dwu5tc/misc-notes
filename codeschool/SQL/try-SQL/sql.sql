SELECT id, title
FROM Movies
WHERE duration >= 90
AND genre = 'Comedy'
ORDER BY duration;

SELECT id, title
FROM Movies
WHERE duration >= 90
AND genre = 'Comedy'
ORDER BY duration;

INSERT INTO Concessions ('item', size)
VALUES ('Nachos', 'Regular');

INSERT INTO Concessions ('id', 'item', 'price')
VALUES (8, 'Pizza', '2.00');

UPDATE Concessions 
SET item = 'Hamburger'
WHERE item = 'Pizza';

UPDATE Concessions
SET price = '1.00'
WHERE item = 'Popcorn' OR item = 'Candy';

DELETE FROM Movies WHERE genre = 'Comedy';

DELETE FROM Movies WHERE duration > 120 OR title = 'Inception';

CREATE TABLE Advertisements
(
	id int,
	name varchar(10),
	category varchar(10),
	cost int
);

INSERT INTO Advertisements (id, name, cost)
VALUES (1, 'Commercial', 150);

UPDATE Advertisements
SET category = 'Television'
WHERE name = 'Commercial';

DROP TABLE Advertisements;