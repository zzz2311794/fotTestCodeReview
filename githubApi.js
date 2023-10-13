const GITHUB_TOKEN = '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';  // 请确保这个是安全的

async function postGitHubComment(repo, prNumber, comment) {
    await axios.post(`https://api.github.com/repos/${repo}/issues/${prNumber}/comments`, {
        body: comment
    }, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`
        }
    });
}

module.exports = postGitHubComment