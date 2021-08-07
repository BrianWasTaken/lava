/**
 * Hey girl welcome to my crib owo
 * @author BrianWasTaken
*/

import { ClientUtil, SpawnHandler, DonationHandler, ArgumentHandler, QuestHandler, InhibitorHandler, SettingHandler, CommandHandler, ListenerHandler, ItemHandler, PluginManager } from '.';
import { ClientOptions, MessageOptions, TextChannel, UserResolvable, Message, User, GuildMember, ThreadMember } from 'discord.js';
import { AkairoClient, AkairoOptions } from 'discord-akairo';
import { Connector, Logger, Imgen } from 'lava/index';
import { join } from 'path';
import MongoDB from 'mongoose';

import '../discord/structures';

declare module 'discord-akairo' {
	interface AkairoClient {
		setTimeout(fn: (...args: any[]) => any, timeout: number): NodeJS.Timeout;
		setInterval(fn: (...args: any[]) => any, timeout: number): NodeJS.Timeout;
	}
}

export class LavaClient extends AkairoClient {
	/**
	 * Our fancy logger.
	 */
	public console = Logger.createInstance();
	
	/**
	 * Dank Memer imgen.
	 */
	public memer = new Imgen('https://dankmemer.services', process.env.MEME_TOKEN);
	
	/**
	 * Akairo client utils.
	 */
	public util = new ClientUtil(this);
	
	/**
	 * The db adapter.
	 */
	public db = new Connector(this);
	
	/**
	 * Our plugins.
	 */
	public plugins = new PluginManager(this, {
		directory: join(__dirname, '..', '..', 'plugins')
	}).loadAll();

	/**
	 * Check whether someone is a bot owner.
	 * @param res a user resolvable
	 */
	public isOwner(res: UserResolvable) {
		const owners = Array.isArray(this.ownerID) ? [...this.ownerID] : [this.ownerID];
		return owners.some(o => {
			if (res instanceof Message) return o === res.author.id;
			if (res instanceof User) return o === res.id;
			if (res instanceof GuildMember) return o === res.user.id;
			if (res instanceof ThreadMember) return o === res.user.id;
			return o === res;
		});
	}

	/**
	 * Shortcut to our handlers from our plugins.
	 */
	public get handlers() {
		const plugin = (id: string) => this.plugins.plugins.get(id)?.handler as unknown;
		
		return {
			/**
			 * Command arguments.
			 */
			argument: plugin('argument') as ArgumentHandler,
			/**
			 * The butthole of this bot.
			 */
			command: plugin('command') as CommandHandler,
			/**
			 * The discord mod that bans every member on his server.
			 */
			inhibitor: plugin('inhibitor') as InhibitorHandler,
			/**
			 * That thing where panther spammed me weeks ago.
			 */
			donation: plugin('donation') as DonationHandler,
			/**
			 * The currency items.
			 */
			item: plugin('item') as ItemHandler,
			/**
			 * The listeners.
			 */
			listener: plugin('listener') as ListenerHandler,
			/**
			 * The ducking quests.
			 */
			quest: plugin('quest') as QuestHandler,
			/**
			 * The user settings.
			 */
			setting: plugin('setting') as SettingHandler,
			/**
			 * The spawners to make YOU bankrupt.
			 */
			spawn: plugin('spawn') as SpawnHandler
		};
	}

	/**
	 * Temporary fix against discord-akairo smh.
	 * @param fn the function to call when the timeout ends
	 * @param timeout the timeout in ms
	 */
	setTimeout(fn: (...args: any[]) => any, timeout: number) {
		return setTimeout(fn, timeout);
	}

	/**
	 * Temporary fix against akairo smfh.
	 * @param fn the function to call when the interval ticks
	 * @param timeout the interval in ms
	 */
	setInterval(fn: (...args: any[]) => any, timeout: number) {
		return setInterval(fn, timeout);
	}
}