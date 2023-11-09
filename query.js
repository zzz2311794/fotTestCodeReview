const axios = require('axios');

const testQueryRoute = async () => {
    const commitSha = '1ff10059c9fb700bd87f8e7651890550005094c7';  // 请替换为实际的 commit SHA
    const queryUrl = 'http://18.179.22.174:3090/query'; // 确保端口号与您的应用相匹配
    const response = await axios.post(queryUrl, { commitSha });
    console.log('Status Code:', response.status);
    console.log('Response Data:', response.data);
};



const testQueryRouteAll = async () => {
    const queryUrl = 'http://18.179.22.174:3090/queryAll'; // 确保端口号与您的应用相匹配
    const response = await axios.post(queryUrl);
    console.log('Status Code:', response.status);
    console.log('Response Data:', response.data);
};

//testQueryRoute();
testQueryRouteAll();