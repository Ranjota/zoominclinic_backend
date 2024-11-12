const Stats = require('../models/statsModel');

const sseHandler = (req, res) => {
    res.setHeader('Content-type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const interval = setInterval(async () => {
        const stats = await Stats.getLiveStats();

        if(stats) {
            res.write(`
            data: ${JSON.stringify({type: 'live-stats', data: stats})}
              \n\n  `);
        }
    }, 10000);

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
};

module.exports = sseHandler;