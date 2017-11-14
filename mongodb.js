
// 기본 모듈 생성
var http = require('http');
var express = require('express');
var static = require('serve-static');
var path = require('path');
// var bodyParser = require('body-parser');

// express 모듈 생성
var app = express();

// 서버 포트 설정
app.set('port',process.env.PORT || 3000);

// app.use(bodyParser.urlencoded({ extend: false}));
// app.use(bodyParser.json());



//몽고디비 객체 생성
var mongodb = require('mongodb').MongoClient;

// db를 저장할 변수 선언
var database;

// 몽고db 연결 함수 생성
function connectdb1() {
    // 27017포트에서 실행되고있는 local 데이터베이스에 연결 (db 포트)
    var databaseUrl = 'mongodb://localhost:27017/local';

    // 몽고db 연결 메소드 실행
    mongodb.connect(databaseUrl,function (err, db) {
        if(err) throw err;

        console.log('db connect, databaseUrl'+databaseUrl);

        // 받은 db객체를 database 변수에 저장
        database = db;
    });

}

// 사용자입력과 db값을 비교하는 authuser 함수 생성
var authuser = function (database, id, password, callback) {

    console.log('authuser 함수 호출');

    // users 변수에 users 컬렉션안의 데이터값 저장
    var users = database.collection('users');

    // find 메소드를 사용하여 데이터를 조회
    // toArray 메소드를 사용하여 조회한 데이터를 배열 객체로 변환 (docs에 저장)
    // callback 함수에 docs 객체 전달
    users.find({"id":id, "password":password}).toArray(function(err, docs) {
        callback(null,docs);
    });

}

// 라우터 객체 생성
var router = express.Router();

// /process/login 경로에 post방식으로 라우터 미들웨어 생성
router.route('/process/login').post(function (req, res) {
    console.log('login 요청');

    // req객체로 사용자가 입력한 id password 값 불러와서 각 변수에 저장
    var paramId = req.param('id');
    var paramPassword = req.param('password');

    // database값이 있는경우 ( 몽고디비가 연결된 경우 )
    if(database){
        // 사용자 인증함수 실행
        authuser(database,paramId,paramPassword,function (err,docs) {
            if (docs) {
                // 조회한 데이터 docs객체 조회
                console.dir(docs);

                // 조회 결과에서 사용자 이름 확인
                // var username = docs[0].name;

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : '  + '</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            }
        });
    }

});

// 라우터 미들웨어 등록
app.use('/',router);

// static 미들웨어로 public 폴더 접근
// public 폴더를 static으로 오픈
app.use('/public',static(path.join(__dirname,'public')));

// 지정된 포트에서 서버생성 및 시작
http.createServer(app).listen(app.get('port'),function () {
    console.log('server start'+app.get('port'));
    // 몽고디비 연결 함수 호출
    connectdb1();
});

