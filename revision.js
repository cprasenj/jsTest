var r = {};
exports.r = r;
r.compare = {};

r.fibonacci = function(limit){
    var fibonacci_series=[0,1];
    var fibo = function(a,b,limit){
        if(fibonacci_series.length-1>limit)return;
        fibonacci_series.push(a+b);
        fibo(b,a+b,limit);
    };
    fibo(0,1,limit);
    return  fibonacci_series[limit-1];
};
