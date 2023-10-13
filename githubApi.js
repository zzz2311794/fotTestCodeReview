const { GITHUB_TOKEN } = require('./env.js');

async function postGitHubComment(repo, commitSha, comment) {
    await axios.post(`https://api.github.com/repos/${repo}/commits/${commitSha}/comments`, {
        body: comment
    }, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`
        }
    });
}

exports.postGitHubComment = postGitHubComment;
