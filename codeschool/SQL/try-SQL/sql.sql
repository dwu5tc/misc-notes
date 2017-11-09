SELECT id, title
FROM movies
WHERE duration >= 90
AND genre = 'comedy'
ORDER BY duration;

SELECT id, title
FROM movies
WHERE duration >= 90
AND genre = 'comedy'
ORDER BY duration;

INSERT INTO concessions ('item', size)
VALUES ('nachos', 'regular');

INSERT INTO concessions ('id', 'item', 'price')
VALUES (8, 'pizza', '2.00');

UPDATE concessions 
SET item = 'hamburger'
WHERE item = 'pizza';

UPDATE concessions
SET price = '1.00'
WHERE item = 'popcorn' OR item = 'candy';

DELETE FROM movies WHERE genre = 'comedy';

DELETE FROM movies WHERE duration > 120 OR title = 'inception';

CREATE TABLE advertisements
(
	id int,
	name varchar(10),
	category varchar(10),
	cost int
);

INSERT INTO advertisements (id, name, cost)
VALUES (1, 'commercial', 150);

UPDATE advertisements
SET category = 'television'
WHERE name = 'commercial';

DROP TABLE advertisements;