const Redis = require('ioredis');
require('dotenv').config(); // Load environment variables

// Parse Redis host correctly by removing the 'https://' prefix
const redisHost = process.env.UPSTASH_REDIS_REST_URL.replace('https://', '');

const redis = new Redis({
    host: redisHost,               // Redis host (without 'https://')
    port: 6379,                    // Default Redis port
    password: process.env.UPSTASH_REDIS_REST_TOKEN, // Authentication token
    tls: { rejectUnauthorized: false }, // Required for Upstash Redis with TLS
});

(async () => {
    try {
        // Test the connection
        await redis.set('test-key', 'test-value', 'EX', 3600); // Cache for 1 hour
        const value = await redis.get('test-key');
        console.log('Cached Value:', value);
    } catch (error) {
        console.error('Redis Connection Error:', error);
    }
})();

module.exports = redis;
