import { Client, Listener } from 'discord-akairo'
import { PresenceData } from 'discord.js'

export default class DiscordListeners extends Listener {
	public client: Client;
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	public async exec(): Promise<void> {
		const activity: PresenceData["activity"] = { 
			name: 'discord.gg/memer', type: 'STREAMING'
		};
		
		await this.client.user.setPresence({ activity });
		this.client.util.log(
			'Discord', 'main', 
			`${this.client.user.tag} has flown within Discord.`
		);
	}
}