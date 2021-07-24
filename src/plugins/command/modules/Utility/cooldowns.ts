import { Command, Context, GuildMemberPlus, Cooldown, Colors } from 'lava/index';
import { MessageOptions, Message } from 'discord.js';

export default class extends Command {
	public constructor() {
		super('cooldowns', {
			aliases: ['cooldowns', 'cds'],
			clientPermissions: ['EMBED_LINKS'],
			name: 'Cooldowns',
			args: [
				{
					id: 'member',
					type: 'member',
					default: (c: Message) => c.member
				}
			]
		});
	}

	display(cooldown: Cooldown) {
		return `${cooldown.id}: ${this.calc((cooldown.expiresAt - Date.now()) / 1000).join(':')}`
	}

	calc(time: number) {
		const methods = [2592000, 86400, 3600, 60, 1];
		const ret = [Math.floor(time / methods[0])];

		for (let i = 0; i < methods.length - 1; i++) {
			const raw = (time % methods[i]) / methods[i + 1];
			ret.push(Math.floor(raw));
		}

		return ret.map(r => r < 10 ? `0${r}` : `${r}`);
	}

	async exec(ctx: Message, { member }: { member: GuildMemberPlus }) {
		const entry = await ctx.author.lava.fetch();
		const cooldowns = entry.cooldowns
			.filter(cd => cd.isActive())
			.map(cd => `${cd.id}: this.calc(cd.expiresAt - Date.now()).join(':')`);

		return ctx.channel.send({ embeds: [{
			author: { name: `${member.user.username}'s cooldowns` },
			color: Colors.ORANGE, description: cooldowns.length > 0 ? cooldowns.join('\n') : 'No active cooldowns.'
		}]}).then(() => false);
	}
}