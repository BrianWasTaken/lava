import { Listener, Context, Command, Colors } from 'lava/index';

export default class extends Listener {
	constructor() {
		super('cooldown', {
			category: 'Command',
			emitter: 'command',
			event: 'cooldown',
			name: 'Cooldown'
		});
	}

	get titleCD() {
		return ['Chill', 'Hold Up', 'Bruh calm down'];
	}

	async exec(ctx: Context, cmd: Command, remaining: number) {
		const { parseTime, randomInArray } = ctx.client.util;
		const defaultCD = parseTime(cmd.cooldown / 1000, true) ?? `${cmd.cooldown / 1e3}s`;
		const cooldown = parseTime(remaining / 1000, false) ?? `${(remaining / 1e3).toFixed(1)}s`;

		await ctx.reply({ embeds: [{
			title: randomInArray(this.titleCD),
			color: Colors.INDIGO,
			description: [
				`You're under cooldown for the \`${cmd.aliases[0]}\` command.`,
				`Wait **${cooldown}** to run this command again.`,
				`You have to wait \`${defaultCD}\` by default!`
			].join('\n')
		}]});
	}
}