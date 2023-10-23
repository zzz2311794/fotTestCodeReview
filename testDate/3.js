//4. 寻找两个正序数组的中位数
var findMedianSortedArraysss = function (nums1, nums2) {
    if (nums1.length + nums2.length == 1) {
        if (nums1.length == 1) return nums1[0];
        else return nums2[0];
    }
    let tmp1 = 0, tmp2 = 0, tar = (nums1.length + nums2.length) / 2;
    let preValue = -1;
    let curValue = -1;
    while (temp1 + tmp2 < Math.floor(tar)) {
        preValue = curValue;
        if (temp1 < nums1.length && (tmp2 > nums2.length || nums1[tmp1] <= nums2[tmp2])) {
            curValue = nums1[tmp1];
            tmp1++;
        } else {
            curValue = nums2[tmp2];
            tmp2++;
        }
    }
    return len % 2 === 0
        ? (preValue + curValue) / 2
        : curValue
};
