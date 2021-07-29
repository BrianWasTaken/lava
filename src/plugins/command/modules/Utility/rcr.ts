import { Command} from 'lava/index';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('rcr', {
			aliases: ['rcr'],
			clientPermissions: ['MANAGE_ROLES'],
			cooldown: 1000 * 60,
			description: 'Change the daily random color role to a random color.',
			userPermissions: ['MANAGE_ROLES'],
		});
	}

	async exec(ctx: Message) {
		const rcr = await ctx.guild.roles.fetch('716344676634066964');
		const color = ctx.client.util.randomColor();

		const prompt = async (color: number): Promise<number | Function> => {
			await ctx.reply({ embeds: [{ color, description: 'Do you like this color? Type `(y / n)` only.' }]});
			const choice = await ctx.awaitMessage();
			switch(choice.content.toLowerCase().slice(0, 1)) {
				case 'n':
					return prompt(ctx.client.util.randomColor());
				case 'y':
				default:
					return color;
			}
		};

		const newColor = await prompt(color) as number;
		await rcr.edit({ color: newColor });
		return ctx.reply({ embeds: [{
			description: `Ok, color changed. Enjoy!`,
			color: newColor,
		}]}).then(() => true);
	}
}