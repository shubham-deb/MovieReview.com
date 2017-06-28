var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
mongoose.connect('mongodb://localhost/MovieReviewProject');

// mongoose.connect('mongodb://shabbirsaifee:Barcelona_123@ds139781.mlab.com:39781/heroku_gvpdptmh');

mongoose.connection.on('open',function () {
console.log('Movie Review Database Connected');
});

require('./services/user.service.server');
require('./services/news.service.server');
require('./services/review.services.server');
