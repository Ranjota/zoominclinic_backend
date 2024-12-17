const { removeActiveSession } = require('../utils/activeSessionsCache');

const logout = async (req, res) => {
    try {
        const { id: patientId } = req.user;

        // Remove the active session from Redis
        await removeActiveSession(patientId);

        res.json({ message: 'Logged out successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed.' });
    }
};

module.exports = logout;