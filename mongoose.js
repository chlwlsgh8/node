
// 기본 모듈 생성
var http = require('http');
var express = require('express');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');

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

// 데이터베이스 스키마 모델 변수
var database;
var UserSchema;
var UserModel;

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
        UserSchema = mongoose.Schema({
            id : String,
            name : String,
            password : String
        });
        console.log('schema 생성');

        // 데이터베이스의 컬렉션을 지정하는 모델 객체
        UserModel = mongoose.model('users',UserSchema);
        console.log('usermodel 객체 생성');

    });

};

// 라우터 객체 생성
var router = express.Router();

// /process/login 경로에 로그인하는 라우터 미들웨어 생성
router.route('/process/login').post(function (req, res) {
    console.log('login 요청');

    // req객체로 사용자가 입력한 id password 값 불러와서 각 변수에 저장
    var paramId = req.body.id;
    var paramPassword = req.body.password;

    // database값이 있는경우 ( 몽구스디비가 연결된 경우 )
    if(database){
        // 사용자 인증함수 실행
        authuser(paramId,paramPassword,function (err,docs) {
            if (docs) {
                // 조회한 데이터 docs객체 조회
                console.dir(docs);

                // 조회 결과에서 사용자 이름 확인
                var username = docs[0].name;

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : '+ username  + '</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            }
        });
    }

});

// /process/adduser 경로에 사용자를 추가하는 라우터 미들웨어 등록
router.route('/process/adduser').post(function (req, res) {
    console.log('사용자 추가 요청');

    // post 방식으로 사용자 id와 password,name 받아오기
    var paramId = req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;

    if(database){
        adduser(paramId,paramPassword,paramName,function (err, result) {
            console.dir(result);
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>사용자 추가 성공</h2>');
            res.end();
        });
    }

})

// 라우터 미들웨어 등록
app.use('/',router);

// 사용자입력과 db값을 비교하는 authuser 함수 생성
var authuser = function ( id, password, callback) {

    console.log('authuser 함수 호출');

    // 사용자가 입력한값과 db의 모델객체의 값 비교하는 메소드
    UserModel.find({'id':id,'password':password},function (err, result) {
        if(err){
            callback(err,null)
            return;
        }
        console.log('결과 id:'+id+', password:'+password);
        console.log(result);
        callback(null,result);
    })

};

// 사용자 추가함수 생성
var adduser = function ( id, password, name, callback) {
    console.log('adduser 호출');

    // 유저모델 객체 생성
    var user = new UserModel({'id':id,'password':password,'name':name});

    // 만들어진 유저모델 객체 저장
    user.save(function (err) {
        if(err){
            callback(err,null);
            return;
        }
        callback(null,user);
    });
};

// 지정된 포트에서 서버생성 및 시작
http.createServer(app).listen(app.get('port'),function () {
    console.log('server start'+app.get('port'));
    // 몽고디비 연결 함수 호출
    connectDB();
});

