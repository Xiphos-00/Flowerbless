const leagueKey = '?api_key=' + Config.leagueKey;
const request = require('request');

const requestError = new Error('There is something wrong with your request. Check your spelling or try again later.');
const serverError = new Error('There was a server error in processing your request. Try again later.');

exports.getSummonerObj = function (name, region, callback) {
	request('https://' + exports.getPlatform(region) + '/lol/summoner/v4/summoners/by-name/' + toId(name) + leagueKey, (error, response, body) => {
		let myError = error ? 'Error: ' + error : null;
		if(String(response.statusCode).charAt(0) == 4) myError = requestError;
		if(String(response.statusCode).charAt(0) == 5) myError = serverError;
		if(!error && response.statusCode == 200) return callback(myError, JSON.parse(body));
	});
}

exports.getSummonerId = function(name, region, callback) {
	exports.getSummonerObj(name, region, (err, body) => {
		return callback(err, body.id);
	})
}

exports.getLeagueObj = function(id, region, callback) {
	request('https://' + exports.getPlatform(region) + '/lol/league/v4/positions/by-summoner/' + id + leagueKey, (error, response, body) => {
		let myError = error ? 'Error: ' + error : null;
		if(String(response.statusCode).charAt(0) == 4) myError = requestError;
		if(String(response.statusCode).charAt(0) == 5) myError = serverError;
		if(!error && response.statusCode == 200) return callback(myError, JSON.parse(body));
	});
}

exports.getLeagueByName = function(name, region, callback) {
	exports.getSummonerId(name, region, (err, id) => {
		if(err) return callback(err, id);
		exports.getLeagueObj(id, region, (err, body) => {return callback(err, body[0])});
	});
}

exports.getPlatform = function(region) {
    var platforms = {
        'na': 'NA1',
        'euw': 'EUW1',
        'eune': 'EUN1',
        'lan': 'LA1',
        'las': 'LA2',
        'oce': 'OC1',
        'tr': 'TR1',
        'ru': 'RU',
        'br': 'BR1',
        'jp': 'JP1',
        'kr': 'KR',
        'pbe': 'PBE1',
    }
    return platforms[region] + '.api.riotgames.com';
};