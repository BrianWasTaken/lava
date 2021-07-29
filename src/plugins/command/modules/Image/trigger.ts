import { MessageOptions, Message, GuildMember } from 'discord.js';
import { Command } from 'lava/index';

export default class extends Command {
	constructor() {
		super('trigger', {
			aliases: ['trigger'],
			channel: 'guild',
			clientPermissions: ['ATTACH_FILES'],
			name: 'Trigger',
			args: [
				{ 
					id: 'member', 
					type: 'member', 
					default: (c: Message) => c.member 
				},
			],
		});
	}

	async exec(ctx: Message, { member }: { member: GuildMember }) {
		const params = new URLSearchParams();
		params.set('avatar1', member.user.avatarURL({ format: 'png' }));
		
		const g = await ctx.client.memer.generate('trigger', params, 'gif');
		await ctx.channel.send({ files: [g] });
		return false;
	}
}