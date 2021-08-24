import { Bundle, BaseProfile } from '#db/Bundle';
import { Document } from 'mongoose';

/**
 * Chainable methods to manage a document.
 * @since 4.0.0
 */
export class Circuit<T extends BaseProfile> {
  /**
   * The bundle who owns this circuit.
   */
  public bundle: Bundle<T>;
  /**
   * The data to manage.
   */
  public data: T;
  public constructor(bundle: Bundle<T>, data: T) {
    this.bundle = bundle;
    this.data = data;
  }

  /**
   * Save any modifications created by this circuit.
   */
  public async save(): Promise<this> {
    await this.data.save();
    return this;
  }
}