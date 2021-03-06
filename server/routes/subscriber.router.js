const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();


    router.get('/existing-projects/:teamId', rejectUnauthenticated, (req, res) => {       
        let teamId = req.params.teamId         
        let queryText = `SELECT * FROM "projects" WHERE "team_id"= $1`;
        pool.query(queryText, [teamId])
            .then((response) => {
                // console.log('successful get- response.rows:', response.rows);
                res.send(response.rows);
            })
            .catch(() => {
                console.log('something went wrong in get at /');
                res.sendStatus(500);
            })
    });//get task names for a certain project, and whether or not they're done.
    
    router.get('/current-workflow/phases/:projectId', rejectUnauthenticated, (req, res) => {   
        let projectId = req.params.projectId        
        let queryText = `SELECT "phases"."id" AS "phase_id", "phases"."name" AS "phase_name", 
        "phases"."description" AS "phases_desc", "phases"."sequence" AS phase_seq,
        "workflows"."name" AS "workflow_name", "workflows"."description" AS "workflow_desc" FROM "phases"
        JOIN "workflows" ON "phases"."workflow_id" = "workflows"."id"
        JOIN "projects" ON "projects"."workflow_id" = "workflows"."id"
        WHERE "projects"."id"=$1 ORDER BY "phases"."sequence" ASC; `
        pool.query(queryText, [projectId])
            .then((response) => {
                // console.log('successful get- response.rows:', response.rows);
                res.send(response.rows);
            })
            .catch(() => {
                console.log('something went wrong in get at /current-workflow/phases/:projectId');
                res.sendStatus(500);
            })
    });

    router.get('/current-workflow/phases/tasks/:phaseId', rejectUnauthenticated, (req, res) => {   
        // console.log('req.params is ', req.params.phaseId);
        let phaseId = req.params.phaseId;
        // let queryText = `SELECT * FROM "default_tasks" WHERE "phase_id"=$1`;
        let queryText = `SELECT DISTINCT "default_tasks"."id" FROM "default_tasks" 
        WHERE "default_tasks"."phase_id"=($1) ORDER BY "id";`
        pool.query(queryText,[phaseId])
            .then((response) => {
                // console.log('successful get- response.rows:', response);
                res.send(response.rows);
            })
            .catch(() => {
                console.log('something went wrong in get at /current-workflow/phases/tasks/:phaseId');
                res.sendStatus(500);
            })
    });



router.post('/project', rejectUnauthenticated, (req, res) => {
console.log(req.body.details)

    let queryText = `INSERT INTO "projects" ("name", "team_id", "workflow_id") VALUES ($1, $2, $3);`
    pool.query(queryText, [req.body.details.name, req.body.details.team, req.body.details.workflow])
        .then((response) => {
            res.sendStatus(200);
        })
        .catch(() => {
            console.log('something went wrong in get at /');
            res.sendStatus(500);
        })
});

router.get('/project/data/:projectId', rejectUnauthenticated, (req, res) => {
    let projectId = req.params.projectId
    let queryText = `SELECT "phases"."name" AS "phaseName", "default_tasks"."name" as "taskName", "inputs"."prompt" as "inputPrompt", "capturedValues"."fulfilled" as "fulfillmentStatus", "capturedValues"."value"
                    FROM "capturedValues" 
                    JOIN "inputs" ON "inputs"."id"="capturedValues"."input_id"
                    JOIN "default_tasks" ON "default_tasks"."id"="inputs"."task_id"
                    JOIN "phases" ON "default_tasks"."phase_id"="phases"."id"
                    WHERE "project_id"= $1 ORDER BY "input_id";`;
                    //maybe this should be ordered by task sequence instead. input id works for most cases though.
    pool.query(queryText, [projectId])
        .then((response) => {
            // console.log('successful get- response.rows:', response.rows);
            res.send(response.rows);
        })
        .catch(() => {
            console.log('something went wrong in get at /');
            res.sendStatus(500);
        })
});//get task names for a certain project, and whether or not they're done.



router.post('/project', rejectUnauthenticated, (req, res) => {
    console.log(req.body.details)

    let queryText = `INSERT INTO "projects" ("name", "team_id", "workflow_id") VALUES ($1, $2, $3);`
    pool.query(queryText, [req.body.details.name, req.body.details.team, req.body.details.workflow])
        .then((response) => {
            res.sendStatus(200);
        })
        .catch(() => {
            console.log('something went wrong in get at /');
            res.sendStatus(500);
        })
});



router.post('/project/values', rejectUnauthenticated, (req, res) => {
    console.log(req.body.details)
       let queryText = `INSERT INTO "capturedValues" ("project_id", "input_id", "value") VALUES ($1, $2, $3);`
    pool.query(queryText, [req.body.details.id, req.body.details.key, req.body.details.value])
        .then((response) => {
            res.sendStatus(200);
        })
        .catch(() => {
            console.log('something went wrong in get at /');
            res.sendStatus(500);
        })
});

module.exports = router;
