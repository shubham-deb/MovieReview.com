
var app = require('../../express');
var reviewModel = require('../../model/review/review.model.server');
//--------------------------------------------------------------------
    //------ALL URIs--------------------

app.post('api/project/createReview',createReview);
app.delete('api/project/deleteReview/:reviewId',deleteReview);
app.put('api/project/editReview/:reviewId',editReview);
app.get('api/project/getReview/:userId',getReview);
app.get('api/project/getAllReviews/:reviewId',getAllReviews);
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


function getReview(req,res) {
    var userId = req.params['userId'];
    reviewModel.getReview(userId)
        .then(function () {
            res.sendStatus(200);
        });
}

function getAllReviews(req,res) {
    var userId = req.params['userId'];
    reviewModel.getUserReviews(userId)
        .then(function () {
            res.sendStatus(200);
        });
}

