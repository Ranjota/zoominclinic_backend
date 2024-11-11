const Stats = require('../models/statsModel');

const getStats = async (req, res) => {
    try {
        const stats = await Stats.findOne().lean();
        // const test = stats.toObject();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getStats
};