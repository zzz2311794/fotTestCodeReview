//3. 无重复字符的最长子串
//利用hash
var lengthOfLongestSubstring = function (s) {
    if (s.length == 0) return 0;
    let longest = 0, left = 0, right = 0;
    const set = new Set()
    while (right < s.length) {
        if (!set.has(s[right])) {
            set.add(s[right]);
            longest = Math.max(longest, set.size);
            right++;
        } else {
            while (set.has(s[right])) {
                set.delete(s[left]);
                left++;
            }
        }
    }
    return longest;
};