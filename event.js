
// util 모듈 생성
var util = require('util');

// events 모듈의 eventemitter 객체 생성
var Event = require('events').EventEmitter;

// stop 이벤트를 실행하는 함수 생성
var call = function () {
    // eventemitter객체에서 상속받은 on메소드
    this.on('stop',function () {
        console.log('stop 이벤트 전달');
    })
};

// util.inherits 메소드로 eventemitter 객체를 cal 함수에 상속
util.inherits(call,Event);

// cal 함수 export
module.exports = cal;

