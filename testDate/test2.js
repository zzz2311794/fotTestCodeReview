//7. 整数反转
//给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。
var reverse = function (x) {
    let res = 0;
    while (x) {
        let temp = x % 10;
        x = parseInt(x / 10);
        res = res * 10 + temp;
    }
    return res > 2147483647 || res < -2147483648 ? 0 : res;
};