var express = require('express');
var bodyParser = require('body-parser');
var underscore = require('underscore');
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

// Create schema for intelliGrape Emp
var bookSchema = new mongoose.Schema({
    id:{type:String, index:{unique:true}},  // set constraints
    name:{type:String},
    writer:{type:Array}
});

// Create a instance of collection
var bookInfo = mongoose.model('ExpressBookInfo', bookSchema);

function findData() {
    ExpressUsers.find({}).limit(0).exec(function(err, result) {

        if (err) {
            console.log('Error while saving user...' + err);
            return;
        }
        console.log('Found :' + result);
    });
}

console.log(__dirname);
app.use(express.static(__dirname));

app.get('/user/:id?', function(req, res) {
    var userId = req.params.id;
    if(req.params.id == undefined){
        ExpressUsers.find({},{_id:0,name:1,id:1}).limit(0).exec(function(err, result) {

            if (err) {
                console.log('Error while saving user...' + err);
                return;
            }
            res.send(result);

        });
    }else{
        ExpressUsers.find({id:req.params.id},{_id:0,name:1}).limit(0).exec(function(err, result) {

            if (err) {
                console.log('Error while saving user...' + err);
                return;
            }
            if(result.length > 0){
                bookInfo.find({}).limit(0).exec(function(err, bookResult) {

                    if (err) {
                        console.log('Error while saving user...' + err);
                        return;
                    }

                    var bookArray = [];
                    var index = 0;
                    for(var i = 0; i < bookResult.length; i++) {
                        var userIds = bookResult[i].writer;
                        for(var j = 0; j < userIds.length; j++){
                            if(userIds[j] == userId){
                                bookArray.push(bookResult[i].name) ;
                            }
                        }
                    }
                    var resultObj =
                    {
                        name : result[0].name,
                        hasBooks : bookArray

                    }
                    res.send('final result  ' + JSON.stringify(resultObj));

                });

            }
            else
                res.send('No result found');
        });
    }
});

app.listen(3000);