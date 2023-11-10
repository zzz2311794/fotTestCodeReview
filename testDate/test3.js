//5. 最长回文子串
//给你一个字符串 s，找到 s 中最长的回文子串。
var longestPalindrome = function (s) {
    let n = s.length;
    let max = 1;
    let res = s[0];
    let dp = Array.from(new Array(n), () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        dp[i][i] = 1;
    }

    for (let i = n - 1; i >= 0; i--) {
        for (let j = i + 1; j < n; j++) {
            if (s[i] == s[j]) {
                if (j - i == 1 || dp[i + 1][j - 1] == 1) {
                    dp[i][j] = 1;
                    if (j - i + 1 > max) {
                        max = j - i;
                        res = s.substring(i, j + 1)
                    }
                }
            }
        }
    }
    console.log(dp)
    return res;
};