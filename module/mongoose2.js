
// 기본 모듈 생성
var http = require('http');
var express = require('express');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');

// 스키마 모듈 생성
var Schema = require('./database/user_schema');
// 유저 모듈 생성
var user = require('./router/user')

// express 객체 생성
var app = express();

// 서버 포트 설정
app.set('port',process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extend: false}));
app.use(bodyParser.json());

// static 미들웨어로 public 폴더 접근
// public 폴더를 static으로 오픈
app.use('/public',static(path.join(__dirname,'public')));

// 몽구스 모듈 생성 (db 모듈 생성)
var mongoose = require('mongoose');

// 디비 연결 함수
function connectDB() {

    // 디비 연결정보 url
    var databaseUrl = 'mongodb://localhost:27017/local';
    console.log('db 연결 시도');

//    mongoose.Promise = global.Promise;

    // 디비를 연결하고 디비 연결정보를 파라미터로 넘김
    console.log(databaseUrl);
    mongoose.connect(databaseUrl);
    // 넘겨받은 디비정보를 database 변수에 저장
    database = mongoose.connection;

    // 디비가 연결이벤트 실행
    database.on('open',function () {
        console.log('db 연결');

        // 유저스키마 생성 ( 구조 )
        var UserSchema = Schema.createSchema(mongoose);

        // 스키마로 만든 객체의 함수 생성

        // id를 넣어서 값을 찾은다음 콜백함수로 호출
        UserSchema.static('findById',function (id, callback) {
            return this.find({id: id},callback);
        });

        // 전체 데이터를 조회하는 함수
        UserSchema.static('findAll',function (callback) {
            return this.find({},callback);
        });

        console.log('schema 생성');

        // 데이터베이스의 컬렉션을 지정하는 모델 객체
        UserModel = mongoose.model('users2',UserSchema);
        console.log('usermodel2 객체 생성');

        user.init(database,UserModel);
    });
};

// 라우터 객체 생성
var router = express.Router();

// /process/login 경로에 로그인하는 라우터 미들웨어 생성
router.route('/process/login').post(user.login);

// /process/adduser 경로에 사용자를 추가하는 라우터 미들웨어 등록
router.route('/process/adduser').post(user.adduser);

// /process/listuser 경로에 사용자리스트 호출하는 라우터 미들웨어 등록
router.route('/process/listuser').post(user.listuser);

// 라우터 미들웨어 등록
app.use('/',router);

// 지정된 포트에서 서버생성 및 시작
http.createServer(app).listen(app.get('port'),function () {
    console.log('server start'+app.get('port'));
    // 몽고디비 연결 함수 호출
    connectDB();
});
