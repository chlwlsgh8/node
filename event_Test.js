
// event 모듈 생성
var c = require('./event.js');

// event 모듈의 call함수 생성
var call = new c();

// emit메소드로 call함수의 stop이벤트 호출
call.emit('stop');

console.log('이벤트 종료');
