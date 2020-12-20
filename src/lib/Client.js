const { 
	AkairoClient,
	ListenerHandler,
	CommandHandler 
} = require('discord-akairo');
const { 
	config 
} = require('../config.js');

const Player = require('./Player.js');
const ClientUtil = require('./Util.js');


module.exports = class LavaClient extends AkairoClient {
  constructor() {
    super({
      ownerID: config.owners
    }, {
      disableMentions: 'everyone'
    });

    this.player = new Player(this);

    this.util = new ClientUtil(this);

    this.listenerHandler = new ListenerHandler(this, {
      directory: `${process.cwd()}/src/emitters/`
    });

    this.commandHandler = new CommandHandler(this, {
    	directory: `${process.cwd()}/src/commands/`,
    	prefix: ['lava', ';;'],
    	handleEdits: true,
    	commandUtil: true,
    	defaultCooldown: 1000
    });
  }

  loadEmitters() {
  	this.listenerHandler.setEmitters({
  		distube: this.player,
  		process: process
  	});
  }

  async login(token) {
  	this.loadEmitters();
  	this.commandHandler.loadAll();
  	this.commandHandler.useListenerHandler(this.listenerHandler);
  	this.listenerHandler.loadAll();
  	return super.login(token);
  }
}

/**
import { Client, Collection } from 'discord.js'
import { readdirSync } from 'fs'

import { Player } from './Player.js'
import { Util } from './Util.js'
import { config } from '../config.js'

export class Musicord extends Client {
	constructor(config) {
		super({ disableMentions: 'everyone' });
		this.distube = new Player(this);
		this.config = config;
		this.utils = new Util(this);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
		this.setup();
	}

	setup() {
		readdirSync(`${process.cwd()}/src/commands`).forEach(dir => {
			readdirSync(`${process.cwd()}/src/commands/${dir}`).forEach(async cmd => {
				const command = (await import(`../commands/${dir}/${cmd}`)).default;
				this.commands.set(command.props.name, command);
				command.props.aliases.forEach(a => this.aliases.set(a, command));
				this.utils.log(
					this.constructor.name, 
					'main', `Command "${command.props.name}" loaded.`
				);
			})
		});

		readdirSync(`${process.cwd()}/src/emitters`).forEach(async em => {
			((await import(`../emitters/${em}`)).run.bind(this))();
			this.utils.log(
				this.constructor.name, 
				'main', `Listener "${em.split('.')[0]}" loaded.`
			);
		});
	}
}
*/