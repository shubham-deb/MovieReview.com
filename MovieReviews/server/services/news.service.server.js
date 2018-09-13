
var app = require('../../express');

//---------ALL URIS-------------------------

app.get('/api/project/getNewsApiKey',getNewsApiKey);
// app.get('/api/project/getNewsApiKey',getNewsApiKey);
app.get('/api/project/getTmdbKey',getTmdbKey);
app.get('/api/project/getNyKey',getNyKey);

var NyKey = "7e11f0c2bed84265a72a1b17de947ab7";
var Tmdbey = "8b4a101400c25efdf094f6b9b8081675";
var NwsKey = "d5457e48-805f-4353-aca6-32df568fab15"
//------------------------------------------

function getNewsApiKey(req,res) {

    res.json(process.env.GUARDIANS_NEWS_API_KEY);
    // res.json(NyKey);
}

function getTmdbKey(req,res) {
// res.json(Tmdbey);
    res.json(process.env.TMDB_API_KEY);
}
function getNyKey(req,res) {

    res.json(process.env.NY_API_KEY);
    // res.json(NwsKey);
}