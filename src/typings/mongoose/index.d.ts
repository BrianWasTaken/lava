/**
 * Global mongoose bs.
 */
export declare global {
	import { Snowflake } from 'discord.js';
	import { Document } from 'mongoose';

	interface BaseProfile extends Document {
		/**
		 * The user id.
		 */
		_id: Snowflake;
	}
	
	interface DataSlot {
		/**
		 * The id of this slot.
		 */
		id: string;
	}
}