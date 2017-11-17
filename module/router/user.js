
var database;
var UserModel;

// db의 객체, 스키마 객체 ?, 모델객체를 받는 함수
var init = function (db,model) {

    database = db;
    UserModel = model;

};

// 사용자입력과 db값을 비교하는 authuser 함수 생성
var authuser = function ( id, password, callback) {

    console.log('authuser 함수 호출');

    // 사용자가 입력한값과 db의 모델객체의 값 비교하는 메소드
    UserModel.findById(id,function (err, result) {
        if(err){
            callback(err,null);
            return;
        }
        if(result[0]._doc.password == password){
            console.log('결과 id:'+id+', password:'+password);
            console.log(result);
            callback(null,result);
        }
    })
};

// 사용자 추가함수 생성
var adduser_f = function ( id, password, name, callback) {
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

// 로그인 모듈
var login = function (req, res) {
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
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            };
        });
    };
};

// 사용자 추가 함수 모듈
var adduser = function (req, res) {
    console.log('사용자 추가 요청');

    // post 방식으로 사용자 id와 password,name 받아오기
    var paramId = req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;

    if(database){
        adduser_f(paramId,paramPassword,paramName,function (err, result) {
            console.dir(result);
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>사용자 추가 성공</h2>');
            res.end();
        });
    };
};

// 사용자 리스트 호출 함수 모듈
var listuser = function (req, res) {
    console.log('사용자리스트 호출');

    if(database){
        // 유저모델의 전체리스트를 조회하는 findAll 메소드 호출
        UserModel.findAll(function (err, result) {
            if(result){
                console.dir(result);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트</h2>');
                res.write('<div><ul>');

                // findAll 메소드로 찾은 리스트값 result 배열 출력
                for(var i=0;i<result.length;i++){
                    var curId = result[i]._doc.id;
                    var curName = result[i]._doc.name;
                    res.write('    <li>#' + i + ' : ' + curId + ', ' + curName + '</li>');
                };
            };
        });
    };
};

module.exports.init = init;
module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
