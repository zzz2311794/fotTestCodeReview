const axios = require('axios');
const { GITHUB_TOKEN } = require('../env.js');

async function postGitComment(repo, commitSha, comment) {
    try {
        await axios.post(`https://api.github.com/repos/${repo}/commits/${commitSha}/comments`, {
            body: comment
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });
    } catch (error) {
        console.error("Error while posting comment on GitHub:", error);
        // 可选择抛出错误，或者进行其他处理
        throw new Error("Failed to post comment on GitHub.");
    }
}

exports.postGitComment = postGitComment;
