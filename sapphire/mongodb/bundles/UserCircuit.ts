import type { SapphireClient } from '@sapphire/framework';
import type { UserProfile } from '#db/bundles/UserBundle';
import { UserBundle, UserPunishmentStates } from '#db/bundles/UserBundle';
import { NumberUtils } from '#util/Native';
import { Circuit } from '#db/Circuit';

export interface UserCircuit extends Circuit<UserProfile> {
	bundle: UserBundle;
}

export class UserCircuit extends Circuit<UserProfile> {
	public blacklist(duration: number): this {
		this.data.punishments.expire = duration;
		this.data.punishments.state = UserPunishmentStates.BLOCK;
		this.data.punishments.count++;
		return this;
	}

	public ban(): this {
		this.data.punishments.state = UserPunishmentStates.BAN;
		this.data.punishments.count++;
		return this;
	}

	public revokePunishment(): this {
		this.data.punishments.state = UserPunishmentStates.NONE;
		return this;
	}

	public manageSetting(id: string, enabled: boolean): this {
		const thisConfig = this.data.settings.find(s => s.id === id);
		if (!thisConfig) return this;
		thisConfig.enabled = enabled;
		// thisConfig.cooldown = thisConfig.piece.cooldown;
		return this;
	}

	public setCooldown(id: string, expiration: number): this {
		const thisCommand = this.data.commands.find(c => c.id === id);
		if (!thisCommand) return this;
		thisCommand.cooldown = expiration;
		return this;
	}

	public addSpam(id: string): this {
		const thisCommand = this.data.commands.find(c => c.id === id);
		if (!thisCommand) return this;
		thisCommand.spams++;
		return this;
	}

	public setLastCommand(id: string): this {
		const thisCommand = this.data.commands.find(c => c.id === id);
		if (!thisCommand) return this;
		thisCommand.last_run = Date.now();
		thisCommand.runs++;
		return this;
	}

	public addPocket(amount: number): this {
		this.data.props.pocket += amount;
		return this;
	}

	public subPocket(amount: number): this {
		this.data.props.pocket -= amount;
		return this;
	}

	public addKeys(amount: number): this {
		this.data.props.keys += amount;
		return this;
	}

	public subKeys(amount: number): this {
		this.data.props.keys -= amount;
		return this;
	}

	public setKeys(amount: number): this {
		this.data.props.keys = amount;
		return this;
	}

	public expandSpace(offset = 55): this {
		this.data.props.space += Math.round(offset * (this.data.props.prestige / 2) + offset);
		return this;
	}

	public withdraw(amount: number): this {
		this.data.props.pocket += amount;
		this.data.props.vault -= amount;
		return this;
	}

	public deposit(amount: number): this {
		this.data.props.vault += amount;
		this.data.props.pocket -= amount;
		return this;
	}

	public addXp(amount = 1): this {
		this.data.props.xp += amount;
		return this;
	}

	public subXp(amount = 1): this {
		this.data.props.xp -= amount;
		return this;
	}

	public addItem(id: string, amount = 1): this {
		const thisItem = this.data.inventory.find(i => i.id === id);
		if (!thisItem) return this;
		thisItem.amount += amount;
		return this;
	}

	public subItem(id: string, amount = 1): this {
		const thisItem = this.data.inventory.find(i => i.id === id);
		if (!thisItem) return this;
		thisItem.amount -= amount;
		return this;
	}

	public addItemXp(id: string, amount = 1): this {
		const thisItem = this.data.inventory.find(i => i.id === id);
		if (!thisItem) return this;
		thisItem.xp += amount;
		return this;
	}

	public subItemXp(id: string, amount = 1): this {
		const thisItem = this.data.inventory.find(i => i.id === id);
		if (!thisItem) return this;
		thisItem.xp -= amount;
		return this;
	}

	public upgradeItem(id: string, levels = 1): this {
		const thisItem = this.data.inventory.find(i => i.id === id);
		if (!thisItem) return this;
		thisItem.level += levels;
		return this;
	}

	public setItemValue(id: string, expire = 0, value = 0): this {
		const thisItem = this.data.inventory.find(i => i.id === id);
		if (!thisItem) return this;
		thisItem.expire = expire;
		thisItem.value = value;
		return this;
	}

	public setItems(items: { id: string, amount?: number }[]): this {
		this.data.inventory.forEach(i => this.subItem(i.id, i.amount));
		items.forEach(i => this.addItem(i.id, i.amount ?? 1));
		return this;
	}

	public prestige(to = this.data.props.prestige + 1): this {
		this.data.props.prestige = to;
		return this;
	}

	public addGambleWinnings(id: string, coins: number, incWins = true): this {
		const thisGame = this.data.gambles.find(g => g.id === id);
		if (!thisGame) return this;
		if (incWins) {
			thisGame.losies = 0;
			thisGame.winnies++;
			thisGame.wins++;
		}

		thisGame.won += coins;
		return this;
	}

	public subGambleWinnings(id: string, coins: number, incLoses = true): this {
		const thisGame = this.data.gambles.find(g => g.id === id);
		if (!thisGame) return this;
		if (incLoses) {
			thisGame.winnies = 0;
			thisGame.losies++;
			thisGame.loses++;
		}

		thisGame.lost -= coins;
		return this;
	}

	public addTradesOut(id: string, amount: number): this {
		const thisTrade = this.data.trades.find(t => t.id === id);
		if (!thisTrade) return this;
		thisTrade.out += amount;
		return this;
	}

	public addTradesIn(id: string, amount: number): this {
		const thisTrade = this.data.trades.find(t => t.id === id);
		if (!thisTrade) return this;
		thisTrade.in += amount;
		return this;
	}

	public override save(options?: UserCircuitSaveOptions) {
		const { command, xp, space } = options ?? {};
		if (command) this.setLastCommand(command);
		if (xp) {
			this.addXp(NumberUtils.randomNumber(1, 3));
			if (space) this.expandSpace(55);
		}

		return super.save();
	}
}

export interface UserCircuitSaveOptions {
	/**
	 * Whether to calculate experience gain or not.
	 */
	xp?: boolean;
	/**
	 * Whether to increase bank space or not.
	 * @default true
	 */
	space?: boolean;
	/**
	 * The command to save after using it.
	 * Take note that it also increments the command's usage.
	 */
	command?: string;
}

declare module 'discord.js' {
	interface User {
		client: SapphireClient;
		db: UserCircuit;
	}
}