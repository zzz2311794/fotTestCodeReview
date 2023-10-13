const express = require('express');
const bodyParser = require('body-parser');
const { verifyGitHubSignature } = require('./secret');
const { postGitHubComment } = require('./githubApi');
const { requestOpenAIApi } = require('./gptApi');
const { getCommitDiff } = require('./getCommitDiff.js');  // 确保你在合适的文件里定义了这个函数
const { WEBHOOK_SECRET } = require('./env.js');

const app = express();

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    if (!verifyGitHubSignature(req, WEBHOOK_SECRET)) {
        return res.status(403).send('Invalid signature');
    }
    console.log("body", JSON.stringify(req.body, null, 2));
    const commits = req.body.commits;
    const repositoryFullName = req.body.repository.full_name;  // 获取仓库的完整名称
    // 以防一个push包含多个commit，这里我们只处理第一个commit
    const commitSha = commits[0].id;
    console.log("commitSha:", commitSha)
    // 获取commit的diff
    const diff = await getCommitDiff(repositoryFullName, commitSha);
    console.log("diff:", diff)
    // 将diff发送给ChatGPT进行评审
    const review = await requestOpenAIApi(diff);
    console.log("review:", review)
    // 将评审结果作为评论发送到GitHub的commit下面
    await postGitHubComment(repositoryFullName, commitSha, review);
    res.sendStatus(200);
});

const PORT = 3090;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
