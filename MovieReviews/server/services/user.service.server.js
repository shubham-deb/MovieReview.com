


        var app = require('../../express');
        var passport = require('passport');
        var LocalStrategy= require('passport-local').Strategy;
        var bcrypt = require('bcrypt-nodejs');
        var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
        var FacebookStrategy = require('passport-facebook').Strategy;
        var multer = require('multer'); // npm install multer --save
        var upload = multer({ dest: __dirname+'/../../public/uploads/user-profile-pictures'});


//---------------------------------------------------
        passport.serializeUser(serializeUser);
        passport.deserializeUser(deserializeUser);
        passport.use(new LocalStrategy(localStrategy));
//-----------------------------------------------------------
        var userModel = require('../../model/user/user.model.server');
        var reviewModel = require('../../model/review/review.model.server');
//------------------------------------------------------------
    // All URI

        app.post('/api/project/login',passport.authenticate('local'),login);
        app.post('/api/project/user',isAdmin,createUser);
        app.post('/api/project/register',register);
        app.post('/api/project/unregister',unregister);
        app.get('/api/project/checkLoggedIn',checkLoggedIn);
        app.get('/api/project/admin/checkAdmin',checkAdmin);
        app.post('/api/project/logout',logout);
        app.put('/api/project/updateUser/:userId',updateUser);
        app.post('/api/project/changePassword/:userId',changePassword);
        app.get('/api/project/findUserByUsername',findUserByUsername);
        app.get('/api/project/findUserById/:userId',findUserById);
        app.delete('/api/project/deleteUser/:userId',isAdmin,deleteUser);
        app.post('/api/project/addToWatchList/:userId',addToWatchList);
        app.delete('/api/project/deleteMoviesFromWatchList/:movieId/user/:userId',deleteMoviesFromWatchList);
        app.get('/api/project/getMoviesFromWatchList/:userId',getMoviesFromWatchList);
        app.post('/api/project/likeMovie/user/:userId',likeMovie);
        app.delete('/api/project/unlikeMovie/:movieId/user/:userId',unlikeMovie);
        app.get('/api/project/getLikedMovies/:userId',getLikedMovies);
        app.post('/api/project/submitReview/user/:userId',submitReview);
        app.get('/api/project/getUserReviews/:userId',getUserReviews);
        app.post('/api/editReview/user/:reviewId',editReview);
        app.delete('/api/project/deleteReview/user/:userId/review/:reviewId',deleteReview);
        app.post ("/api/project/uploadProfileImage", upload.single('myFile'), uploadImage);
        app.get('/api/project/getFollowers/:userId',getFollowers);
        app.get('/api/project/getFollowings/:userId',getFollowing);
        app.get('/api/project/getPersonById/:userId',getPersonById);
        app.put('/api/project/addFollower/follower/:followerId/followee/:followeeId',addFollower);
        app.put('/api/project/addFollowing/follower/:followerId/followee/:followeeId',addFollowing);
        app.delete('/api/project/unfollow/follower/:followerId/followee/:followeeId',unfollow);
        app.get('/api/project/getAllReviews',getAllReviews);
        app.get('/api/project/getAllUsers',isAdmin,getAllUsers);
        app.delete('/api/project/deleteUserReviews/user/:userId',deleteUserReviews);

        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect: '/',
                failureRedirect: '/'
            }));

        app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect: '/',
                failureRedirect: '/'
            }));

        var googleConfig = {
            // clientID     : "1068123510453-uravjvr4a895vmec8c4dpssj9m49b7qn.apps.googleusercontent.com",
            // clientSecret : "TbvEW-FimdwlxOksz5cSyW9Y",
            // callbackURL  : "https://wedevproject.herokuapp.com/auth/google/callback"
            clientID     : process.env.GOOGLE_CLIENT_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET,
            callbackURL  : process.env.GOOGLE_CALLBACK_URL
        };
        var facebookConfig = {
            // clientID     : "242625612892833",
            // clientSecret : "0c36a8f1fbe8ca589dfc83ca8dfd442e",
            // callbackURL  : "https://deb-shubham-webdev.herokuapp.com/auth/facebook/callback",
            clientID     : process.env.FACEBOOK_CLIENT_ID,
            clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL  : process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'displayName', 'email']
        };

        passport.use(new GoogleStrategy(googleConfig, googleStrategy));
        passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
