/**
 * Global mongoose bs.
 */
export declare global {
	import { Document } from 'mongoose';

	interface BaseProfile extends Document {
		/**
		 * The user id.
		 */
		_id: string;
	}
	
	interface DataSlot {
		/**
		 * The id of this slot.
		 */
		id: string;
	}
}