let Express = require("express");
let router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
//Import the Journal Model
const { LogModel } = require("../models");

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice.')
});

/*
==========================
Log Create
==========================
*/
router.post("/create", validateJWT, async (req, res) => {
    const { title, date, entry, description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        title,
        date,
        entry,
        description,
        definition,
        result,
        owner: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }

});

/*
================
Get all Logs
================
*/
router.get("/", async (req, res) => {
    try {
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    
});
/*
================
Get all Logs
================
*/
router.get("/mine", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
=======================
Get Logs by Title
=======================
*/
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const results = await LogModel.findAll({
            where: { id: id }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
=================
Update a Log
=================
*/
router.put("/update/:entryId", validateJWT, async (req, res) => {
    const { title, date, entry, description, definition, result } = req.body.log;
    const logId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner: userId
        }
    };
    const updatedLog = {
        title: title,
        date: date,
        entry: entry,
        description: description,
        definition: definition,
        result: result,
    };
    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({error: err});
    }
});
/*
==================
Delete a Log
==================
*/
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try{
        const query = {
            where: {
                id: logId,
                owner: ownerId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({message: "Log entry removed!"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
router.get('/about', (req, res) => {
    res.send('Hey!! This is an about route!')
});

module.exports = router;

