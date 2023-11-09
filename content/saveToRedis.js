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
    await client.set(commitSha, JSON.stringify(messages), 'EX', 3600);
    console.log("Redis saved,key:", commitSha)
}

async function getRedis(key) {
    // 如果使用最新版本的redis，就不需要isOpen检查
    const reply = await client.get(key);
    console.log("get Redis,key:", key)
    return reply ? JSON.parse(reply) : null;
}
async function delRedis(key) {
    // 如果使用最新版本的redis，就不需要isOpen检查
    await client.del(key);
    console.log("Redis del,key:", key)
}

connectToRedis().catch(err => console.error('Redis Client Error', err));
exports.saveToRedis = saveToRedis;
exports.getRedis = getRedis;
exports.delRedis = delRedis;
