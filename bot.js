//setup help: https://www.howtogeek.com/364225/how-to-make-your-own-discord-bot/

const Discord = require('discord.js');
const fs = require('fs');
var auth = require('./auth.json');
var style = require('./style.json');

const client = new Discord.Client();

var players = [];
var speaking = [];
var botjoined = false;

client.login(auth.token);

client.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.channel;
  let oldUserChannel = oldMember.channel;
  
  if(oldUserChannel === null && newUserChannel !== null && newUserChannel.toString() === style.channel) {
	  if (!botjoined) {botjoin(newUserChannel)};
	  // User Joins a voice channel
	  if (oldMember.member.displayName !== style.botname) {
		  players.push(oldMember.member.displayName);
		  speaking.push(oldMember.speaking !== null);
		  writeOut();
	  }
  } else if(newUserChannel === null && oldUserChannel.toString() === style.channel){
	  if (!botjoined) {botjoin(oldUserChannel)};
	  // User leaves a voice channel
	  var index = players.indexOf(oldMember.member.displayName);
	  players.splice(index, 1);
	  speaking.splice(index, 1);
	  writeOut();
  }
})

client.on('guildMemberSpeaking', (member, speaking) => {
	var index = players.indexOf(member.displayName);
	speaking[index] = (speaking !== null);
	debug("speaking triggered: " + speaking);
	writeOut();
});

function botjoin(channel) {
	botjoined = true;
	channel.join();
};


function writeOut() {
	try {
		var text = "";
		for (var i = 0; i < players.length; i++) {
			text += "<font face='"+style.font+"' p2 style='color: #"+(speaking[i] ? style.coloron : style.coloroff)+";'>"+players[i]+"</p2><br>";
		}	
		const data = fs.writeFileSync('\discord.html', text)
	} catch (err) {
		console.error(err)
	}
}

function debug(text) {
	try {
		fs.writeFileSync('\debug.txt', text)
	} catch (err) {
		console.error(err)
	}
}