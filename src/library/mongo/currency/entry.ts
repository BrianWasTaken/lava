/**
 * User Entry to manage their currency bullshit.
 * @author BrianWasTaken
*/

import { Inventory, Mission, GambleStat, TradeStat } from '.';
import { Currency, ItemEffects, ItemEntities } from 'lava/utility';
import { Collection, Snowflake, TextChannel } from 'discord.js';
import { CollectibleItem, PowerUpItem } from 'lava/../plugins/item';
import { UserEntry, CurrencyEndpoint } from 'lava/mongo';
import { Context, UserPlus } from 'lava/discord';

export declare interface CurrencyEntry extends UserEntry<CurrencyProfile> {
	/** The endpoint of this entry. */
	endpoint: CurrencyEndpoint;
}

export class CurrencyEntry extends UserEntry<CurrencyProfile> {
	/** The basics of their mongo profile. */
	public get props() {
		return {
			raw: this.data.props,
			prestige: this.data.prestige,
			items: super.map('items', Inventory),
			quests: super.map('quests', Mission),
			gambles: super.map('gamble', GambleStat),
			trades: super.map('trade', TradeStat),
			...this.data.props
		};
	}

	/** Their item effects. */
	public get effects() {
		const reduce = (array: number[]) => array.reduce((p, c) => p + c, 0);
		const effects: { [E in keyof ItemEntities]: number } = Object.create(null);
		const entities: [string, number[]][] = Object.entries(this.entities.entities);
		entities.forEach(([key, array]) => effects[key as keyof ItemEntities] = reduce(array));
		return effects;
	}

	/** Their item entities. */
	public get entities() {
		let thisEffects = this.client.handlers.item.effects.get(this.data._id as Snowflake);
		if (!thisEffects) thisEffects = this.updateEffects().client.handlers.item.effects.get(this.data._id as Snowflake);
		return thisEffects;
	}

	/** The active items. */
	public get actives() {
		const actives = this.props.items.filter(i => i.isActive());
		return actives.map(a => ({ item: a, effects: this.entities }));
	}

	/** Check if they own this item in their inventory. */
	public hasInventoryItem(id: string) {
		return this.props.items.get(id).isOwned();
	}

	/**
	 * Check if a quest is has been completed.
	 */
	public isQuestDone(id: string) {
		return this.props.quests.get(id).isFinished();
	}

	/** 
	 * Kill them 
	 */
	public async kill(itemLost?: string, itemLostAmount?: number) {
		const { pocket } = this.data.props;

		if (this.actives.find(a => a.item.isActive() && a.item.module.death)) return false;
		const item = this.props.items.find(i => i.id === itemLost) ?? null;
		if (itemLost) this.inventory(item.module.id).decrement(itemLost ? itemLostAmount : 0);

		await this.pocket(pocket > 0 ? pocket : 0).dec().save();
		return true;
	}

	/**
	 * Calc their multis.
	 */
	public calcMulti(ctx: Context) {
		const unlocked: { name: string, value: number }[] = [];
		const all: { name: string, value: number }[] = [];
		const unlock = (name: string, value: number, truthy: boolean) => {
			const fml = { name, value };
			if (truthy) unlocked.push(fml);
			return all.push(fml);
		}

		// The permanent multis
		unlock('User Multipliers', this.props.multi.base, true);
		// Level rewards multis
		unlock('Level Rewards', this.props.multi.level_rewards, this.props.multi.level_rewards > 0);
		// Memers Crib
		unlock(ctx.guild.name, 5, ctx.guild.id === '691416705917779999');
		// Nitro Booster
		unlock('Nitro Booster', 5, !!ctx.member.roles.premiumSubscriberRole?.id);
		// Mastery 1 and up
		unlock('Crib Mastery Rank', 5, ctx.member.roles.cache.has('794834783582421032'));
		// Has 1 of every item
		unlock('Item Collector', this.props.items.size, this.props.items.every(i => i.isOwned()));

		// Item Effects
		this.props.items.filter(i => i.module.category.id === 'Power-Up').forEach(i => {
			return unlock(i.module.name, i.multiplier, i.isActive() && i.multiplier >= 1);
		});

		// Mastery 10
		unlock('Crib Mastery Max', 5, ctx.member.roles.cache.has('794835005679206431'));
		// Prestige multis
		const prestigeMulti = Currency.PRESTIGE_MULTI_VALUE * this.props.prestige.level;
		unlock(`Prestige ${this.props.prestige.level}`, prestigeMulti, this.props.prestige.level >= 1);
		
		// Collectible Items
		const collectibles = this.props.items.map(i => i.module).filter(i => i.category.id === 'Collectible') as CollectibleItem[];
		if (collectibles.length >= 1) {
			collectibles.filter(c => c.entities.multipliers).forEach(c => {
				const inv = this.props.items.get(c.id);
				return unlock(c.name, c.entities.multipliers[inv.level] ?? 0, inv.isOwned());
			});
		}

		// Memers Crib Staff
		unlock('Crib Staff', -0, ctx.member.roles.cache.has('692941106475958363'));
		// Chips Cult
		unlock('Chips Cult', 5, ctx.member.nickname?.toLowerCase().includes('chips'));
		// Probber Cult
		unlock('Probber Cult', 5, ctx.member.nickname?.toLowerCase().includes('probber'));
		// Lava Channel
		unlock('Lava Channel', 5, (ctx.channel as TextChannel).name.toLowerCase().includes('lava'));
		// Maxed All Items
		unlock('Maxed All Items', 5, this.props.items.every(i => i.isMaxLevel()));
		// 10 items have reached max inventory cap.
		unlock('Item Collector Plus', this.props.items.size * 2, this.props.items.filter(i => i.owned >= Currency.MAX_INVENTORY).size >= 10);
		// 1B Space
		unlock('Billion Storage', 10, this.props.space >= 1e9);
		// Prestige 10s
		unlock(`Prestige ${this.props.prestige.level}`, 5, this.props.prestige.level % 10 === 0 && this.props.prestige.level > 0);

		return { unlocked, all };
	}

