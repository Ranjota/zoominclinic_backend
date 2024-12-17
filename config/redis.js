const Redis = require('ioredis');

// Use Upstash Redis REST endpoint
const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL, {
    username: 'default', // Upstash requires 'default' as the username
    password: process.env.UPSTASH_REDIS_REST_TOKEN, // The token for authentication
    tls: {}, // Enable TLS for secure connection
});

(async () => {
    try {
        // Set a key with expiry
        await redis.set('key', 'value', 'EX', 3600); // Expires in 1 hour
        console.log('Key set successfully!');

        // Get the key
        const value = await redis.get('key');
        console.log('Cached Value:', value);
    } catch (error) {
        console.error('Redis Connection Error:', error);
    }
})();

module.exports = redis;
