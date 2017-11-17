
var Schema = {};

// 유저스키마를 만드는 함수
Schema.createSchema = function (mongoose) {

    var UserSchema;
    // 유저스키마 생성 ( 구조 )
    UserSchema = mongoose.Schema({
        id : {type : String, required : true ,unique : true},
        password : {type : String, required : true },
        name : {type : String, index : 'hashed'},
        age : {type : Number, 'default' : -1},
        created_at : {type : Date, index : {unique:false},'default' : Date.now},
        updated_at : {type : Date, index : {unique:false},'default' : Date.now},
    });

    return UserSchema;

};

module.exports = (Schema);
