import { TextChannel, MessageEmbedOptions } from 'discord.js';
import { Listener } from 'lava/index';

export default class extends Listener {
	constructor() {
		super('ready', {
			category: 'Client',
			emitter: 'client',
			event: 'ready',
			name: 'ready'
		});
	}

	async exec() {
		this.logReady();
		await this.setPresence();
		await this.sendReady();
	}

	logReady() {
		const msg = `${this.client.user.tag} logged in.`;
		return this.client.console.log('Client', msg);
	}

	async sendReady() {
		const { client: bot } = this;
		const channel = bot.channels.cache.get('789692296094285825') ?? await bot.channels.fetch('789692296094285825', { cache: true, force: true });
		const app = await bot.application.fetch();

		await (channel as TextChannel).send({ 
			embeds: [{
				title: `${bot.user.username} — ready`,
				color: bot.util.randomColor(),
				description: 
				`**Application Name:**\n${
					app.name
				}\n**Bot Username:**\n${
					bot.user.username
				}\n**Date Now:\n**${
					new Date(bot.readyTimestamp).toDateString()
				}`
			}]
		});
	}

	async setPresence() {
		await this.client.user.setPresence({
			activities: [{ name: 'LOL Bot', type: 'COMPETING' }],
			status: process.env.DEV_MODE === 'true' ? 'dnd' : 'online'
		});
	}
}