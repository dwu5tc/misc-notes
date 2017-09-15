db.wands.find({"creator": "Moonsap"})
// find ALL wands where creator == moonsap

db.wands.insert({
	"name": "Dream Bender",
	"creator": "Foxmond",
	"level_required": 10,
	"price": 34.9,
	"powers": ["Fire", "Love"],
	"damage": {
		"magic": 4,
		"melee": 2
	}
})
// self-explanatory

db.wands.remove({"name": "Doom Bringer"})
// self-explanatory

db.wands.remove({"powers": "Death"})
// self-explanatory

// ***UPDATE ONLY APPLIES TO FIRST MATCH UNLESS SPECIFIED***

db.wands.update(
	{"name": "Devotion Shift"},
	{"$set": {"price": 5.99}}
)
// find wands with name == devotion shift
// set price field = 5.99 FOR ONE ***MAINTAIN PREVIOUS FIELDS

db.wands.update(
	{"powers": "Fire"},
	{"$inc": {"level_required": 2}},
	{"multi": true}
)
// find wands with power == fire
// level_required +2 TO ALL

db.logs.update(
	{"name": "Dream Bender"},
	{"$inc": {"count": 1}},
	{"upsert": true}
)
// find wands with name == dream bender
// ++ to the count field
// no query match with existing doc --> create new doc

db.wands.update(
	{},
	{"$unset": {"smell": ""}},
	{"multi": true}
)
// find all
// remove smell field FROM ALL

db.wands.update(
	{},
	{"$rename": {"creator": "maker"}},
	{"multi": true}
)
// find all
// rename creator field --> maker FOR ALL

db.wands.update(
	{"powers": "Love"},
	{"$set": {"powers.$": "Love Burst"}}, // FOR ARRAYS
	{"multi": true}
)
// find wands with power array containing love
// change value of love to love burst FOR ALL

db.wands.update(
	{"name": "Dream Bender"},
	{"$push": {"powers": "Spell Casting"}},
)
// find wands with name == dream bender
// add spelling casting to the end of the powers array

db.wands.update(
	{},
	{"$addToSet": {"powers": "Spell Casting"}},
	{"multi": true}
)
// find all
// add spell casting to the powers array if it doesn't already exist TO ALL

db.wands.update(
	{},
	{"$mul": {"damage.melee": 10}},
	{"multi": true}
)
// find all
// damage melee *10 FOR ALL


db.wands.find(
	{
		"maker": "Moonsap",
		"level_required": 5
	}
)
// find wands where maker == moonsap, level_required == 5

db.wands.find(
	{"level_required": {"$lte": 5}}
)
// find wands where level_required <= 5

db.wands.find(
	{
		"damage.melee": {"$gte": 30, "$lte": 40}
	}
)
// find wands where damage.melee >= 30 and <= 40


db.wands.find(
	{
		"lengths": {"$elemMatch": {"$gte": 2.5, "$lt": 3}}
	}
)
// find wands where length >= 2.5 and < 3 ***LENGTHS IS AN ARRAY

db.wands.find(
	{
		"maker": {"$ne": "Foxmond"},
		"level_required": {"$lte": 75},
		"price": {"$lt": 50},
		"lengths": {"$elemMatch": {"$gte": 3, "$lte": 4}}
	}
)
// find wands where maker != foxmond, level_required <= 75, price < 50,
// lengths >= 3 and <= 4 ***LENGTHS IS AN ARRAY

db.wands.find({}, {"name": true}).sort({"name": 1}) 
// find all
// project to limit fields
// sort alphabetically 

b.wands.find(
	{
		"level_required": 2
	}
).count();
// find all where level_required == 2
// count 

db.wands.find().sort({"price": -1}).limit(3)
// find all
// sort descending
// limit to 3

db.wands.aggregate([
	{"$match": {"level_required": {"$lte": 5}}},
	{"$project": {"maker": true, "damage.magic": true, "_id": false}},
	{"$group": 
		{"_id": "$maker",
		"max_damage": {"$max": "$damage.magic"}}
	},
	{"$sort": {"max_damage": -1}},
	{"$limit": 4}  
])
// find wands where level_required <= 5
// project to limit fields
// group by wands by maker
// accumulator with field max_damage which finds max damage.magic per maker
// sort by max_damage descending
// limit to 4