import type { PieceContext, AliasPieceOptions } from '@sapphire/framework';
import type { QuestStore } from './QuestStore';
import { AliasPiece } from '@sapphire/framework';

/**
 * The base quest options.
 */
export interface QuestOptions {
  /**
   * Represents the assets of a quest.
   */
	assets: QuesAssets;
  /**
   * The configuration for a quest.
   */
	config: QuestConfig;
  /**
   * The possible rewards of this quest.
   */
	rewards: QuestRewards;
}

export interface Quest extends AliasPiece {
	store: QuestStore;
}

/**
 * Base class for all quests.
 * @since 2.0.0
 */
export class Quest extends AliasPiece {
	public constructor(context: PieceContext, options: QuestOptions) {
		super(context, options.assets);
	}
}

/**
 * All quest difficulties.
 */
export const enum QuestDifficulty {
  NORMAL = 1,
  MEDIUM,
  HARD,
  CHALLENGE,
  NIGHTMARE
}

/**
 * Contains information users can read or do about this quest.
 */
export interface QuestAssets extends AliasPieceOptions {
  /**
   * The target amount to accomplish this quest.
   */
  target: number;
  /**
   * The difficulty of this quest.
   */
  difficulty: QuestDifficulty;
  /**
   * The information to display.
   */
  info: string;
}

/**
 * The configuration of this quest.
 */
export interface QuestConfig {
  challenge?: boolean;
  expiration: number;
}

/**
 * The possible rewards for this quest.
 */
export interface QuestRewards {
  /**
   * Amount of quest boxes they would get.
   */
  boxes: number;
  /**
   * Possible amount of coins they would get.
   */
  coins?: number;
  /**
   * Possible keys they would get.
   */
  keys?: number;
}