	/**
	 * Chained pocket manager.
	 */
	private pocket(amount: number) {
		return {
			inc: () => {
				this.data.props.pocket += amount;
				return this;
			},
			dec: () => {
				this.data.props.pocket -= amount;
				return this;
			},
			set: () => {
				this.data.props.pocket = amount;
				return this;
			}
		}
	}

	/**
	 * Manage their vault.
	 */
	private vault(amount = 0) {
		return {
			withdraw: (vault = true) => {
				this.data.props.pocket += amount;
				if (vault) this.data.props.vault.amount -= amount;
				return this;
			},
			deposit: (pocket = true) => {
				this.data.props.vault.amount += amount;
				if (pocket) this.data.props.pocket -= amount;
				return this;
			},
			expand: () => {
				this.data.props.space += amount;
				return this;
			},
			lock: () => {
				this.data.props.vault.locked = true;
				return this;
			},
			unlock: () => {
				this.data.props.vault.locked = false;
				return this;
			},
			set: () => {
				this.data.props.vault.amount = amount;
				return this;
			},
			space: () => {
				this.data.props.space = amount;
				return this
			}
		}
	}

	/**
	 * Manage their premium shits.
	 */
	private keys(amount: number) {
		return {
			inc: () => {
				this.data.props.prem += amount;
				return this;
			},
			dec: () => {
				this.data.props.prem -= amount;
				return this;
			},
			set: () => {
				this.data.props.prem = amount;
				return this;
			}
		}
	}

	/**
	 * Manage their inventory.
	*/
	private inventory(id: string) {
		const thisItem = this.data.items.find(i => i.id === id);

		return {
			increment: (amount = 1) => {
				thisItem.amount += amount;
				return this;
			},
			decrement: (amount = 1) => {
				thisItem.amount -= amount;
				return this;
			},
			activate: (expire: number) => {
				thisItem.expire = expire;
				return this;
			},
			deactivate: () => {
				thisItem.expire = 0;
				return this;
			},
			setMulti: (multi: number) => {
				thisItem.multi = multi;
				return this;
			},
			upgrade: (level = thisItem.level + 1) => {
				thisItem.level = level;
				return this;
			}
		}
	}

	/**
	 * Manage their xp.
	*/
	private calc() {
		const maxLevel = Currency.MAX_LEVEL * Currency.XP_COST;
		const calcLevel = (xp: number) => xp / Currency.XP_COST;
		// const xpBoosts = this.actives.find(i => i.effects.entities.xpBoost.length > 0); 

		return {
			xp: (space = false, additional = 0) => {
				if (this.data.props.xp > maxLevel) return this;
				const { randomNumber } = this.client.util;
				const user = this.client.users.cache.get(this.data._id as Snowflake);

				const previousLevel = Math.trunc(calcLevel(this.data.props.xp));
				this.data.props.xp += randomNumber(1, 1 + additional);
				const newLevel = Math.trunc(calcLevel(this.data.props.xp));

				if (newLevel > previousLevel) this.endpoint.emit('levelUp', this, user as UserPlus);
				return space ? this.calc().space() : this;
			},
			space: (os = 110) => {
				if (this.data.props.xp > maxLevel) return this;
				const { level } = this.data.prestige;
				const amount = Math.ceil(os * (level / 2) + os);
				return this.vault(amount).expand();
			}
		}
	}

	/**
	 * Manage their dailytards.
	*/
	private daily() {
		return {
			addStreak: () => {
				this.data.daily.streak++;
				return this;
			},
			resetStreak: () => {
				this.data.daily.streak = 1;
				return this;
			},
			recordStreak: (stamp = Date.now()) => {
				this.data.daily.time = stamp;
				return this;
			}
		}
	}

