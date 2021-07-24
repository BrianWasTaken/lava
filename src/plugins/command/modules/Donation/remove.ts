import { Command, Context, GuildMemberPlus, Donation } from 'lava/index';

interface CommandArgs {
	member: GuildMemberPlus;
	amount: number;
	event?: Donation;
}

export default class extends Command {
	constructor() {
		super('donoRemove', {
			aliases: ['donoRemove', 'd-'], 
			clientPermissions: ['EMBED_LINKS'],
			name: 'Donation Remove',
			staffOnly: true,
			args: [
				{
					id: 'member',
					type: 'member'
				},
				{
					id: 'amount',
					type: 'number'
				},
				{
					id: 'event',
					type: 'dono',
					default: (c: Context) => c.client.handlers.donation.modules.get('default')
				}
			]
		});
	}

	async exec(ctx: Context, { member, amount, event }: CommandArgs) {
		const entry = await member.user.crib.fetch();
		if (!member) {
			return ctx.reply(`Member not found.`).then(() => false);
		}
		if (!amount) {
			return ctx.reply(`You need something to remove!`).then(() => false);
		}
		if (!event) {
			const events = ctx.client.handlers.donation.modules.map(d => d.name);
			return ctx.reply(`Invalid event. Valid events are: \`${events.join('`, `')}\``).then(() => false);
		}

		const { amount: amt, records } = await entry.subDono(event.id, Math.trunc(amount)).save().then(e => e.donos.get(event.id));
		return ctx.channel.send(`Removed **${Math.trunc(amount).toLocaleString()}** to **${member.user.tag}**'s \`${event.name}\` donations.`).then(() => false);
	}
}