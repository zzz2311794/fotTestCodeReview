const axios = require('axios');
const { GITHUB_TOKEN } = require('../env.js');

async function getGitCommitDiff(repoFullName, commitSha) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${repoFullName}/commits/${commitSha}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const files = response.data.files;
        let diffString = '';

        for (const file of files) {
            if (file.patch) {
                diffString += `File: ${file.filename}\n${file.patch}\n\n`;
            }
        }
        // 返回一个包含两个属性的对象
        return { diffString, files };

    } catch (error) {
        console.error('Error getting commit diff:', error);
        // 根据错误类型和您的应用逻辑，返回适当的值或抛出错误
        throw error; // 或者可以返回一个错误对象或特定的错误信息
    }
}

exports.getGitCommitDiff = getGitCommitDiff;
