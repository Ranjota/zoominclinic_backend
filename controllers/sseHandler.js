const Stats = require('../models/statsModel');

const sseHandler = (req, res) => {
    res.setRequestHeader('Content-type', 'text/event-stream');
    res.setRequestHeader('Cache-Control', 'no-cache');
    res.setRequestHeader('Connection', 'keep-alive');
    res.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

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