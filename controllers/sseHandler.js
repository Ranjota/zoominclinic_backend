const Stats = require('../models/statsModel');

const sseHandler = (req, res) => {
    res.setHeader('Content-type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Requested-With', 'XMLHttpRequest');

    const interval = setInterval(async () => {
        const stats = await Stats.getLiveStats();

        if(stats) {
            res.write(`
            data: ${JSON.stringify({type: 'message', data: stats})}
              \n\n  `);
        }
    }, 10000);

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
};

module.exports = sseHandler;