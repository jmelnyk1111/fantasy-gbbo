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
    {
        name:"Brendan", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/brendan-large1.jpg", 
        bio:"Irish born Brendan has begun a two-year project to bake all of the breads in the world. To date, the 63-year old has made 90. He’s always dreamt of pursuing a career in baking and now semi-retired, bakes as a hobby. He describes himself as a perfectionist, determined and a “complete-finisher”. Brendan’s grade 8 in cello, having taken up the instrument only a few years earlier, but insists he has some way to go to get the right beautiful sound."
    },
    {
        name:"Cathryn", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/cathryn-large1.jpg", 
        bio:"Known as a “last minute Larry” amongst friends, young mum Cathryn admits she finds it hard to say no. She once promised a friend an 80th Birthday cake, but had forgotten she’d arranged a girl’s night out. She arrived home at 130am, and was baking till 4am. She’s also a messy baker – her husband can tell when she’s been baking because of the trail of floury footprints to the kitchen."
    },
    {
        name:"Danny", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/danny-large1.jpg",
        bio:"Self-confessed cookbook obsessive Danny admits she bakes because she’s still a greedy child that wants to eat. She exercises several times a week to work the baking excesses off. She loves travelling and has visited South America, Easter Island, South East Asia and several countries in the Middle East, including Iran where she picked up tips for baking. For Danny, taking part in the Bake Off is an opportunity to test herself against the standard."
    },
    {
        name:"James", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/james-large1.jpg",
        bio:"James is our youngest baker in this year’s competition. He started baking with his granny and is currently studying medicine in Scotland. To James, medicine is similar to baking as it involves marrying science and nurture. Aside from his studies, he’s reached grade eight in classical Double Bass."
    },
    {
        name:"John", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/john-large1.jpg",
        bio:"John jokes that he left his place at Oxford University because they didn’t have an oven. His love of baking restarted with a vengeance three years ago when he left home to study. He says he’s extremely competitive and wants to win."
    },
    {
        name:"Sarah-Jane", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/sarah-large1.jpg",
        bio:"Sarah-Jane has baked her whole life. She is mainly a cake, biscuit, dessert maker and is new to baking bread which she now really enjoys. Her family’s waistlines (including vicar husband) suffer for her hobby says the 28-year old."
    },
    {
        name:"Ryan", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/ryan-large1.jpg",
        bio:"Dad of two Ryan makes the same bake until he gets it just right. He loves infusing Western baking with lesser known Asian flavours and new techniques he’s garnered from his travels. Jack of all trades, Ryan worked in finance and IT before becoming a professional photographer."
    },
    {
        name:"Peter", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/peter-large1.jpg",
        bio:"Peter attempts to recreate the recipes and pictures he’s torn out of magazines. His love of baking is well known at his children’s school and with a reputation for excellence, the requests flood in for anything from school fetes to wedding cakes."
    },
    {
        name:"Natasha", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/natasha-large1.jpg",
        bio:"Natasha was quick to take control in the kitchen at the young age of 12, and describes herself as reliable, generous, welcoming and a sharer. She admits that she has a vast baking portfolio because she gets bored of making the same things over again."
    },
    {
        name:"Manisha", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/manisha-large1.jpg",
        bio:"Manisha is our youngest female in the series. She lived in India for five years when she was eight years old and moved back to Leicester as a teen. Her baking passion began when her mum showed her how to make a Victoria Sponge. Her strengths are classic English biscuits, cakes and pastry but she also makes some Indian biscuits and cakes too."
    },
    {
        name:"Victoria", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/victoria-large1.jpg",
        bio:"Victoria describes herself as loyal, passionate and solitary with a good sense of humour. Aside from baking, she loves needlecraft, knitting and things you can share with others. She’s a fan of different shapes like square or rectangular tarts and loves a good excuse to buy a nice piece of baking equipment."
    },
    {
        name:"Stuart", 
        img:"https://thegreatbritishbakeoff.co.uk/wp-content/uploads/2013/08/stuart-large1.jpg",
        bio:"The youngest of four, Stuart has baked since he was little. Last year he made his own three-tiered wedding cake, much to the surprise of his mother-in-law. He’s a fan of creating new flavour combinations. His wife admits he reads cookery books in bed at night. He enjoys playing rugby and cycling in his spare time."
    },
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