import type { AliasPieceOptions, PieceContext } from '@sapphire/framework';
import { AliasPiece } from '@sapphire/framework';

export interface DonationOptions extends AliasPieceOptions {
	/**
	 * The weekly goal for this kind of donation.
	 * Lava doesn't auto-ban the user from the server if they don't reach this goal, just to display their goal.
	 */
	goal: number;
}

/**
 * Base class for all types of donations.
 * @since 3.0.0
 */
export class Donation extends AliasPiece {
	/**
	 * The recommended goal every week.
	 */
	public goal: number;
	public constructor(context: PieceContext, options: DonationOptions) {
		super(context, options);
		this.goal = options.goal;
	}
}