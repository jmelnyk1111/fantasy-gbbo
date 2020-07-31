const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

const mongoose = require("mongoose");
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, {
    useNewUrlParser: true
});

let conn = mongoose.connection;
conn.on('connected', () => {
    console.log("Mongoose is connected!");
});


let teamSchema = new mongoose.Schema({
    name: String,
    slogan: String,
    score: Object,
});

let Team = mongoose.model("Team", teamSchema);

// let teamTurtles = new Team({
//     name:"Meryl Streeper 2", 
//     slogan:"Somebody come geet er! NOW",
//     score:{
//         "ep1":6,
//         "ep2":12.5,
//         "ep3":4,
//         "ep4":6,
//         "ep5":12.5,
//         "ep6":4,
//         "ep7":6,
//         "ep8":12.5,
//         "ep9":4,
//         "ep10":6,
//     }
// });

// teamTurtles.save(function (err, team) {
//     if (err) return console.error(err);
//     console.log(team.name + " saved to Teams collection");
// });

app.get("/", function(req, res) {
    res.redirect("/teams");
});

app.get("/teams", function(req, res) {
    // Get all teams from DB
    Team.find({}, function(err, allTeams){
        if(err){
            console.log(err);
        } else {
            res.render("teams", {teamList: allTeams});
        }
    });
    
});

app.post("/teams", function(req, res) {
    let newTeam = {
        name: req.body.name,
        slogan: req.body.slogan,
        score:{
            "ep1":0,
            "ep2":0,
            "ep3":0,
            "ep4":0,
            "ep5":0,
            "ep6":0,
            "ep7":0,
            "ep8":0,
            "ep9":0,
            "ep10":0,
        }
    };

    Team.create(newTeam, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
    
});

app.get("/add-team", function(req, res) {
    res.render("addTeam");
});


let port = process.env.PORT || 8080;
app.listen(port);