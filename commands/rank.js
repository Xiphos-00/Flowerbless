const League = require('./exports/league.js');
const color = {
	'iron': '#72767d',
	'bronze': '#cd7f32',
	'silver':'#c0c0c0',
	'gold': '#ffcc00',
	'platinum': '#1f87c3',
	'diamond': '#00ccff',
	'master': '#00cc99',
	'grandmaster': '#683443',
	'challenger': '#ff9900'
};

exports.rank = function(arg, user, room) {
	let region = arg[1] ?'na';
	League.getLeagueByName(arg[0], region, (err, league) => {
		if(err) return room.send(err);
		if(league == null || !Object.keys(league).length) return room.send('This user is unranked.');
		let div = toTitleCase(league.tier) + " " + league.rank;
		let embed = new Discord.RichEmbed()
			.setTitle(league.summonerName)
			.setColor(color[toId(league.tier)])
			.setURL("http://" + region + ".op.gg/summoner/userName=" + league.summonerName.replace(/\s/gi, "%20"))
			.setThumbnail("http://opgg-static.akamaized.net/images/medals/" + toId(league.tier) + "_" + fromRoman(league.rank) + ".png")
			.setFooter('Information from the Official League API.')
			.addField(div, league.leaguePoints + "LP / " + league.wins + "W " + league.losses + "L\nWin Ratio: " + ((league.wins/(league.wins+league.losses))*100).toFixed(2) + "%\n" + league.leagueName);
		return room.send({embed});
	})
}
