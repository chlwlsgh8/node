
//  http 모듈 호출 (내장 모듈 호출)
var http = require('http');

// http 모듈로부터 서버 생성
var server = http.createServer();

// server 객체의 listen 메소드호출
// 포트 생성
var port = 300;

// 지정된 포트에서 서버 시작, 서버가 시작되면 두번째 파라미터 콜백함수가 실행됨
server.listen(port,function () {
    console.log('port: '+port);
    console.log('웹서버 시작');
});

// server의 on 메소드를 사용하여 이벤트 처리 클라이언트 연결, 요청, 종료

// 클라이언트 연결 connection 이벤트
server.on('connection',function (socket) {
    var addr = socket.address();
    console.log('웹서버 접속');
    console.log('socket: '+socket);
    console.log('addr: '+addr);
    console.log('addr.address: '+addr.address);
    console.log('addr.port: '+addr.port);
    console.dir(socket);
});

// 클라이언트 요청 request 이벤트
// req 와 res 객체를 이용하여 데이터를 주고받음
server.on('request',function (req, res) {
    console.log('클라이언트 요청');
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.write("<html>");
    res.write('으헤헿');
    res.write("</html>");
    res.end();
});

// 서버 종료 이벤트 close 이벤트
server.on('close',function () {
    console.log('서버 종료');
});

