
var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');

var userModel = mongoose.model('UserModel',userSchema);
//--------------------------------------------------------
    //--Function Declarations-----------//
userModel.findUserByCredentials=findUserByCredentials;
userModel.createUser=createUser;
userModel.deleteUser=deleteUser;
userModel.findUserByEmail=findUserByEmail;
userModel.findUserByUsername=findUserByUsername;
userModel.updateUser=updateUser;
userModel.findUserById=findUserById;
userModel.findUserByGoogleId = findUserByGoogleId;
userModel.findUserByFacebookId = findUserByFacebookId;
userModel.addReview = addReview;
userModel.deleteReview=deleteReview;
userModel.uploadProfileImage=uploadProfileImage;
userModel.addFollower=addFollower;
userModel.addFollowing=addFollowing;
userModel.getFollowers = getFollowers;
userModel.getFollowings=getFollowings;
userModel.unfollow=unfollow;
userModel.removeFollower = removeFollower;

userModel.addMovie = addMovie;
userModel.getMoviesFromWatchList = getMoviesFromWatchList;
userModel.deleteMoviesFromWatchList = deleteMoviesFromWatchList;
userModel.likeMovie = likeMovie;
userModel.unlikeMovie  = unlikeMovie;
userModel.getLikedMovies = getLikedMovies;
userModel.getPersonById=getPersonById;
userModel.changePassword= changePassword;
userModel.getAllUsers=getAllUsers;
//----------------------------------------------------------
module.exports = userModel;
//--------------------------------------------------------
        //----Function Definitions-------//

function findUserByCredentials(username,password) {
    return userModel.findOne({username:username,password:{$exists:true}});
}

function createUser(user) {
   return userModel.create(user);
}

function deleteUser(userId) {
    // find all followers of this userid
    // return getFollowers(userId)
    //     .then(function (followers) {
    //         console.log("Followers are :"+followers);
    //         for(f in followers){
    //             unfollow(userId,followers[f]);
    //             getFollowings(userId)
    //                 .then(function (followingids) {
    //                     console.log("Following ids are "+followingids);
    //                     unfollow(followers[f],userId);
    //                 })
    //         }
            return userModel.remove({_id:userId});
        // });
}

function findUserByEmail(email) {
    return userModel.findOne({email:email});
}

function findUserByUsername(username) {
    return userModel.findOne({username:username});

}

function updateUser(userId,user) {
    if(typeof user.role === 'string')
        user.role = user.role.split(',');
    return userModel.update({_id:userId},{$set:user});
}

function findUserById(userId) {
    return userModel.findById(userId);
}

function findUserByGoogleId(googleId) {
    return userModel.findOne({'google.id':googleId});
}

function findUserByFacebookId(facebookId) {
    return userModel.findOne({'facebook.id': facebookId});
}

function addReview(userId,reviewId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            user.reviews.push(reviewId);
            return user.save();
        })
}

function deleteReview(userId,reviewId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            var index = user.reviews.indexOf(reviewId);
            user.reviews.splice(index,1);
            return user.save();
        })
}

function uploadProfileImage(userId,url) {
    return userModel
        .findById(userId)
        .then(function (user) {
            user.url=url;
            return user.save();
        })
}

function addFollower(followeeId,followerId) {
    return userModel
        .findById(followeeId)
        .then(function (user) {
            user.followers.push(followerId);
            return user.save();
        })

}
function addFollowing(followeeId,followerId) {

    return userModel
        .findById(followerId)
        .then(function (user) {
            user.following.push(followeeId);
            user.save();
           return userModel.addFollower(followeeId,followerId);
        })

}

function getFollowers(userId) {
    return userModel
        .findById(userId)
        .populate('followers','watchList username url likes reviews')
        .exec();

}
function getPersonById(userId) {
    return userModel
        .findById(userId)
        .then(function (user) {

            return {
                username:user.username,
                url:user.url,
                likes:user.likes,

            }  ;
        })


}

function getFollowings(userId) {
    return userModel
        .findById(userId)
        .populate('following','username watchList url likes reviews')
        .exec();

}

function unfollow(followeeId,followerId) {
    return userModel
        .findById(followerId)
        .then(function (user) {
            var index = user.following.indexOf(followeeId);
            user.following.splice(index,1);
            user.save();
            return userModel.removeFollower(followeeId,followerId);
        })

}
function removeFollower(followeeId,followerId) {

    return userModel
        .findById(followeeId)
        .then(function (user) {
            var i = user.followers.indexOf(followerId);
            user.followers.splice(i,1);
            return user.save();
        })
}
function addMovie(userId, movie) {
    return userModel
        .findById(userId)
        .then(function (user) {
            user.watchList.push(movie);
            return user.save();
        });
}

function getMoviesFromWatchList(userId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            return user.watchList;
        })
}

function deleteMoviesFromWatchList(movieId,userId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            for(m in user.watchList){
                var movie = user.watchList[m];
                // console.log(movie.id+" : "+movieId);
                if(parseInt(movie.id) === parseInt(movieId)){
                    user.watchList.splice(m,1);
                    return user.save();
                }
            }
            return null;
        });
}

function likeMovie(userId,movie) {
    return userModel
        .findById(userId)
        .then(function (user) {
            user.likes.push(movie);
            return user.save();
        });
}

function unlikeMovie(movieId,userId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            for(m in user.likes){
                var movie = user.likes[m];
                // console.log(movie.id+" : "+movieId);
                if(parseInt(movie.id) === parseInt(movieId)){
                    user.likes.splice(m,1);
                    return user.save();
                }
            }
            return null;
        });
}

function getLikedMovies(userId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            return user.likes;
        })
}

function changePassword(userId,user) {

    return userModel.update({_id:userId},{$set:user});
}


function getAllUsers() {
    return userModel.find();
}

