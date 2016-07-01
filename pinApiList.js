var fork = require('child_process').fork;

var processList = [];
var count = 0;

$(document).ready(function(){
	$("#startBtn").click(function(){
		stopPin();
		startPin();
	});
	$("#stopBtn").click(function(){
		stopPin();
	})
});

function startPin() {
	
	var interval = parseInt($("#interval").val());
	if(interval < 50) {
		interval = 50;
		$("#interval").val(50)
	}
	
	var process = parseInt($('#process').val());
	if(process > 10) {
		process = 10;
		$("#process").val(10)
	}

	for(var i = 0; i < process; i ++) {
		var worker = fork('./ping.js');
		
		worker.on('message', function(m){
			count ++;
			$("#time").text(count);
		});
		
		worker.send({'type':'start','interval': interval});
		
		processList.push(worker);
	}
}

function stopPin() {
	for(var i = 0; i < processList.length; i ++) {
		processList[i].send({'type':'stop'});
		processList[i].kill();
	}
	processList = [];
}



function log(text) {
	$("#log").prepend("<li>" + text + "</li>");
	if($("#log").find("li").length > 5) {
		$("#log li:gt(5)").remove();
	}
}