//------------------------------------------------------------
        // ALL function definitions
        
        function isAdmin(req,res,next) {
            if(req.isAuthenticated() && req.user.role.indexOf('admin')>-1){
                next();
            }else{
                res.sendStatus(401);
            }
        }

        function findUserById(req,res) {
            var userId = req.params.userId;
            userModel.findUserById(userId).then(function (user) {
                res.json(user);
            },function (err) {
                res.sendStatus(404);
            })
        }

        function localStrategy(username, password, done) {
                userModel
                    .findUserByCredentials(username,password)
                    .then(function (user) {
                        if(user && bcrypt.compareSync(password,user.password)){
                            return done(null,user);
                        }
                        else{
                              return done(null,false);
                        }
                    },function (err) {
                        if (err) { return done(err); }
                    })
         }

        function login(req,res) {
                var user = req.user;
                res.json(user);
        }

        function register(req,res) {
                var user = req.body;
                user.password=bcrypt.hashSync(user.password);
                userModel
                    .createUser(user)
                    .then(function (user) {
                            req.login(user,function () {
                                res.json(user);
                            })

                    },function () {
                        res.sendStatus(404);
                })
        }

        function unregister(req,res) {
            var user = req.body;
            userModel
                .deleteUser(user._id)
                .then(function (user) {
                    req.logout();
                    res.sendStatus(200);
                },function () {
                    res.sendStatus(404);
                })
        }

        function checkLoggedIn(req,res) {
                res.send(req.isAuthenticated()? req.user:'0');
        }
        
        function checkAdmin(req,res) {
            res.send(req.isAuthenticated() && req.user.role.indexOf('admin')>-1? req.user:'0');
        }

        function logout(req,res) {
                req.logout();
                res.sendStatus(200);
        }

        function updateUser(req,res) {
            var user = req.body;
            var userId = user._id;
            userModel
                .updateUser(userId,user)
                .then(function () {
                    res.sendStatus(200);
                })
        }


        function changePassword(req,res) {
            var userId = req.params.userId;
            var newPwd = req.body.newPwd;
            var oldPwd = req.body.oldPwd;
            userModel.findUserById(userId)
                .then(function (user) {
                    if(user && bcrypt.compareSync(oldPwd,user.password)){

                        newPwd=bcrypt.hashSync(newPwd);
                        var user={
                            password:newPwd
                        };
                        userModel.changePassword(userId,user)
                            .then(function () {
                                res.sendStatus(200);
                            })
                    }
                    else{
                        return res.sendStatus(404);
                    }
            })
        }

        function findUserByUsername(req,res) {
                var username = req.query.username;
                userModel
                    .findUserByUsername(username)
                    .then(function (user) {
                        res.json(user);
                    },function () {
                        res.sendStatus(404);
                    })
        }

        function deleteUser(req,res) {
                var userId = req.params.userId;
                userModel
                    .deleteUser(userId)
                    .then(function () {
                        res.sendStatus(200);
                    });
        }

        function serializeUser(user,done) {
            done(null,user);
        }

        function deserializeUser(user,done) {
                userModel
                    .findUserById(user._id)
                    .then(function (user) {
                        done(null,user);
                    },function (err) {
                        done(err,null)
                    });
        }

        function facebookStrategy(token, refreshToken, profile, done) {
            userModel
                .findUserByFacebookId(profile.id)
                .then(
                    function(user) {
                        if(user) {
                            return done(null, user);
                        } else {
                            console.log(profile);
                            var email = profile.emails[0].value;
                            var emailParts = email.split("@");
                            var newFacebookUser = {
                                username:  emailParts[0],
                                firstName: profile.name[0],
                                lastName:  profile.name[1],
                                email:     email,
                                facebook: {
                                    id:    profile.id,
                                    token: token
                                }
                            };
                            return userModel.createUser(newFacebookUser);
                        }
                    },
                    function(err) {
                        if (err) { return done(err); }
                    }
                )
                .then(
                    function(user){
                        return done(null, user);
                    },
                    function(err){
                        if (err) { return done(err); }
                    }
                );
        }

        function googleStrategy(token, refreshToken, profile, done) {
            userModel
                .findUserByGoogleId(profile.id)
                .then(
                    function(user) {
                        if(user) {
                            return done(null, user);
                        } else {
                            var email = profile.emails[0].value;
                            var emailParts = email.split("@");
                            var newGoogleUser = {
                                username:  emailParts[0],
                                firstName: profile.name.givenName,
                                lastName:  profile.name.familyName,
                                email:     email,
                                google: {
                                    id:    profile.id,
                                    token: token
                                }
                            };
                            return userModel.createUser(newGoogleUser);
                        }
                    },
                    function(err) {
                        if (err) { return done(err); }
                    }
                )
                .then(
                    function(user){
                        console.log(user);
                        return done(null, user);
                    },
                    function(err){
                        if (err) { return done(err); }
                    }
                );
        }


        function uploadImage(req, res) {

            var myFile        = req.file;

            var userId = req.body.userId;


            var originalname  = myFile.originalname; // file name on user's computer
            var filename      = myFile.filename;     // new file name in upload folder
            var path          = myFile.path;         // full path of uploaded file
            var destination   = myFile.destination;  // folder where file is saved to
            var size          = myFile.size;
            var mimetype      = myFile.mimetype;
            var url= '/uploads/user-profile-pictures/'+filename;

            var callbackUrl=req.body.callbackUrl;
            //widget = getWidgetById(widgetId);

            userModel
                .uploadProfileImage(userId,url)
                .then(function (status) {
                    //var callbackUrl   = "/#!/profile";
                     //res.sendStatus(200);
                   res.redirect(callbackUrl);
                });
            //widget.url = '/assignment/uploads/'+filename;


        }
        function addFollower(req,res) {
            var followerId = req.params.followerId;
            var followeeId= req.followeeId;
            userModel.addFollower(followeeId,followerId).then(function () {
                res.sendStatus(200);
            })

        }
        function addFollowing(req,res) {

            var followerId = req.params.followerId;
            var followeeId= req.params.followeeId;
            userModel.addFollowing(followeeId,followerId).then(function (user) {
                res.sendStatus(200);
            },function (err) {
                console.log(err);
                res.sendStatus(404);
            })

        }

        function getFollowers(req,res) {

            var userId = req.params.userId;
            userModel.getFollowers(userId)
                .then(function (user) {
                    res.json(user.followers);
                })
        }

        function getPersonById(req,res) {

            var userId = req.params.userId;
            userModel.getPersonById(userId)
                .then(function (user) {
                    res.json(user);
                })
        }

        function getFollowing(req,res) {
            var userId = req.params.userId;
            userModel.getFollowings(userId)
                .then(function (user) {
                    res.json(user.following);
                })
        }

        function unfollow(req,res) {
            var followerId = req.params.followerId;
            var followeeId= req.params.followeeId;
            userModel
                .unfollow(followeeId,followerId)
                .then(function () {
                res.sendStatus(200);
            })
        }
        function addToWatchList(req,res) {
            var movie = req.body;
            var userId = req.params.userId;
            var movieobject = {
                id:movie.id,
                title:movie.title,
                poster_path:movie.poster_path,
                vote_average:movie.vote_average,
                overview:movie.overview,
                release_date:movie.release_date,
                genres:movie.genres,
                vote_count:movie.vote_count
               };
            userModel
                .addMovie(userId,movieobject)
                .then(function (response) {
                    res.sendStatus(200);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                })
        }

        function getMoviesFromWatchList(req,res) {
            var userId = req.params.userId;
            userModel
                .getMoviesFromWatchList(userId)
                .then(function (movies) {
                    res.send(movies);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                })
        }

        function deleteMoviesFromWatchList(req,res) {
            var movieId = req.params.movieId;
            var userId = req.params.userId;
            userModel
                .deleteMoviesFromWatchList(movieId,userId)
                .then(function (response) {
                    res.sendStatus(200);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                })
        }

        function likeMovie(req,res) {
            var movie = req.body;
            var userId = req.params.userId;
            var movieobject = {
                id:movie.id,
                title:movie.title,
                poster_path:movie.poster_path,
                vote_average:movie.vote_average,
                overview:movie.overview,
                release_date:movie.release_date,
                genres:movie.genres,
                vote_count:movie.vote_count
            };
            userModel
                .likeMovie(userId,movieobject)
                .then(function (response) {
                    res.sendStatus(200);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                })
        }

        function unlikeMovie(req,res) {
            var movieId = req.params.movieId;
            var userId = req.params.userId;
            userModel
                .unlikeMovie(movieId,userId)
                .then(function (response) {
                    res.sendStatus(200);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                })
        }
        
        function getLikedMovies(req,res) {
            var userId = req.params.userId;
            userModel
                .getLikedMovies(userId)
                .then(function (movies) {
                    res.send(movies);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                })
        }

        function submitReview(req,res) {
            var review = req.body;
            var userId =  req.params.userId;
            reviewModel
                .createReview(userId,review)
                .then(function (response) {
                    res.send(response);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                });
        }

        function getUserReviews(req,res) {
            var userId = req.params.userId;
            reviewModel
                .getUserReviews(userId)
                .then(function (reviews) {
                    res.send(reviews);
                },function (err) {
                    res.sendStatus(404);
                })
        }

        function editReview(req,res) {
            var reviewId = req.params.reviewId;
            var review = req.body;
            reviewModel
                .editReview(reviewId,review)
                .then(function (response) {
                    res.send(response);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                })
        }
        
        function deleteReview(req,res) {
            var userId = req.params.userId;
            var reviewId  = req.params.reviewId;
            reviewModel
                .deleteReview(userId,reviewId)
                .then(function (response) {
                    res.sendStatus(200);
                },function (response) {
                    res.sendStatus(404);
                });
        }

        function getAllReviews(req,res) {
            reviewModel
                .getAllReviews()
                .then(function (response) {
                    res.send(response);
                },function (err) {
                    res.sendStatus(404);
                })
        }
        // function deleteReview(req,res) {
        //     var review = req.body;
        //     var userId =  req.params.userId;
        //     reviewModel
        //         .deleteReview(userId,review)
        //         .then(function (response) {
        //             res.sendStatus(200);
        //         },function (err) {
        //             console.log(err);
        //             res.sendStatus(404);
        //         });
        // }
        
        function getAllUsers(req,res) {
            userModel
                .getAllUsers()
                .then(function (users) {
                    res.send(users);
                },function (err) {
                    res.sendStatus(404);
                })
        }
        
        function createUser(req,res) {
            var user = req.body;
            user.password=bcrypt.hashSync(user.password);
            userModel
                .createUser(user)
                .then(function (user) {
                    res.send(user);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                });
        }

        function deleteUserReviews(req,res) {
            var userId = req.params.userId;
            return reviewModel
                .deleteUserReviews(userId)
                .then(function (response) {
                    console.log(response);
                    res.sendStatus(200);
                },function (err) {
                    console.log(err);
                    res.sendStatus(404);
                })
        }

