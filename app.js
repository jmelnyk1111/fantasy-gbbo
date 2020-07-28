const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const mongoose = require("mongoose");
const uri = "mongodb+srv://jaredmelnyk:d36Vvf5MsF5cYnc@cluster0.qaqkq.mongodb.net/Cluster0"
mongoose.connect(uri);

let teamSchema = new mongoose.Schema({
    name: String,
    slogan: String,
});

let Team = mongoose.model("Team", teamSchema);

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
        slogan: req.body.slogan
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


let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}
app.listen(port);