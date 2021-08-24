/**
 * Array-specific utilities.
 * @since 4.0.0
 */
export class ArrayUtils extends null {
  /**
   * Extract one random item from an array.
   * @param array the array to extract from.
   */
  public static randomItem<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Exclude certain items from an array.
   * @param src the source array to exclude from.
   * @param exc the array of items to exclude.
   */
  public static deepFilter<T extends string | number | symbol>(src: readonly T[], exc: readonly T[]): T[] {
    return src.filter(s => !exc.some(f => f === s));
  }

  /**
   * Exclude certain items from an array.
   * @param array the array to extract items from.
   * @param amount amount of items to extract
   */
  public static randomItems<T extends string | number | symbol>(array: readonly T[], amount = 1): T[] {
    const randoms: T[] = [];

    for (const _ of array) {
      randoms.push(this.randomItem(this.deepFilter(array, randoms)));
    }

    return randoms.slice(0, amount);
  }

  /**
   * Shuffles the items of an array.
   * @param array the item to shuffle
   */
  public static shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }

  /**
   * Divide items of an array into chunks of arrays. 
   * @param array the array to paginate
   * @param size the amount of items per page
  */
  public static paginateArray<T>(array: readonly T[], size?: number): T[][] {
    const pages: T[][] = [];

    for (let i = 0, j = 0; i < Math.ceil(array.length / (size || 5)); i++) {
      pages.push(array.slice(j, j + (size || 5)));
      j = j + (size || 5);
    }

    return pages;
  }
}

/**
 * Date-specific utilities.
 * @since 4.0.0
 */
export class DateUtils extends null {
  /**
   * Time methods to use in parsing dates.
   */
  private static get methods(): TimeMethod[] {
    return [
      { name: ['mo', 'month'], count: 2592000 },
      { name: ['d', 'day'], count: 86400 },
      { name: ['h', 'hour'], count: 3600 },
      { name: ['m', 'minute'], count: 60 },
      { name: ['s', 'second'], count: 1 },
    ];
  }

  /**
   * Pluralize a time string from a certain count.
   * @param short Whether the parsed time was in short format.
   * @param str The string to pluralise, ignored when `short` is set to `true`.
   * @param num The number to check whether to pluralize the string or not.
   */
  private static pluralize(short: boolean, str: string, num: number) {
    return short || num <= 1 ? str : `${str}s`;
  }

  /**
   * Joins "and" onto our second to the last and last index of array.
   * @param arr the array to join with "and"
  */
  private static and(arr: string[]): string[] {
    const secondToLast = arr[arr.length - 2];
    const last = arr.pop();
    return [...arr.slice(0, arr.length - 1), [secondToLast, last].join(' and ')];
  }

  /**
   * Parse a javascript timestamp to human readable dates.
   * @param time the timestamp to parse in seconds
   * @param options the options for this parser
   */
  public static parseTime(time: number, options?: ParseTimeOptions): string {
    const { short = false, first = false } = options ?? {};
    const { methods, pluralize, and } = this;

    const pre = Math.floor(time / methods[0].count);
    const timeStr = [`${pre.toString()}${short ? '' : ' '}${pluralize(short, methods[0].name[short ? 0 : 1], pre)}`];
    for (let i = 0; i < methods.length - 1; i++) {
      const mathed = Math.floor((time % methods[i].count) / methods[i + 1].count);
      timeStr.push(`${mathed.toString()}${short ? '' : ' '}${pluralize(short, methods[i + 1].name[short ? 0 : 1], mathed)}`);
    }

    const filtered = timeStr.filter(ts => !ts.startsWith('0'));
    return filtered.length > 1 ? and(filtered).join(', ') : filtered[0];
  }
}

/**
 * Interface for time methods.
 */
export interface TimeMethod {
  /**
   * The short-long pair for the unit.
   */
  name: [string, string];
  /**
   * The count in seconds.
   */
  count: number;
}

/**
 * The options for the time parser.
 */
export interface ParseTimeOptions {
  /**
   * Whether to shorten the date strings.
   * @default false
   */
  short?: boolean;
  /**
   * Whether to return the first parsed date.
   * @default false
   */
  first?: boolean;
}

/**
 * Number-based utilities.
 * @since 4.0.0
 */
export class NumberUtils extends null {
  /**
   * Get a random number from 2 ends.
   * @param min the minimum possible number
   * @param max the maximum possible number
   */
  public static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Return a random color in decimal form.
   */
  public static randomColor(): number {
    return Math.random() * 0xffffff;
  }

  /**
   * Revert a roman numeral back to it's integer form.
   * @param roman the roman numeral
   */
  public static deromanize(roman: string): number {
    const _roman = [...roman];
    const romans = ['I', 'V', 'X', 'L', 'C', 'D', 'M'];
    const values = [1, 5, 10, 50, 100, 500, 1000];

    let result = 0;
    for (let i = 0; i < _roman.length; i++) {
      const current = values[romans.indexOf(_roman[i])];
      const next = values[romans.indexOf(_roman[i + 1])];

      if (current < next) {
        result += next - current;
        i++;
      } else {
        result += current;
      }
    }

    return result;
  }
}

/**
 * Promise-related functions.
 * @since 4.0.0
 */
export class Promises extends null {
  /**
   * Delay something up.
   * @param ms the time in seconds
   */
  public static sleep(ms: number): Promise<number> {
    return new Promise<number>(res => setTimeout(() => res(ms), ms));
  }
}

/**
 * Utilities for strings.
 * @since 4.0.0
 */
export class StringUtils extends null {
  /**
   * Converts any valid integer to a roman numeral.
   * @param int the integer to convert.
   */
  public static romanize(int: number): string {
    let romans = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    let roman = '';
    let index = 0;

    while (index < romans.length) {
      roman += romans[index].repeat(int / values[index]);
      int %= values[index]; index++;
    }

    return roman;
  };

  /**
   * Creates a unique progress bar with boxes.
   * @param percent a valid number between 1 and 10
   * @param filled a string as a filled character
   * @param empty a string as an empty character
   */
  public static progressBar(percent = 1, filled = '■', empty = '□'): string {
    return `${filled.repeat(percent)}${empty.repeat(10 - percent)}`;
  };
}