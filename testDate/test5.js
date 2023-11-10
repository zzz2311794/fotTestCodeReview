// 14. 最长公共前缀
//     编写一个函数来查找字符串数组中的最长公共前缀。
// 如果不存在公共前缀，返回空字符串 ""。
var longestCommonPrefix = function (strs) {
    let res = "";
    for (let j = 0; j < strs[0].length; j++) {
        for (let i = 1; i < strs.length; i++) {
            if (strs[0][j] != strs[i][j]) return res;
        }
        res += strs[0][j];
    }
    return res;
};