var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
const express = require('express')
const app = express()
var path = require('path')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true });

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("database");
    app.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname + '/register.html'));
    });
    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname + '/login.html'));
    });
    app.get('/team/create', (req, res) => {
        res.sendFile(path.join(__dirname + '/createteam.html'));
    });
    app.get('/player/create', (req, res) => {
        res.sendFile(path.join(__dirname + '/createplayer.html'));
    });
    app.get('/delete/team', (req, res) => {
        res.sendFile(path.join(__dirname + '/deleteteam.html'));
    });
    app.get('/team/delete', (req, res) => {
        res.sendFile(path.join(__dirname + '/deleteteam.html'));
    });
    app.get('/update/team', (req, res) => {
        res.sendFile(path.join(__dirname + '/updateteam.html'));
    });
    app.get('/player/create', (req, res) => {
        res.sendFile(path.join(__dirname + '/createplayer.html'));
    });
    app.get('/update/player', (req, res) => {
        res.sendFile(path.join(__dirname + '/updateplayer.html'));
    });
    app.get('/delete/player', (req, res) => {
        res.sendFile(path.join(__dirname + '/deleteplayer.html'));
    });
    app.post('/register', urlencodedParser, (req, res) => {
        let obj = {
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
        }
        dbo.collection("Users").insertOne(
            obj,
            (err, result) => {
                if (err) throw err;
                req.session.user = "user"
                console.log("Inserted");
                res.send("inserted Sucssfuly");

            }
        )
    });
    app.post('/login', (req, res) => {
        dbo.collection("Users").findOne({ username: req.body.username },
            (err, result) => {
                if (err) throw err;
                if (result.username == req.body.username && result.password == req.body.password) {
                    //  var Id = ele._id;
                    //  console.log(Id);
                    console.log(result)
                    req.session.user = "user"
                    res.redirect('/choice');
                    //   var token = jwt.sign({ id: result._id, role: result.role }, "mykey");
                    //    return res.send({ token: token })

                }
                else {
                    return res.send("Sorry your details are wrong");
                }

            },
        )
        app.use((req, res, next) => {
            if (!req.sesssion.user) {
                res.redirect('/login')
            }
            next();
        });
    }); app.get('/choice', (req, res) => {
        res.sendFile(path.join(__dirname + '/choice.html'));
    });
    app.post('/team/create', urlencodedParser, (req, res) => {
        let obj = {
            name: req.body.name,
            logo: req.body.logo,
            tag_line: req.body.tag_line,
            created_by: req.body.created_by,
        }
        dbo.collection("Team").insertOne(
            obj,
            (err, result) => {
                if (err) throw err;
                // console.log(result.name);
                res.send("Inserted Suecssfully");
            }
        )

    });
    app.get('/team/list', urlencodedParser, (req, res) => {
        dbo.collection("Team").find({}).toArray(
            (err, result) => {
                if (err) throw err;
                res.send({ result })
                console.log(result);

            }
        )
    })

    app.post('/update/team', urlencodedParser, (req, res) => {
        var query = { name: req.body.name }
        dbo.collection("Team").updateOne(query,
            {
                $set:
                {
                    name: req.body.name,
                    logo: req.body.logo,
                    tag_line: req.body.tag_line,
                    created_by: req.body.created_by
                }
            }, function (err, result) {
                if (err) throw err;
                console.log("updated successfully")
                res.send("updated")
            }
        )
    });
    app.post('/delete/team', urlencodedParser, (req, res) => {
        dbo.collection("Team").deleteOne({ name: req.body.name },
            function (err, result) {
                if (err) throw err;
                dbo.collection("Player").deleteMany(
                    { team_name: req.body.name },
                    (err, result) => {
                        if (err) throw err;
                        res.send("Deleted Sucssfully")
                    }
                )
            });
    })

    app.post('/player/create', urlencodedParser, (req, res) => {
        let obj = {
            name: req.body.name,
            team_id: req.body.team_id,
            team_name: req.body.team_name,
            skill: req.body.skill,
            created_by: req.body.created_by,
        }
        dbo.collection("Player").insertOne(
            obj,
            (err, result) => {
                if (err) throw err;
                console.log(result.name);
                res.send("Player record Inserted");
            }
        )
    }
    );
    app.get('/player/list', (req, res) => {
        dbo.collection("Player").find({}).toArray(
            (err, result) => {
                if (err) throw err;
                res.send({ result })

            }
        )
    })
    app.post('/update/player', urlencodedParser, (req, res) => {
        var query = { name: req.body.name }
        dbo.collection("Player").updateOne(query,
            {
                $set:
                {
                    name: req.body.name,
                    team_id: req.body.team_id,
                    skill: req.body.skill,
                    created_by: req.body.created_by,
                }
            },
            function (err, result) {
                if (err) throw err;
                console.log("updated successfully")
                res.send("updated")
            }
        )

    });
    app.post('/delete/player', urlencodedParser, (req, res) => {
        var query = { name: req.body.name }
        dbo.collection("Player").deleteOne(
            query,
            function (err, result) {
                if (err) throw err;
                res.send("Deleted Sucssfully")
            }
        )
    })
    app.listen(6000);
});