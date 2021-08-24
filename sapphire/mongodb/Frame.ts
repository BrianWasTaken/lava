import { Piece, AliasPiece } from '@sapphire/framework';
import { BaseProfile } from '#db/Bundle';
import { Circuit } from '#db/Circuit';

/**
 * The base interface to extend for a slot.
 */
export interface FrameInterface {
  /**
   * The id of the slot.
   */
  id: string;
}

/**
 * The frame for array-based objects to manage easier.
 * @since 4.0.0
 */
export abstract class Frame<P extends BaseProfile> {
  /**
   * The shortened circuit to manage unrelated things within this frame.
   */
  public circuit: Circuit<P>;
  /**
   * The id of this frame.
   */
  public id: FrameInterface['id'];
  public constructor(circuit: Circuit<P>, id: FrameInterface['id']) {
    this.circuit = circuit;
    this.id = id;
  }

  /**
   * The piece for this frame.
   */
  public abstract get piece(): Piece | undefined | null;
}