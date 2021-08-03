import { CollectorFilter, Message, ButtonInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { Command, LavaClient, CurrencyEntry, Inventory, Colors } from 'lava/index';

interface SearchData {
	place: string;
	maxCoins: number;
	minCoins: number;
	successMsg: (won: number) => string;
	items?: string[];
	death?: {
		odds: number;
		msg: string;
	}; 
}

interface SearchResult { // this is not google LOL
	coinsWon: number;
	coinsRaw: number;
	itemGot: Inventory;
	killed: Death;
	possibleItemLost: Inventory;
	itemLostAmount: number;
}

const enum Death {
	safe = 0,
	saved = 1,
	died = 2,
};

export default class extends Command {
	constructor() {
		super('search', {
			aliases: ['search', 'scout'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 10,
			description: 'Search for coins on some places to either get some or die!',
		});
	}

	get search() {
		return search(this.client);
	}

	/**
	 * Process the search stuff.
	 * Returns `false` if dead, an object otherwise.
	 */
	async searchPlace(search: SearchData, entry: CurrencyEntry, multi: number): Promise<SearchResult> {
		const { minCoins, maxCoins, death, items } = search;
		const { randomNumber, randomInArray } = entry.client.util;
		const coins = randomNumber(minCoins, maxCoins);
		const item = randomInArray(items ?? []);

		const isDead = death ? death.odds > randomNumber(1, 100) : false;
		const pil = entry.props.items.filter(i => i.isOwned()).random() ?? null;
		const ila = pil ? randomNumber(1, pil.owned) : 0;
		if (isDead) {
			const killed = await entry.kill(pil.id, ila);
			return ({
				itemGot: null,
				coinsRaw: 0,
				coinsWon: 0,
				killed: killed ? Death.died : Death.saved,
				possibleItemLost: pil,
				itemLostAmount: ila,
			});
		}

		if (item) entry.addItem(item);
		const won = Math.round(coins + (coins * (multi / 100)));
		await entry.addPocket(won).save();
		return ({
			itemGot: (randomNumber(1, 100) < 10) && item ? entry.props.items.get(item) : null,
			coinsRaw: coins,
			coinsWon: won,
			killed: Death.safe,
			possibleItemLost: null,
			itemLostAmount: null,
		});
	}

	async exec(ctx: Message) {
		const { randomsInArray } = ctx.client.util;
		const entry = await ctx.author.currency.fetch();
		const searchables = randomsInArray(this.search, 3);
		const places = searchables.map(s => s.place);

		const msg = await ctx.reply({
			components: [new MessageActionRow().addComponents(
				...places.map(label => new MessageButton({
					label, style: 'PRIMARY', 
					customId: label,
				}))
			)],
			content: [
				`**Where do you want to search?**`,
				'*Pick one from the list below.*'
			].join('\n')
		});
		const choice = await msg.awaitMessageComponent<ButtonInteraction>({
			time: 15000, filter: int => int.user.id === ctx.author.id
		});

		let components = [new MessageActionRow({ 
			components: [...msg.components.flatMap(row => {
				return row.components.filter(comp => comp.type === 'BUTTON')
			}).map(btn => btn.setDisabled(true))]
		})];

		if (!choice) {
			return choice.update({ components, content: 'Imagine not picking the right place, idiot.' }).then(() => true);
		}

		components = [new MessageActionRow({ 
			components: [...msg.components.flatMap(row => {
				return row.components.filter(comp => comp.type === 'BUTTON') as MessageButton[];
			}).map(btn => {
				if (btn.customId === choice.customId) btn.setStyle('SUCCESS');
				return btn.setDisabled(true);
			})]
		})];

		const searched = searchables.find(s => choice.customId === s.place);
		const getHeader = () => `${ctx.author.username} searched the ${searched.place.toUpperCase()}`;
		const multi = entry.calcMulti(ctx).unlocked.reduce((p, c) => p + c.value, 0);
		const pocket = entry.props.pocket;
		const nice = await this.searchPlace(searched, entry, multi);

		if (nice.killed !== Death.safe) {
			const item = nice.possibleItemLost;
			const lost = nice.itemLostAmount;

			const saver = entry.actives.find(a => a.item.module.death);
			const sampleText = nice.killed === Death.died 
				? `You lost **${pocket.toLocaleString()} coins** ${item ? `and **${lost.toLocaleString()} ${item.upgrade.emoji} ${item.upgrade.name}** RIP LOL!` : 'RIP!'}`
				: `Your **${saver.item.upgrade.emoji} ${saver.item.upgrade.name}** saved you from death!`;
			
			return choice.update({ components, content: null, embeds: [{
				author: { name: getHeader(), iconURL: ctx.author.avatarURL({ dynamic: true }) },
				description: `${searched.death.msg}\n${sampleText}`,
				footer: { text: 'Lol u died' },
				color: Colors.RED
			}]}).then(() => true);
		}

		return choice.update({ components, content: null, embeds: [{
			description: `${searched.successMsg(nice.coinsWon)}${nice.itemGot ? `\nand **1 ${nice.itemGot.module.emoji} ${nice.itemGot.module.name}** wow you're very lucky!` : ''}`,
			footer: { text: `Multiplier Bonus: +${multi}% (${nice.coinsRaw.toLocaleString()} coins)` },
			author: { name: getHeader(), iconURL: ctx.author.avatarURL({ dynamic: true }) },
			color: Colors.GREEN
		}]}).then(() => true);
	}
}

const search = (client: LavaClient): SearchData[] => [
	{
		place: 'dustbin',
		maxCoins: 500000,
		minCoins: 100,
		successMsg: w => `You smell but here's **${w.toLocaleString()}** coins ig`,
		death: {
			msg: 'You ate a rotten banana and went to the hospital but you were dead on arrival.',
			odds: 10,
		},
	},
	{
		place: 'air',
		maxCoins: 650000,
		minCoins: 500,
		successMsg: w => `How the heck you got **${w.toLocaleString()}** coins from air?`,
		death: {
			msg: 'You caught the coronavirus.',
			odds: 15
		}
	},
	{
		place: 'memers crib',
		maxCoins: 600000,
		minCoins: 500,
		items: ['gem', 'trophy', 'pizza', 'wine', 'card'],
		successMsg: w => `We wanna make u rich here so here's **${w.toLocaleString()}** bits, enjoy :)`,
	},
	{
		place: 'mars',
		maxCoins: 300000,
		minCoins: 100,
		items: ['bacon'],
		successMsg: w => `You suffocated for **${w.toLocaleString()}** coins.`,
		death: {
			msg: 'You suffocated for nothing.',
			odds: 45
		}
	},
	{
		place: 'discord',
		maxCoins: 100000,
		minCoins: 500,
		items: ['coin', 'phone', 'computer'],
		successMsg: w => `You typed \`lava gimme\` in the chats and got **${w.toLocaleString()}** coins`,
		death: {
			msg: 'You got banned from your favorite server.',
			odds: 10,
		}
	},
	{
		place: 'club',
		maxCoins: 200000,
		minCoins: 500,
		items: ['beer', 'alcohol', 'soda', 'wine'],
		successMsg: w => `You danced for **${w.toLocaleString()}** coins`,
		death: {
			msg: 'Being drunk is bad and bad leads to death, you died.',
			odds: 45
		}
	},
	{
		place: 'tree',
		maxCoins: 300000,
		minCoins: 500,
		items: ['gem', 'donut'],
		successMsg: w => `Wtf who left **${w.toLocaleString()}** coins up this tree?`,
		death: {
			msg: 'You fell off and got a fracture in ur head, u died upon hospital arrival.',
			odds: 10
		}
	},
	{
		place: 'space',
		maxCoins: 500000,
		minCoins: 500,
		items: ['medal', 'cheese', 'taco', 'totem'],
		successMsg: w => `Wow you dodged the space debris, you got **${w.toLocaleString()}** ggs`,
		death: {
			odds: 60,
			msg: client.util.randomInArray([
				'You got sucked from the blackhole.',
				'The star burnt you and your soul.',
				'You didn\'t dodged the debris, sucks to suck.'
			])
		}
	}
];