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

let TeamSchema = new mongoose.Schema({
    name: String,
    epScores: Array,
    roster: Array
}, {minimize:false});

let Team = mongoose.model("Team", TeamSchema);

let BakerSchema = new mongoose.Schema({
    name: String,
    img: String,
    bio: String,
}, {minimize:false});

let Baker = mongoose.model("Baker", BakerSchema);

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

app.get("/bakers", function(req, res) {
    Baker.find({}, function(err, allBakers){
        if(err){
            console.log(err);
        } else {
            res.render("bakers", {allBakers: allBakers});
        }
    });
});

app.get("/rosters", function(req, res) {
    Team.find({}, function(err, allTeams){
        if(err){
            console.log(err);
        } else {
            res.render("rosters", {teamList: allTeams});
        }
    });
});

app.post("/teams", function(req, res) {
    let newTeam = {
        name: req.body.name,
        slogan: req.body.slogan,
        epScores:{},
        bakers:{}
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