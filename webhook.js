const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const verifyGitHubSignature = require('./secret')
const requestOpenAIApi = require('./gptApi')
const postGitHubComment = require('./githubApi')


const WEBHOOK_SECRET = 'heyu';

app.use(bodyParser.json());
app.post('/webhook', async (req, res) => {
    if (!verifyGitHubSignature(req, WEBHOOK_SECRET)) {
        return res.status(403).send('Invalid signature');
    }
    console.log('req', req)
    const pr = req.body.pull_request;
    console.log('pr:', pr)
    const code = pr.diff_url;  // 这是简化的，实际中你可能需要解析diff来获取真正的代码
    console.log('code:', code)
    const review = await requestOpenAIApi(code);
    await postGitHubComment(pr.base.repo.full_name, pr.number, review);
    res.sendStatus(200);
});

const PORT = 3090;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
