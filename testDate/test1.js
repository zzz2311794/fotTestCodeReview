// // 15. 三数之和
// 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。
var threeSum = function (nums) {
    let res = [];
    nums.sort((a, b) => a - b);
    // console.log(nums);
    for (let i = 0; i < nums.length - 2; i++) {
        if (nums[i] == nums[i - 1]) {
            continue;
        }
        for (let left = i + 1, right = nums.length - 1; left < right;) {
            if (nums[right] < 0) {
                break;
            }
            while (left < right && nums[left - 1] == nums[left]) {
                left++;
            }
            while (left < right && nums[right + 1] == nums[right]) {
                right--
            }
            // console.log(nums[i], nums[left], nums[right]);
            if (left < right && nums[i] + nums[left] + nums[right] > 0) {
                right--;
                continue;
            } else if (left < right && nums[i] + nums[left] + nums[right] < 0) {
                left++;
                continue;
            } else if (left < right && nums[i] + nums[left] + nums[right] == 0) {
                // console.log("ok", nums[i], nums[left], nums[right])
                res.push([nums[i], nums[left], nums[right]]);
                left++;
            }
        }
    }
    return res;
};
