
// 모듈 추가 방법 1(module.export에 함수 추가하기)
// exports.plus = function (a,b) {
//     return a+b;
// };

// 모듈 추가 방법 2 ( 객체를 만든후 함수를 추가하고 export 하기)
// 모듈 객체 생성
var cal = {};

// 모듈 함수 생성
cal.minus = function (a,b) {
    return a-b;
};

// 모듈 객체 2번째
// var cal2 = {};
//
// cal2.plus = function (a, b) {
//     return a+b;
// }

// 모듈 exports
module.exports = cal;
// 마지막 export에 module이 덮어 씌워짐
//module.exports = cal2;

