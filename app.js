const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();
let tools = require("./tools");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

const mongoose = require("mongoose");
const { query } = require("express");
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

let conn = mongoose.connection;
conn.on('connected', () => {
    console.log("Mongoose is connected!");
});

let TeamSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    epScores: Array,
    roster: Array
}, {minimize:false});

let Team = mongoose.model("Team", TeamSchema);

let BakerSchema = new mongoose.Schema({
  name: String,
  img: String,
  bio: String,
  epScores: [{
    episode: Number,
    scores: [{
      category: String,
      score: Number
    }]
  }]
}, {minimize:false});

let Baker = mongoose.model("Baker", BakerSchema);

let EpisodeScoreSchema = new mongoose.Schema({
    _id: String,
    episode: Number,
    bakerName: String,
    scores: [{
        _id: Number,
        category: String,
        score: Number
    }]
}, {minimize:false});

let EpisodeScore = mongoose.model("EpisodeScore", EpisodeScoreSchema);

app.get("/", function(req, res) {
    res.redirect("/teams");
});

app.get("/teamPage/:teamId", function(req, res) {
    Team.find({_id: req.params.teamId}, function(err, team) {
        if(err){
            console.log(err);
        } else {
            Baker.find({}, function(err, allBakers) {
                if(err){
                    console.log(err);
                } else {
                    res.render("teamPage", {team: team, allBakers: allBakers});
                }
            });
        }
    });
});

app.get("/input-scores", function(req, res) {
  let submit = req.query.submit || false;  
  Baker.find({}, function(err, allBakers) {
    if(err){
      console.log(err);
    } else {
      EpisodeScore.find({episode:0}, function(err, score) {
        if(err){
          console.log(err);
        } else {
          res.render("inputScores", {submit: submit, allBakers: allBakers, score: score});
        }
      });
    }
  });
});

app.get("/teams", function(req, res) {
    // Get all teams from DB
    Team.find({}, function(err, allTeams) {
        if(err){
            console.log(err);
        } else {
            Baker.find({}, function(err, allBakers) {
                if(err){
                    console.log(err);
                } else {
                    
                    res.render("teams", {allTeams: allTeams, allBakers: allBakers});
                }
            });
        }
    });
});

app.get("/bakers", function(req, res) {
    Baker.find({}, function(err, allBakers) {
        if(err){
            console.log(err);
        } else {
            res.render("bakers", {allBakers: allBakers});
        }
    });
});

app.get("/rosters", function(req, res) {
    Team.find({}, function(err, allTeams) {
        if(err){
            console.log(err);
        } else {
            Baker.find({}, function(err, allBakers){
                if(err){
                    console.log(err);
                } else {
                    res.render("rosters", {teamList: allTeams, allBakers: allBakers});
                }
            });
        }
    });
});

app.post("/input-scores", function(req, res) {
  Baker.findOne({"name": req.body.baker}, function(err, baker) {
    if(err) return res.status(500).send({error:err});
    let bakerId = baker._id;
    EpisodeScore.find({episode: 0}, function(err, epScore) {
      if(err) return res.status(500).send({error:err});
      let newEpScore = {
        episode: req.body.episode,
        scores: []
      };
      for(let [index, scoreCat] of epScore[0].scores.entries()) {
        let catString = scoreCat.category;
        newEpScore.scores.push({id: index, category: catString, score: req.body[catString]});
      };
      Baker.findOneAndUpdate(
        {_id: bakerId}, 
        { $addToSet: {epScores: newEpScore}}, 
        {upsert: true},  
        function(err, daScore){
          if(err){
            console.log(err);
          } else {
            res.redirect("/input-scores?submit=true");
          }
      });
    });
  });
});

app.post("/teams", function(req, res) {
    let newTeam = {
        name: req.body.name,
        slogan: req.body.slogan,
        epScores:{},
        bakers:{}
    };

    Team.create(newTeam, function(err, newlyCreated) {
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