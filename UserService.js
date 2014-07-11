var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended:false}));

//Include mongoose into project
var mongoose = require('mongoose');

//Create a data base
var URLString ='mongodb://localhost/ExpressUser';

// trace the status of program
console.log('Node JS server started....');

//Connect to data base
mongoose.connect(URLString,function(err){
    if(err){
        console.log('Error' + err);
    }else {
        console.log('successfully connect');
    }
});
// Create schema for intelliGrape Emp
var IntelliInfoSchema = new mongoose.Schema({
    id:{type:String, index:{unique:true}},  // set constraints
    name:{type:String}
});

// Create a instance of collection
var ExpressUsers = mongoose.model('ExpressUserInfo', IntelliInfoSchema);

app.get('/user/:id?', function(req, res) {
    if(req.params.id == undefined){
        ExpressUsers.find({},{_id:0,name:1,id:1}).limit(0).exec(function(err, result) {

            if (err) {
                //callback(err);
                console.log('Error while saving user...' + err);
                return;
            }
            //console.log('Found :' + result);
            res.send(result);

            // callback();
        });
    }else{
        ExpressUsers.find({id:req.params.id},{_id:0,name:1}).limit(0).exec(function(err, result) {

            if (err) {
                //callback(err);
                console.log('Error while saving user...' + err);
                return;
            }
            //console.log('Found :' + result);
            if(result.length > 0)
                res.send(result);
            else
                res.send('No result found');


            // callback();
        });
    }
});

app.post('/user', function(req, res) {
    var uId = req.body.uId;
    var uName = req.body.uName;
    var userData = {
        id:uId,
        name:uName
    };
    new ExpressUsers(userData).save(function (err) {
        if (err) {
            res.send('Some error occured');
        } else {
            res.send('Add a new user');
        }
    });
});

app.put('/user/:id', function(req, res) {
    // Update user information
    console.log('user id  ' + req.param.id);
    if(req.param('id') == undefined){
        res.send('Missing user id');
    }else {
        var uName = req.body.uName;
        ExpressUsers.update({id:req.param('id')},{name:uName},function(err,result){
            if (err) {
                res.send('Some problem occured at the time of update');
            }else
                res.send('Update record ' + result);
        });
    }
});


app.delete('/user/:id', function(req, res) {
    // Update user information
    if(req.params.id == undefined){
        res.send('Missing user id');
    }else {
        ExpressUsers.remove({id:req.params.id}, function(err, result) {
            if (err) {
                res.send('Error while remove  data from DB..' + err);
            }
            else {
                res.send('Remove successfully');
            }
        });
    }
});


app.listen(3000);