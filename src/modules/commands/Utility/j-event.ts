import { 
    Message, 
    Collection, 
    TextChannel,
    CollectorFilter,
    MessageReaction,
    MessageCollector,
    MessageCollectorOptions,
    PermissionOverwriteOption
 } from 'discord.js'
import { Command } from 'discord-akairo'

export default class Utility extends Command {
    public client: Akairo.Client;
    public constructor() {
        super('jEvent', {
            aliases: ['event', 'je'],
            channel: 'guild',
            description: 'Start an join event like \'le old days.',
            category: 'Utility',
            userPermissions: ['MANAGE_MESSAGES'],
            args: [{
                id: 'amount', type: 'number' }, {
                id: 'lock', type: 'boolean',
                default: true
            }]
        });
    }

    private get strings(): (((m?: Message) => string) | string)[] {
        return [
            (m: Message) => m.guild.name,
            (m: Message) => m.client.user.username,
            'JOIN EVENT', 'REEEEEEEEE', 'WIN WIN WIN',
            'HHHHHHHHHH', 'BRIANWASTAKEN', 'LEE OH.',
            'LE AMONIC MAKUR', 'EXEMPLARY', 'LAMO'
        ]
    }

    private collect(
        msg: Message, 
        filter: CollectorFilter, 
        options: MessageCollectorOptions,
        entries: Collection<string, boolean>
    ): Collection<string, Message> {
        let collection: Collection<string, Message>;

        const collector = msg.channel.createMessageCollector(filter, options);
        collector.on('collect', (m: Message) => this.handleCollect.bind(m, collector, entries));
        collector.on('end', (collected: Collection<string, Message>) => collection = collected);

        return collection;
    }

    private handleCollect(this: Message, collector: MessageCollector, entries: Collection<string, boolean>): boolean | Promise<MessageReaction> {
        if (collector.collected.size >= 30) {
            this.reply('**The event is already full!**');
            return collector.collected.delete(this.id);
        }

        entries.set(this.author.id, true);
        return this.react('memerGold:753138901169995797');
    }

    public async exec(_: Message, args: any): Promise<Message> {
        await _.delete().catch(() => {});
        const { amount, lock }: { 
            amount: number, lock: boolean } = args;
        const { events } = this.client.util;
        const { guild } = _;
        const channel = _.channel as TextChannel;
        const lockChan = this.lockChan.bind(_);

        if (events.has(guild.id)) return;
        else events.set(guild.id, channel.id);
        if (lock) await lockChan(true);

        let string = this.client.util.randomInArray(this.strings);
        string = typeof string === 'function' ? string(_) : string;
        await channel.send(`**Type \`${string.toUpperCase()}\` to split __${amount.toLocaleString()}__ coins!**`);
        const entries: Collection<string, boolean> = new Collection();
        const filter: CollectorFilter = (m: Message) => !entries.has(m.author.id);
        const options: MessageCollectorOptions = { max: Infinity, time: 3e4 };
        
        const collected = [...(this.collect(_, filter, options, entries)).values()];
        let success: Message[] = [];
        events.delete(guild.id);
        await lockChan(null);

        if (!collected.length || collected.length <= 1) {
            return _.reply('**:skull: No one joined.**'); 
        }

        await channel.send(`**\`${collected.length}\` are teaming up to split __${amount.toLocaleString()}__ coins...**`);
        collected.sort(() => Math.random() - 0.5).forEach(c => Math.random() > 0.1 ? success.push(c) : {});
        const coins = Math.round(amount / success.length);
        const order = success.length ? success.map(s => s.author.toString()).join(', ') : '**Everybody died LOL**';
        return channel.send(`**Good job everybody, we split up \`${coins.toLocaleString()}\` coins each!\n\n${order}`);
    }

    private async lockChan(this: Message, bool: boolean): Promise<TextChannel> {
        const change: PermissionOverwriteOption = { SEND_MESSAGES: bool };
        return await (<TextChannel>this.channel).updateOverwrite(this.guild.id, change, `Event by ${this.author.tag}`);
    }
}