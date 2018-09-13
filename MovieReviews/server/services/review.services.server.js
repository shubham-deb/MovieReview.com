
var app = require('../../express');
var reviewModel = require('../../model/review/review.model.server');
//--------------------------------------------------------------------
    //------ALL URIs--------------------

app.post('api/project/createReview',createReview);
app.delete('api/project/deleteReview/:reviewId',deleteReview);
app.put('api/project/editReview/:reviewId',editReview);
//----------------------------------------------

function createReview(req,res) {
    var review = req.body;
    reviewModel
        .createReview(review)
        .then(function (review) {
            res.json(review);
        })
}

function deleteReview(req,res) {

    var reviewId = req.params['reviewId'];
    reviewModel.deleteReview(reviewId)
        .then(function () {
            res.sendStatus(200);
        })
}

function editReview(req,res) {
    var review = req.body;
    var reviewId = req.params['reviewId'];
    reviewModel.editReview(reviewId,review)
        .then(function () {
            res.sendStatus(200);
        })
}


