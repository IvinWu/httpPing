var http = require('http');
var list = require('./apiList.js');

http.globalAgent.maxSockets = 1000;
var count = 0;
var circle = null;

$(document).ready(function(){
	$("#startBtn").click(function(){
		startPin();
	});
	$("#stopBtn").click(function(){
		stopPin();
	})
});

function startPin() {
	var interval = $("#interval").val();
	if(interval < 10) {
		interval = 10;
	}

	circle = setInterval(function(){

		var listCount = list.length;
		var url = list[count % listCount].replace(/\{#r\}/g, getRandom(100000));
		log(url);

		http.get(url, function(res){
			log("Got response: " + res.statusCode);
		}).on('error', function(e) {
			log('problem with request: ' + e.message);
		});

		count ++;

		$("#time").text(Math.ceil(count / listCount));

	}, interval);
}

function stopPin() {
	clearInterval(circle);
}

function getRandom(max) {
	return Math.floor(Math.random() * max);
}

function log(text) {
	$("#log").prepend("<li>" + text + "</li>");
	if($("#log").find("li").length > 5) {
		$("#log li:gt(5)").remove();
	}
}