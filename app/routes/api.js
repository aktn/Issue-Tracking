var User = require('../models/user');
var bodyParser = require('body-parser');
var config = require('../../config');
var jwt = require('jsonwebtoken');

var superSecret = config.secret;

module.exports = function(app, express){
    var apiRouter = express.Router();

    apiRouter.route('/users')

        .post(function(req, res){
            var user = new User();

            user.name = req.body.name;
            user.username = req.body.username;
            user.password = req.body.password;

            user.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success:false,message:'User with that name already exists'});
                    else
                        return res.send(err);
                }
                res.json({message:'User Created!'});

            });

        })

        .get(function(req, res){
           User.find({}, function(err,users){
               if(err) res.send(err);
               res.json(users);
           });
        });

    apiRouter.route('/users/:user_id')
        .get(function(req, res){
            User.findById(req.params.user_id, function(err, user){
                if(err) res.send(err);
                res.json(user);
            });
        })

        .put(function(req, res){
            User.findById(req.params.user_id,function(err, user){
                if(req.body.username) user.username = req.body.username;
                if(req.body.name) user.name = req.body.name;
                if(req.body.password) user.password = req.body.password;

                user.save(function(err){
                    if(err) res.send(err);
                    res.json({message:'User Updated!'});
                });
            });
        })

        .delete(function(req, res){
            User.remove({
                _id:req.params.user_id
            },function(err){
                if(err) res.send(err);
                res.json({message:'User Deleted!'});
            });
        });
};