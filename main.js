global.Discord = require("discord.js");
global.Config = require("./config.js");
const fs = require("fs");
const path = require("path");

global.client = new Discord.Client();
const token = Config.discKey;

global.info = function (text) {
	console.log('info'.cyan + '  ' + text);
};

global.debug = function (text) {
	console.log('debug'.blue + ' ' + text);
};

global.error = function (text) {
	console.log('error'.red + ' ' + text);
};

global.ok = function (text) {
	console.log('ok'.green + '    ' + text);
};


/* Support Functions */

global.toId = function(text) {
	return text.toLowerCase().replace(/[^a-z0-9]/g, '');
};

global.toTitleCase = function (str) {
	var strArr = str.split(' ');
	var newArr = [];
	for (var i = 0; i < strArr.length; i++) {
		newArr.push(strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1));
	}
	str = newArr.join(' ');
	return str;
};

global.fromRoman = function (n) {
    var numbers = {
        'I': 1,
        'II': 2,
        'III': 3, 
        'IV': 4,
        'V': 5,
    }
    return numbers[n];
};

/* Dependency Installer */

function runNpm(command) {
	console.log('Running `npm ' + command + '`...');

	let child_process = require('child_process');
	let npm = child_process.spawn('npm', [command]);

	npm.stdout.on('data', function (data) {
		process.stdout.write(data);
	});

	npm.stderr.on('data', function (data) {
		process.stderr.write(data);
	});

	npm.on('close', function (code) {
		if (!code) {
			child_process.fork('main.js').disconnect();
		}
	});
}

/* Core dependency checks */
try {
	require('sugar');
	require('discord.js');
	global.colors = require('colors');
} catch (e) {
	console.log('Dependencies are not installed!');
	return runNpm('install');
}

/* Command Parser */
client.on("message", msg => {
    message = msg.content;
    let cmdchar = '!';
	if (message.substr(0, cmdchar.length) !== cmdchar) return false;
	
	message = message.substr(cmdchar.length);

	let frags = message.split(' ');
	if (!frags.length) return;

	let cmd = frags.splice(0, 1)[0];
	let arg = frags.join(' ').trim().replace(/,\s/gi, ",").split(',');

	debug('command received: ' + cmd);
    
	fs.readdir(path.normalize('./commands'), (err, files) => {
		if(err) return error('Unable to access Command directory.');
		files.forEach(element => {
			let filePath = './commands/' + element;
			if(element.replace(/[\.js]/gi, '') == cmd) require(filePath)[cmd].call(client, arg, msg.author, msg.channel);
		});
	});
});

/* Connection */
function connect(retry) {
	if(retry) {
		if(connect.failsafe++ < 10) info('retrying...');
		else {
			error('terminating...')
			process.exit();
		}
	} else connect.failsafe = 0;

	client.login(token).then(ok('Successfully logged in.'), function() {
		error('Failed to connect.');
		connect(true);
	});
}
connect();