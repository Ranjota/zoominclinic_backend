const Redis = require('ioredis');

const redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
});

(async () => {
    await redis.set('key', 'value', 'EX', 3600); // Expires in 1 hour
    const value = await redis.get('key');
    console.log('Cached Value:', value);
})();

module.exports = redis;