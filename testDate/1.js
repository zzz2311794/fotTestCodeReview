var lengthOfLongestSubstring = function (s) {
    if (s.length == 0) return 0;
    let longest = 1, left = 0, right = 1;
    let arr = [s[0]];
    while (right < s.length) {
        let index = arr.indexOf(s[right]);
        if (index < 0) {
            arr.push(s[right]);
            right++;
            console.log(arr)
        } else {
            left = index + 1;
            arr = arr.slice(left, right);
        }
        if (arr.length > longest) { longest = arr.length };
    }
    return longest;
};