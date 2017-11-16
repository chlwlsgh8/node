
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

function connectDB() {

    var databaseUrl = 'mongodb://localhost:27017/local';

    console.log('db 연결 시도');

    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('open',function () {
        console.log('db 연결');

        UserSchema = mongoose.Schema({
            id : String,
            name : String,
            password : String
        });
        console.log('schema 정의');

        UserModel = mongoose.model('users',UserSchema);
        console.log('usermodel 정의');

    });

}
