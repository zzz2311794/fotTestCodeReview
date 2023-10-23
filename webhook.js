const express = require('express');
const bodyParser = require('body-parser');
const { checkWebhookSecret } = require('./content/checkWebhookSecret');
const { postGitComment } = require('./content/postGitComment');
const { getGitCommitDiff } = require('./content/getGitCommitDiff.js');
const { requestGPT } = require('./content/requestGPT');
const { WEBHOOK_SECRET } = require('./env.js');

const app = express();

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {

    //Webhook Secret 校验不通过
    if (!checkWebhookSecret(req, WEBHOOK_SECRET)) {
        return res.status(403).send('Invalid Webhook Secret');
    }
    console.log("body", JSON.stringify(req.body, null, 2));

    const commits = req.body.commits;
    const repositoryFullName = req.body.repository.full_name;  // 获取仓库的完整名称

    // push包含多个commit，循环处理
    for (let commit of commits) {
        const commitSha = commit.id;
        // 获取commit的diff
        const gitCommitDiff = await getGitCommitDiff(repositoryFullName, commitSha);
        // 将diff发送给ChatGPT进行评审
        const review = await requestGPT(gitCommitDiff, "请审核被提交代码，如果存在问题请改写这些代码：");

        // 将评审结果作为评论发送到GitHub的commit下面
        await postGitComment(repositoryFullName, commitSha, review);
    }
    res.sendStatus(200);
});

const PORT = 3090;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
