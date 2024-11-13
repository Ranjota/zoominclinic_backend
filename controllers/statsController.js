const Stats = require('../models/statsModel');

const getStats = async (req, res) => {
    try {
        const stats = await Stats.findOne().sort({ updatedAt: -1}).lean();
        // const test = stats.toObject();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).send('Server Error');
    }
}

// const getLiveStats = async (req, res) => {
//     try {
//         const stats = await Stats.getLiveStats();
//         if(stats) {
//             res.json({success: true, data: stats});
//         } else {
//             res.status(404).json({success: false, message: 'No stats found'});
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error fetching stats' });
//     }
// }

module.exports = {
    getStats,
    // getLiveStats
};