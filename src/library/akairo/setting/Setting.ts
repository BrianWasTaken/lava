import { AbstractModule, AbstractModuleOptions } from 'lava/akairo';
import { SettingHandler } from '.';

export interface SettingOptions extends AbstractModuleOptions {
	/**
	 * The default value of this setting.
	 */
	default?: boolean;
	/**
	 * The cooldown of this setting in ms.
	 */
	cooldown?: number;
	/**
	 * Description for this setting.
	 */
	description: string;
}

export abstract class Setting extends AbstractModule {
	/**
	 * Cooldown for this setting to be enabled.
	 */
	public cooldown: number;
	/**
	 * Default enabled state of thsi setting.
	 */
	public default: boolean;
	/**
	 * The handler this agrument belongs to.
	 */
	public handler: SettingHandler;
	/**
	 * Description for this bull- ok enough swearing.
	 */
	public description: string;
	/**
	 * Construct a setting.
	 */
	public constructor(id: string, options: SettingOptions) {
		super(id, { name: options.name, category: options.category });
		/** @type {boolean} */
		this.default = options.default ?? false;
		/** @type {number} */
		this.cooldown = options.cooldown ?? 1000;
		/** @type {string} */
		this.description = options.description ?? 'No description provided.';
	}
}