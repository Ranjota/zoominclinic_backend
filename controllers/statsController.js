const statsUtils = require('../utils/waitTimeStatsUtils');


// const getStats = async (req, res) => {
//     try {
//         const stats = await Stats.findOne().sort({ updatedAt: -1}).lean();
//         // const test = stats.toObject();
//         res.json(stats);
//     } catch (error) {
//         console.error('Error fetching stats:', error);
//         res.status(500).send('Server Error');
//     }
// }

// const getLiveStats = (req, res) => {
//     res.setHeader('Content-type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.setHeader('X-Requested-With', 'XMLHttpRequest');

//     const interval = setInterval(async () => {
//         const stats = await Stats.getLiveStats();

//         if(stats) {
//             res.write(`
//             data: ${JSON.stringify({type: 'message', data: stats})}
//               \n\n  `);
//         }
//     }, 10000);

//     req.on('close', () => {
//         clearInterval(interval);
//         res.end();
//     });
// };
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

const getStatsSummary = async (req, res) => {
    try {
        const stats = await statsUtils.calculateStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching stats summary:', error);
        res.status(500).send('Server Error');
    }
}



module.exports = {
   getStatsSummary
};