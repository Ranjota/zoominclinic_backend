const redis = require('../config/redis');

const ACTIVE_SESSION_PREFIX = 'activeSessions';

const addActiveSession = async (patientId) => {
    try {
        const sessionKey = `${ACTIVE_SESSION_PREFIX}: ${patientId}`;
        await redis.set(sessionKey, patientId, 'EX', 3600);
        console.log(`Added active session for patientId: ${patientId}`);
    } catch (error) {
        console.error('Error adding active session to Redis:', error);
    }
}

const removeActiveSession = async (patientId) => {
    try {
        const sessionKey = `${ACTIVE_SESSION_PREFIX}: ${patientId}`;
        await redis.del(sessionKey);
        console.log(`Removed active session for patientId: ${patientId}`);
    } catch (error) {
        console.error('Error removing active session from Redis:', error);
    }
};


const getActiveSessions = async () => {
    try {
        const keys = await redis.keys(`${ACTIVE_SESSION_PREFIX}:*`);
        if(keys.length === 0) return [];

        const activeSessions = await redis.mget(keys);
        return activeSessions.filter(Boolean);
    } catch(error) {
        console.error('Error fetching active sessions from Redis:', error);
        return [];
    }
}

module.exports = {
    addActiveSession,
    removeActiveSession,
    getActiveSessions
}