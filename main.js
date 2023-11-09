const express = require('express');
const { checkWebhookSecret } = require('./content/checkWebhookSecret.js');
const { postGitComment } = require('./content/postGitComment.js');
const { getGitCommitDiff } = require('./content/getGitCommitDiff.js');
const { requestGPT } = require('./content/requestGPT.js');
const { saveToRedis, getRedis } = require('./content/saveToRedis.js');
const { getReviews, insertReview } = require('./content/saveToSqlite.js');
const { WEBHOOK_SECRET } = require('./env.js');

const app = express();

app.use(express.json());


//webhook的主函数
app.post('/webhook', async (req, res) => {
    //Webhook Secret 校验不通过
    console.log('checkWebhookSecret....');
    if (!checkWebhookSecret(req, WEBHOOK_SECRET)) {
        return res.status(403).send('Invalid Webhook Secret');
    }

    const commits = req.body.commits;
    const repositoryFullName = req.body.repository.full_name;  // 获取仓库的完整名称
    // push包含多个commit，循环处理
    for (let commit of commits) {
        const commitSha = commit.id;
        // 获取commit的diff
        console.log('getGitCommitDiff....');
        const { diffString, files } = await getGitCommitDiff(repositoryFullName, commitSha);
        // 将diff发送给ChatGPT进行评审
        console.log('reviewing...');
        const review = await requestGPT(diffString, "你作为代码审查师，请指出这次代码提交中代码存在的问题,并给出正确的代码");
        // 将评审结果作为评论发送到GitHub的commit下面
        console.log('postGitComment....');
        await postGitComment(repositoryFullName, commitSha, review);
        // 同时将审核结论写入Redis
        console.log("info:", { commit, diffString, files, review })
        console.log('saveToRedis....');
        await saveToRedis(commitSha, { commit, diffString, files, review });
        //审核放入 sqlite
        console.log('insertReview....');
        insertReview(commitSha, commit, diffString, files, review)
    }
    res.sendStatus(200);
});

app.post('/query', async (req, res) => {
    const commitSha = req.body.commitSha;
    try {
        // 首先尝试从Redis获取数据
        const redisData = await getRedis(commitSha);
        console.log('getRedis....');
        if (redisData) {
            // 如果Redis有数据，直接返回结果
            return res.status(200).json(redisData);
        } else {
            // 如果Redis没有数据，查询SQLite
            getReviews(commitSha, (err, sqliteData) => {
                if (err) {
                    console.error('Error retrieving data from SQLite:', err);
                    return res.status(500).send('Internal Server Error');
                }
                if (sqliteData.length > 0) {
                    return res.status(200).json(sqliteData);
                } else {
                    return res.status(404).send('No review data found for this commit');
                }
            });
            console.log('getReviews by sqlite....');
        }
    } catch (err) {
        // 捕捉到异常，处理错误
        console.error('Error in /query route:', err);
        return res.status(500).send('Internal Server Error');
    }
});

const PORT = 3090;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
