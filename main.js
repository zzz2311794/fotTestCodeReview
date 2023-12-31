const express = require('express');
const { checkWebhookSecret } = require('./content/checkWebhookSecret.js');
const { postGitComment } = require('./content/postGitComment.js');
const { getGitCommitDiff } = require('./content/getGitCommitDiff.js');
const { requestGPT } = require('./content/requestGPT.js');
const { saveToRedis, getRedis, delRedis } = require('./content/saveToRedis.js');
const { getReviews, insertReview, getReviewsAll } = require('./content/saveToSqlite.js');
const { WEBHOOK_SECRET } = require('./env.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 允许所有域名访问
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

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
        const review = await requestGPT(diffString, "你作为代码审查师，请对该次 commit 进行审查, 找到这次commit中代码存在的问题明细，并给出修复后的代码。")
        // 将评审结果作为评论发送到GitHub的commit下面
        console.log('postGitComment....');
        await postGitComment(repositoryFullName, commitSha, review);
        // 同时将审核结论写入Redis
        console.log("info:", { commit, diffString, files, review })
        console.log('saveToRedis....');
        await saveToRedis(commitSha, { commit, diffString, files, review });
        console.log('delRedis....(list)');
        await delRedis("list");
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
        console.log('getRedis....');
        const redisData = await getRedis(commitSha);
        if (redisData) {
            // 如果Redis有数据，直接返回结果
            return res.status(200).json(redisData);
        } else {
            // 如果Redis没有数据，查询SQLite
            console.log('getReviews by sqlite....');
            getReviews(commitSha, async (err, sqliteData) => {
                if (err) {
                    console.error('Error retrieving data from SQLite:', err);
                    return res.status(500).send('Internal Server Error');
                }
                if (sqliteData.length > 0) {
                    console.log('after getReviews, saveToRedis....');
                    await saveToRedis(commitSha, sqliteData[sqliteData.length - 1]);
                    return res.status(200).json(sqliteData[sqliteData.length - 1]);
                } else {
                    return res.status(404).send('No review data found for this commit');
                }
            });
        }
    } catch (err) {
        // 捕捉到异常，处理错误
        console.error('Error in /query route:', err);
        return res.status(500).send('Internal Server Error');
    }
});


app.post('/queryAll', async (req, res) => {
    const redisKey = "list";
    try {
        // 首先尝试从Redis获取数据
        console.log('getRedis....');
        const redisData = await getRedis(redisKey);
        if (redisData) {
            // 如果Redis有数据，直接返回结果
            return res.status(200).json(redisData);
        } else {
            // 如果Redis没有数据，查询SQLite
            console.log('getReviewsAll by sqlite....');
            getReviewsAll("list", async (err, sqliteData) => {
                if (err) {
                    console.error('Error retrieving data from SQLite:', err);
                    return res.status(500).send('Internal Server Error');
                }
                if (sqliteData.length > 0) {
                    console.log('after getReviewsAll, saveToRedis....');
                    await saveToRedis(redisKey, sqliteData);
                    return res.status(200).json(sqliteData);
                } else {
                    return res.status(404).send('No review data found for this commit');
                }
            });
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