	/**
	 * Manage their gambling statfuckeries.
	*/
	private stats(game: string) {
		const thisStat = this.data.gamble.find(stat => stat.id === game);

		return {
			coins: (amount: number) => ({
				add: () => {
					thisStat.won += amount;
					return this;
				},
				sub: () => {
					thisStat.lost += amount;
					return this;
				}
			}),
			games: (amt = 1) => ({
				loses: () => {
					thisStat.loses += amt;
					return this;
				},
				wins: () => {
					thisStat.wins += amt;
					return this;
				}
			})
		}
	}

	/**
	 * Manage their levels.
	 */
	private levels() {
		return {
			set: (level: number) => {
				this.data.props.xp = level * Currency.XP_COST;
				return this;
			},
			prestige: (level = this.props.prestige.level) => {
				this.data.prestige.level = level;
				return this;
			},
		}
	}

	/** Add coins to ur pocket */
	addPocket(amount: number, isShare = false) {
		return this.pocket(amount).inc();
	}

	/** Remove coins from pocket */
	removePocket(amount: number, isShare = false) {
		return this.pocket(amount).dec();
	}

	/** Set their pocket to whatever the fuck amount you want. */
	setPocket(amount: number) {
		return this.pocket(amount).set();
	}

	/** Add certain amount of keys */
	addKeys(amount: number) {
		return this.keys(amount).inc();
	}

	/** Remove amount of keys */
	subKeys(amount: number) {
		return this.keys(amount).dec();
	}

	/** Set amount of keys */
	setKeys(amount: number) {
		return this.keys(amount).set();
	}

	/** Withdraw coins from ur vault */
	withdraw(amount: number, removeVault = true) {
		return this.vault(amount).withdraw(removeVault);
	}

	/** Deposit coins into your vault */
	deposit(amount: number, removePocket = true) {
		return this.vault(amount).deposit(removePocket);
	}

	/** Expand ur vault */
	expandVault(amount: number) {
		return this.vault(amount).expand();
	}

	/** Lock your vault */
	lockVault() {
		return this.vault().lock();
	}

	/** Unlock ur vault */
	unlockVault() {
		return this.vault().unlock();
	}

	/** Set ur vault to some amount u want */
	setVault(amount: number) {
		return this.vault(amount).set()
	}

	/**
	 * Set your bank space to some amount.
	 */
	setSpace(amount: number) {
		return this.vault(amount).space();
	}

	/** Set your level to something you want. */
	setLevel(level: number) {
		return this.levels().set(level);
	}

	/** Record ur daily */
	recordDailyStreak() {
		return this.daily().recordStreak();
	}

	/** Add ur daily streak */
	addDailyStreak() {
		return this.daily().addStreak();
	}

	/** reset idk im tired writing this */
	resetDailyStreak() {
		return this.daily().resetStreak();
	}

	/** Update a gambling game stat */
	updateStats(game: string, coins: number, isWin: boolean) {
		const coin = this.stats(game).coins(coins);
		const games = this.stats(game).games();
		
		if (isWin) {
			games.wins();
			coin.add();
			return this;
		}

		games.loses();
		coin.sub();
		return this;
	}

	/** Update their item effects */
	updateEffects() {
		const { effects, modules } = this.client.handlers.item;
		const powerUps = modules.filter(i => i.category.id === 'Power-Up').array() as PowerUpItem[];
		const instance = this.client.util.effects();

		const filter = (p: PowerUpItem) => this.props.items.get(p.id).isActive();
		powerUps.filter(filter).forEach(p => p.effect(instance, this));
		effects.set(this.data._id as Snowflake, instance);
		return this;
	}

	/** Increment the amount of stuff they own to an item */
	addItem(id: string, amount = 1) {
		return this.inventory(id).increment(amount);
	}

	/** Opposite of the thing above */
	subItem(id: string, amount = 1) {
		return this.inventory(id).decrement(amount);
	}

	/** Activate an item based on it's expiration date */
	activateItem(id: string, expiration: number) {
		return this.inventory(id).activate(expiration);
	}

	/** Deactivate an item */
	deactivateItem(id: string) {
		return this.inventory(id).deactivate();
	}

	/** Set the multi of an item */
	setItemMulti(id: string, multi: number) {
		return this.inventory(id).setMulti(multi);
	}

	/** Upgrade an item */
	upgradeItem(id: string) {
		return this.inventory(id).upgrade();
	}

	/** Set inventory */
	setItems(queries: { id: string, amount: number }[]) {
		this.props.items.forEach(i => this.inventory(i.id).decrement(i.owned));
		queries.forEach(q => this.inventory(q.id).increment(q.amount));
		return this;
	}

	/** Prestige */
	prestige(to: number) {
		return this.levels().prestige(to);
	}

	/**
	 * The final shitfuckery this entry needs to do after tolerating bot spammers.
	*/
	save(runPost = true) {
		if (runPost) {
			const prestige = this.props.prestige.level;
			const xpBoost = this.effects.xpBoost;
			this.calc().xp(true, xpBoost + prestige);
			this.updateEffects();
		}

		return super.save();
	}
}