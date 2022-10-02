import * as wasm from '../../../crate/pkg/leadpipe_wordgrid';
import {
  MakeGridMessage,
  ToWorkerMessageType,
  WORDS_VERSION,
} from '../worker/worker-types';
import {
  GameSpec,
  gameSpecByGridSize,
  isValidGridSize,
  randomGameSpec,
} from './game-spec';

/**
 * Identifies a Wordgrid puzzle.  A puzzle ID consists of:
 * - the version of the words file (`N` in words-vN.txt)
 * - a calendar date, in ISO YYYY-MM-DD form
 * - one of the standard Wordgrid game sizes (4, 5, 6 or S, M, L)
 * - an integer counter, generally starting at 1
 *
 * In string form, these parts are joined together with colons separating the
 * parts.  For example: `1:1776-07-04:5:2`.  This is Medium puzzle #2 of July
 * 4th, 1776 (using v1 of the words file).
 *
 * Note that in the code we use the words `puzzleId` and `seed` interchangeably
 * to refer to this string form of puzzle IDs.  And we also use `puzzleId` to
 * refer to these PuzzleId objects.  The term `seed` comes about because we use
 * the ID string to seed our random number generator, to create the puzzle.
 */
export class PuzzleId {
  constructor(
    readonly version: number,
    readonly dateString: string,
    readonly spec: GameSpec,
    readonly counter: number
  ) {
    if (!isValidDateString(dateString)) {
      throw new Error(`Invalid date string '${dateString}'`);
    }
  }

  /**
   * Returns the random seed string to use for this puzzle ID.
   */
  get seed(): string {
    return `${this.version}:${this.dateString}:${this.spec.size}:${this.counter}`;
  }

  /**
   * Returns a puzzle ID that's the same as this one except for the counter,
   * which is one larger.
   * @returns The next puzzle ID for the same date, version, and game size.
   */
  next(): PuzzleId {
    return new PuzzleId(
      this.version,
      this.dateString,
      this.spec,
      1 + this.counter
    );
  }

  /**
   * Creates a message to send to the shared words worker to tell it to make
   * this puzzle.
   * @returns The shared-worker message to make this puzzle.
   */
  toMakeGridMessage(): MakeGridMessage {
    return {
      type: ToWorkerMessageType.MAKE_GRID,
      version: this.version,
      seed: this.seed,
      size: this.spec.size,
      minLength: this.spec.minLength,
    };
  }

  /**
   * Returns the ID to use for today's daily puzzle.  You may specify the date
   * to use instead of today.
   * @returns The ID for the daily puzzle.
   */
  static daily(today = new Date()): PuzzleId {
    const random = new wasm.JsRandom(toIsoDateString(today));
    const spec = randomGameSpec(random);
    random.free();
    return PuzzleId.forSpec(spec, today);
  }

  /**
   * Makes a puzzle ID for the given game specification, letting you provide the
   * date and/or counter if you like.
   * @param spec The game spec.
   * @param date The date; defaults to today.
   * @param counter The counter; defaults to 1.
   * @returns The specified puzzle ID.
   */
  static forSpec(spec: GameSpec, date = new Date(), counter = 1) {
    return new PuzzleId(WORDS_VERSION, toIsoDateString(date), spec, counter);
  }

  /**
   * Parses the given seed string, which must be of the form generated by the
   * `seed` property.
   * @param seed The seed string to parse back into the corresponding puzzle ID.
   * @throws Error if the string didn't come from PuzzleId.
   */
  static fromSeed(seed: string): PuzzleId {
    const parts = seed.split(':');
    if (parts.length === 4) {
      const version = Number(parts[0]);
      const dateString = parts[1];
      const size = Number(parts[2]);
      const counter = Number(parts[3]);
      if (
        !isNaN(version) &&
        isValidDateString(dateString) &&
        isValidGridSize(size) &&
        !isNaN(counter)
      ) {
        return new PuzzleId(
          version,
          dateString,
          gameSpecByGridSize(size)!,
          counter
        );
      }
    }
    throw new Error(`Seed string does not appear to be from PuzzleId: ${seed}`);
  }
}

/**
 * Converts the given date to the standard ISO format YYYY-MM-DD.  Uses the
 * local time zone.
 * @param date The date to convert to string form.
 * @returns The date in the ISO date format YYYY-MM-DD.
 */
export function toIsoDateString(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Tells whether the given string is a valid date string, in ISO format
 * YYYY-MM-DD.  It verifies that parsing the string produces a date whose ISO
 * date string is identical to the given string.
 * @param dateString The date string to test, in ISO format YYYY-MM-DD.
 * @returns whether parsing it to a date and converting it to ISO form yields
 * the same string.
 */
export function isValidDateString(dateString: string): boolean {
  const dateParts = dateString.split('-').map(Number);
  return (
    dateParts.length === 3 &&
    !dateParts.some(isNaN) &&
    toIsoDateString(new Date(dateParts[0], dateParts[1] - 1, dateParts[2])) ===
      dateString
  );
}
