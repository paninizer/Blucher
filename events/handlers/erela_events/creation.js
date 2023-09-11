
var {
    MoonlinkManager
  } = require("moonlink.js"),
    config = require(`${process.cwd()}/botconfig/config.json`),
    clientID = process.env.clientID || config.spotify.clientID,
    clientSecret = process.env.clientSecret || config.spotify.clientSecret;
  module.exports = (client) => {
        client.manager = new MoonlinkManager([{ //1. Nodes
  				host: 'lava1.horizxon.studio', 
  				port: 80,
  				secure: false,
  				password: "horizxon.studio"
			}, { //1. Nodes
  				host: 'lava2.horizxon.studio', 
  				port: 80,
  				secure: false,
  				password: "horizxon.studio"
			}, { //1. Nodes
  				host: 'lava3.horizxon.studio', 
  				port: 80,
  				secure: false,
  				password: "horizxon.studio"
			}, { //1. Nodes
  				host: 'lava4.horizxon.studio', 
  				port: 80,
  				secure: false,
  				password: "horizxon.studio"
			}], { //2. Options
  				shards: 1,
				spotify: { clientId: config.spotify.clientID, clientSecret: config.spotify.clientSecret }
				}, (guild, sPayload) => { //3. Function
  				client.guilds.cache.get(guild).shard.send(JSON.parse(sPayload))
				})      
//require the other events
      require("./node_events")(client)
      require("./client_events")(client)
      require("./events")(client)
      require("./musicsystem")(client)
      
  };
  

  function collect(node) {
    return node.map(x => {
        
      if (!x.host) throw new RangeError('"host" must be provided');
      if (!x.password) throw new RangeError('"password" must be provided');
      if (typeof x.port !== 'number') throw new RangeError('"port" must be a number');
      if (x.retryAmount && typeof x.retryAmount !== 'number') throw new RangeError('Retry amount must be a number');
      if (x.retryDelay && typeof x.retryDelay !== 'number') throw new RangeError('Retry delay must be a number');
      if (x.secure && typeof x.secure !== 'boolean') throw new RangeError('Secure must be a boolean');

      return {
          host: x.host,
          password: x.password ? x.password : 'youshallnotpass',
          port: x.port && !isNaN(x.port) ? Number(x.port) : 2333,
          identifier: x.identifier || x.host,
          retryAmount: x.retryAmount ? Number(x.retryAmount) : 5,
          retryDelay: x.retryDelay ? Number(x.retryDelay) : 5000,
          secure: x.secure ? x.secure : false
      };
    });
}

//coded by paninizer#0001
/*
 * @POTENTIAL BREAKPOINT
 *
 */