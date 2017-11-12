/* count all rows */
SELECT count(*)
FROM Movies; 

/* counts number of american actors */
SELECT count(*)
from Actors
WHERE country = "USA";

SELECT sum(salary)
FROM Actors;

/* sums salary of support actors and groups by 
country (only if there's more than 1 match) */
SELECT country, sum(salary)
FROM Actors
WHERE role = "supporting"
GROUP BY country
HAVING COUNT(*) > 1;

/* constraint */
CREATE TABLE Movies (
	name varchar(50) NOT NULL,
	language varchar(50),
	CONSTRAINT name_lang UNIQUE (name, language)
);

/* e.g */
CREATE TABLE Actors (
	id int PRIMARY KEY,
	name varchar(50) NOT NULL UNIQUE,
	country_id int REFERENCES Countries(id)
);

/* e.g */
CREATE TABLE Actors (
	id int PRIMARY KEY,
	name varchar(50) NOT NULL UNIQUE,
	country_id int,
	FOREIGN KEY (country_id) REFERENCES Countries
);

/* e.g */
CREATE TABLE Actors (
	id int PRIMARY KEY,
	name varchar(50) NOT NULL UNIQUE,
	salary integer CHECK (salary > 500),
	bonus integer CHECK (bonus < salary),
	country_id int REFERENCES Countries(id)
);

/* e.g */
CREATE TABLE Actors_Movies (
	actor_id int REFERENCES Actors,
	movie_id int REFERENCES Movies
);

/* e.g */
CREATE TABLE Rooms (
	id int PRIMARY KEY,
	seats int,
	movie_id int UNIQUE,
	FOREIGN KEY (movie_id) REFERENCES Movies
);

/* e.g */
SELECT Movies.title, Rooms.id, Rooms.seats
FROM Movies
INNER JOIN Rooms
ON Movies.id = Rooms.movie_id
WHERE Rooms.seats > 75
ORDER BY seats DESC;

/* e.g */
SELECT Actors.name, Movies.title
FROM Actors
INNER JOIN Actors_Movies
ON Actors.id = Actors_Movies.actor_id
INNER JOIN Movies
ON Actors_Movies.movie_id = Movies.id
ORDER BY title;

/* aliases */
SELECT m.title, g.name
FROM MOVIES m
INNER JOIN Movies_Genres mg
ON m.id = mg.movie_id
INNER JOIN Genres g
ON mg.genre_id = g.id
WHERE m.title = "Inception";

/* e.g */
SELECT m.title "Movie Title", r.id "Theatre Number", r.seats
FROM Movies m
INNER JOIN Rooms r
ON m.id = r.movie_id
WHERE r.seats > 75
ORDER BY r.seats DESC;

/* e.g */
SELECT m.title, r.id "Theatre Number" 
FROM Movies m
LEFT OUTER JOIN Rooms r
ON m.id = r.movie_id;

/* subquery */
SELECT title
FROM Movies
WHERE id IN
	(SELECT movie_id
	FROM Rooms
	WHERE seats > 75);

/* e.g */
SELECT id
FROM Rooms
WHERE seats >
	(SELECT avg(seats)
	FROM Rooms);

/* e.g */
SELECT m.title, r.id
FROM Rooms r
LEFT OUTER JOIN Movies m
ON r.movie_id = m.id
WHERE seats > (SELECT AVG(seats) FROM Rooms);