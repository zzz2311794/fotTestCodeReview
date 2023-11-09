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
        diffString: messages.diffString,
        files: messages.files,
        review: messages.review
    };
    await client.set(commitSha, JSON.stringify(redisValue), 'EX', 3600);
    console.log("Redis saved,key:", commitSha)
}

async function saveToRedisAll(key, value) {
    await client.set(key, JSON.stringify(value), 'EX', 3600);
    console.log("Redis saved,key:", key)
}

async function getRedis(key) {
    // 如果使用最新版本的redis，就不需要isOpen检查
    const reply = await client.get(key);
    console.log("Redis got,commitSha:", key)
    return reply ? JSON.parse(reply) : null;
}

connectToRedis().catch(err => console.error('Redis Client Error', err));
exports.saveToRedis = saveToRedis;
exports.getRedis = getRedis;
exports.saveToRedisAll = saveToRedisAll;
