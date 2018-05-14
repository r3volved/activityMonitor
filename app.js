//Build client
const Discord 	= require('discord.js');
const client 	= new Discord.Client();
const token 	= require('./settings.json').token;
const fs 		= require('fs');

let log = null;

async function saveLog() {
	//console.log( 'Current log:', JSON.stringify(log,"","  ") );
	if( log ) {
		fs.writeFileSync('./log.json',JSON.stringify(log,"","  "),'utf8');	
	}
	setInterval(saveLog, 1000*60*30);	
}

/**
 * MONITOR CLIENT
 */
//ON READY
client.on('ready', async () => {
    
	console.info(`Started successfully`);
	
	log = await fs.existsSync('./log.json') ? require('./log.json') : null;		
	
	if( !log ) {
		log = Object.assign({},{});
		log.servers = client.guilds.size;
		log.members = {};		
		saveLog();	    
	};
	
}); 

//ON CLIENT JOIN GUILD
client.on('guildCreate', guild => {
  
});

//ON CLIENT LEAVES GUILD
client.on('guildDelete', guild => {
	
});

//ON DISCONNECT
client.on('disconnect', async (event) => {

	console.error(`\n ! Client disconnected: [${event.code}] ${event.reason}`);
	//Try login again
	if( event.code !== 4004 ) {
		try {
			await doLogin();
		} catch(e) {
			console.error(' ! Error trying to re-login\n',e);
		}
	}
		
});

//ON RECONNECTING
client.on('reconnecting', async (e) => {
    
	console.warn('\n ! Client reconnecting -'+new Date());	
	if(e) console.error(e.message);
	
});

//ON RESUME
client.on('resumed', async (replayed) => {
    
	console.info('\n ! Client resumed -'+new Date());
    if(replayed) console.log(replayed);
	
});

//ON ERROR
client.on('error', async (error) => {
    
	console.error('\n ! Client connection error -'+new Date());
    if(error) console.error(error.message);
	
});

//ON WARNING
client.on('warn', async (info) => {
	
	console.warn('\n ! Client warning -'+new Date());
	if(info) console.warn(info);
    
});



/**
 * MONITOR GUILD MEMBERS
 */
//ON MEMBER JOIN GUILD
client.on('guildMemberAdd', async (member) => {
  
	//Ignore bots
	if( member.user.bot ) { return; }

	let tag = member.user.username;
	if( !log.members[tag] ) { log.members[tag] = {}; }
	log.members[tag] = new Date().toString();
 	
});

//ON MEMBER LEAVING GUILD
client.on('guildMemberRemove', async (member) => {
  
	//Ignore bots
	if( member.user.bot ) { return; }

	let tag = member.user.username;
	if( !log.members[tag] ) { log.members[tag] = {}; }
	log.members[tag] = new Date().toString();
 	
});

//ON MEMBER UPDATE
client.on('guildMemberUpdate', async (member) => {
  
	//Ignore bots
	if( member.user.bot ) { return; }

	let tag = member.user.username;
	if( !log.members[tag] ) { log.members[tag] = {}; }
	log.members[tag] = new Date().toString();
 	
});

//ON MEMBER PRESENCE UPDATE
client.on('presenceUpdate', async (member) => {
  
	//Ignore bots
	if( member.user.bot ) { return; }

	let tag = member.user.username;
	if( !log.members[tag] ) { log.members[tag] = {}; }
	log.members[tag] = new Date().toString();
 	
});

//ON MEMBER DETAILS UPDATE
client.on('userUpdate', async (member) => {

	//Ignore bots
	if( member.user.bot ) { return; }

	let tag = member.user.username;
	if( !log.members[tag] ) { log.members[tag] = {}; }
	log.members[tag] = new Date().toString();
 	
});



/**
 * MONITOR MESSAGES
 */
//ON MESSAGE RECEIVED
client.on('message', message => {
  
	//Ignore bots
	if( message.author.bot ) { return; }
	
	let tag = message.author.username;
	if( !log.members[tag] ) { log.members[tag] = {}; }
	log.members[tag] = new Date().toString();
	
	if( message.content.startsWith('!!') ) {
		
		const ordered = {};
		Object.keys(log.members).sort().forEach(function(key) {
		  ordered[key] = log.members[key];
		});
		
		log.members = Object.assign({},ordered);
		saveLog();
		
		let arg = message.content.replace('!!','').trim();
		
		let unit = arg.charAt(arg.length-1);
		let time = isNaN(arg) ? arg.replace(unit,'') : arg;

		let threshold = new Date();
		if( unit.toLowerCase() === 'd' ) {
			//Days
			threshold.setDate(threshold.getDate()-time);		
		} else if( unit.toLowerCase() === 'm' ) {
			//Minutes
			threshold.setDate(threshold.getDate()-(time/24/60));
		} else {
			unit = 'h';
			//Hours
			threshold.setDate(threshold.getDate()-(time/24));
		} 

		let members = [];
		for( let m in log.members ) {
			let lastSeen = new Date(log.members[m]);
			if( threshold.getTime() < lastSeen.getTime() ) {
				members.push(m.toLowerCase());
			}
		}
		
		//Sort output
		members.sort(function(a,b){
			return a - b;
		});
		
		let embed = new Discord.RichEmbed();
		embed.setTitle("Active in last "+time+unit);
		
		let field = "";
		let count = 0;
		let fcount = 0;
		for( let mm of members ) {
			field += '- '+mm+'\n';
			++count;			
			
			if( count === 10 ) {
				embed.addField((fcount*10+1)+"-"+((fcount+1)*10),field,true);
				++fcount;
				field = "";
				count = 0;
			}
		}
		
		if( field.length > 0 ) {
			embed.addField((fcount*10+1)+"-"+((fcount*10)+count),field,true);	
		}
				
		message.channel.send({embed});
	}
 	
});

//ON MESSAGE UPDATED
client.on('messageUpdate', (oldMessage, newMessage) => {
  
	//Ignore bots
	if( newMessage.author.bot ) { return; }

	let tag = newMessage.author.username;
	if( !log.members[tag] ) { log.members[tag] = {}; }
	log.members[tag] = new Date().toString();
 	
});



/**
 * LOGIN WITH TOKEN
 */
async function doLogin() {

	try {

		await client.login(token);
    
    } catch(err) {
        console.error('\n ! '+err);
        process.exit(-1);
    }    

}
//TRIGGER LOGIN
doLogin();