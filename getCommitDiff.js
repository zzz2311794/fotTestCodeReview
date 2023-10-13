const axios = require('axios');
const { GITHUB_TOKEN } = require('./.env');

async function getCommitDiff(repoFullName, commitSha) {
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

    return diffString;
}
