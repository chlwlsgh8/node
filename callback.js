
// 함수를 파라미터로 받는 함수 생성
var f = function (id, password, callback) {

    // 데이터 전달 객체 생성
    var info = {
        info_id : id,
        info_password : password
    };

    // 함수 작성 후 callback함수 파라미터에 객체를 넣어서 호출
    callback(info);
};

// 함수를 호출하면서 콜백함수 작성
f('chlwlsgh8','123446', function(result){
    // 콜백함수에서 데이터 호출
    console.log(result.info_id);
    console.log(result.info_password);
});

