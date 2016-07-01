var http = require('http');
var list = require('./apiList.js');

var circle = null;
http.globalAgent.maxSockets = 1000;

var count = 0;
var realCount = 0;
var lastRealCount = 0;

process.on('message', function(m){
    if(m.type == "start") {
        setTimeout(function(){
            ping(m.interval);
        }, Math.floor(Math.random() * 1000))

    } else if(m.type == "stop") {
        stopPin();
    }
});

process.on('SIGHUP', function(){
    process.exit();
});

function ping(interval) {
    circle = setInterval(function(){

        var listCount = list.length;
        var url = list[count % listCount].replace(/\{#r\}/g, getRandom(100000));

        http.get(url, function(res){
            //log("Got response: " + res.statusCode);
        }).on('error', function(e) {
            //log('problem with request: ' + e.message);
        });

        count ++;
        realCount = Math.ceil(count / listCount);

        if(realCount > lastRealCount) {
            lastRealCount = realCount;
            process.send(realCount);
        }

    }, interval);    
}

function stopPin() {
    clearInterval(circle);
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}