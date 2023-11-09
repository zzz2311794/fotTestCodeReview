const redis = require('redis');
const client = redis.createClient({ socket: { port: 6379 } });

// 连接到Redis
async function connectToRedis() {
    if (!client.isOpen) {
        await client.connect();
        console.log("Redis connected")
    }
}

async function saveToRedis(commitSha, messages) {
    const redisValue = {
        commit: messages.commit,
        commitDiff: messages.commitDiff,
        diffFiles: messages.diffFiles,
        review: messages.review
    };
    await client.set(commitSha, JSON.stringify(redisValue), 'EX', 3600);
    console.log("Redis saved,commitSha:", commitSha)
}
async function getRedis(commitSha) {
    // 如果使用最新版本的redis，就不需要isOpen检查
    const reply = await client.get(commitSha);
    console.log("Redis got,commitSha:", commitSha)
    return reply ? JSON.parse(reply) : null;
}

connectToRedis().catch(err => console.error('Redis Client Error', err));
exports.saveToRedis = saveToRedis;
exports.getRedis = getRedis;
