const redis = require('redis');
const { promisify } = require('util');

// 创建Redis客户端
const client = redis.createClient({
    // 如果你的Redis服务器不是默认配置，需要在这里设置
});
// 将client.get方法转换为Promise，以便我们可以使用async/await
const getAsync = promisify(client.get).bind(client);


async function save(key, value) {
    return new Promise((resolve, reject) => {
        client.set(key, JSON.stringify(value), 'EX', 3600, (err, reply) => {
            if (err) reject(err);
            resolve(reply);
        });
    });
}

async function saveToRedis(commitSha, messages) {
    const { commit, commitDiff, review } = messages
    const redisValue = {
        commit: commit,
        commitDiff: commitDiff,
        review: review
    }
    await save(commitSha, redisValue);
}


async function getRedis(key) {
    try {
        const data = await getAsync(key);
        return JSON.parse(data); // 假设存储的是JSON字符串，需要解析成对象
    } catch (err) {
        console.error('Error retrieving data from Redis:', err);
        // 根据你的错误处理策略来处理错误
    }
}

exports.saveToRedis = saveToRedis;
exports.getRedis = getRedis;