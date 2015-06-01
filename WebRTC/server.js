var express = require('express'),
    app = express(),
    server = require('http').createServer(app);
server.listen(3000);

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({server: server});


var wsList = [],
    index = 0;


wss.on('connection', function (ws) {
    var wsIndex = index,
        desc = 'ws' + wsIndex;

    wsList[index++] = ws;

    ws.on('message', function (message) {
        var data = JSON.parse(message);
        console.log('received (' + desc + '): ', data);

        wsList[wsIndex].send(message, function (error) {
            if (error) {
                console.log('Send message error (' + desc + '): ', error);
            }
        });
    });
});