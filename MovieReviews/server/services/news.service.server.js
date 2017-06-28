
var app = require('../../express');

//---------ALL URIS-------------------------

app.get('/api/project/getNewsApiKey',getNewsApiKey);
// app.get('/api/project/getNewsApiKey',getNewsApiKey);
app.get('/api/project/getTmdbKey',getTmdbKey);
app.get('/api/project/getNyKey',getNyKey);

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