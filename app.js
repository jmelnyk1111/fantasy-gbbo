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

let bakerList = [
    {name:"Brendan", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/brendan-large1.jpg"},
    {name:"Cathryn", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/cathryn-large1.jpg"},
    {name:"Danny", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/danny-large1.jpg"},
    {name:"James", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/james-large1.jpg"},
    {name:"John", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/john-large1.jpg"},
    {name:"Sarah-Jane", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/sarah-large1.jpg"},
    {name:"Ryan", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/ryan-large1.jpg"},
    {name:"Peter", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/peter-large1.jpg"},
    {name:"Natasha", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/natasha-large1.jpg"},
    {name:"Manisha", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/manisha-large1.jpg"},
    {name:"Victoria", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/victoria-large1.jpg"},
    {name:"Stuart", img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/stuart-large1.jpg"},
];

let teamSchema = new mongoose.Schema({
    name: String,
    slogan: String,
    epScores: Object,
    bakers: Object
}, {minimize:false});

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

app.get("/bakers", function(req, res) {
    res.render("bakers", {bakerList: bakerList});
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