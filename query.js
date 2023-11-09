const axios = require('axios');

const testQueryRoute = async () => {
    const commitSha = '1ff10059c9fb700bd87f8e7651890550005094c7';  // 请替换为实际的 commit SHA
    const queryUrl = 'http://18.179.22.174:3090/query'; // 确保端口号与您的应用相匹配

    try {
        const response = await axios.post(queryUrl, { commitSha });
        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        // 如果响应状态码不是 2xx，Axios 将抛出异常
        if (error.response) {
            // 服务器回应了请求，但状态码不在2xx范围内
            console.log('Error Status:', error.response.status);
            console.log('Error Data:', error.response.data);
        } else if (error.request) {
            // 请求已经发出去，但没有收到回应
            console.log('No response received:', error.request);
        } else {
            // 在设置请求时发生了一些事情，触发了一个错误
            console.log('Error', error.message);
        }
    }
};

testQueryRoute();
