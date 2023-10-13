const { GITHUB_TOKEN } = require('./.env');

async function postGitHubComment(repo, commitSha, comment) {
    await axios.post(`https://api.github.com/repos/${repo}/commits/${commitSha}/comments`, {
        body: comment
    }, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`
        }
    });
}

module.exports = postGitHubComment;
