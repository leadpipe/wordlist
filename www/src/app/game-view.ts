import './events';
import './game-timer';
import './grid-view';
import './mat-icon';
import './meta-panel';
import './solution-word';

import {css, html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {repeat} from 'lit/directives/repeat.js';
import {EventType, logEvent} from '../analytics';
import {D4, d4Flipped, d4Rotation} from '../game/d4';
import {GameState} from '../game/game-state';
import {PuzzleId, toIsoDateString} from '../game/puzzle-id';
import {WordJudgement} from '../game/types';
import {openWordgridDb} from '../game/wordgrid-db';
import {requestPuzzle} from '../puzzle-service';
import {GridResultMessage} from '../worker/worker-types';
import {InputWords} from './events';
import {
  getCurrentSystemTheme,
  getShowTimer,
  prefsTarget,
  setPreferredTheme,
} from './prefs';
import {GRID_TRANSFORM_TRANSITION, MAY_SCROLL_CLASS} from './styles';
import {Theme, ThemeOrAuto} from './types';
import {renderCount, renderCounts, saveGame} from './utils';

interface GridTransition {
  className: string;
  updateGrid: () => void;
}

/** Encapsulates the entire game page. */
@customElement('game-view')
export class GameView extends LitElement {
  static override styles = [
    MAY_SCROLL_CLASS,
    css`
      :host {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding-top: var(--page-grid-gap);
        display: grid;
        grid-template-columns: 1fr var(--grid-side-extent) 1fr;
        grid-template-rows: min-content auto;
        gap: var(--page-grid-gap);
        --page-grid-gap: 8px;
        --grid-spec-size: 6;
        --grid-optimal-cell-side-extent: 250px;
        --below-grid-height: 80px;
        --controls-height: calc(25px + 16px);
        --summary-height: 74px;
        --found-height: 100px;
        --found-width: 6em;
        --grid-optimal-width: calc(
          var(--grid-spec-size) * var(--grid-optimal-cell-side-extent)
        );
        --base-grid-side-extent: var(--grid-optimal-width);
        /* Horizontal layout */
        --grid-side-extent: min(
          var(--base-grid-side-extent),
          100vh - var(--below-grid-height) - var(--controls-height) - 2 *
            var(--page-grid-gap),
          100vw - 2 * var(--page-grid-gap) - 2 * var(--found-width)
        );
      }

      a {
        text-decoration: none;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
      }

      :host a {
        color: var(--text-color);
      }

      #controls {
        grid-column: 2;
        margin-bottom: 16px;
        display: flex;
        justify-content: center;
      }

      #controls > div {
        flex: 1 1 0;
        display: flex;
        justify-content: center;
        align-items: baseline;
        gap: 4px 16px;
      }

      #controls > div:nth-child(1) {
        justify-content: left;
      }

      #controls > div:nth-child(2) {
        flex: 2 1 0;
      }

      #controls > div:nth-child(3) {
        justify-content: right;
      }

      .d4-control {
        position: relative;
      }

      .d4-state {
        position: absolute;
        right: -5px;
        bottom: -5px;
        font-size: calc(max(30%, 10px));
      }

      #summary,
      #found {
        flex: 1 1 50%;
        padding: 24px 16px 0;
      }

      #summary {
        grid-column: 1;
        text-align: right;
      }

      #found {
        min-height: var(--found-height);
        column-width: var(--found-width);
        column-fill: auto;
        overflow-wrap: break-word;
        padding-left: 24px;
        text-indent: -8px;
      }

      #found div {
        line-height: 90%;
        padding: 4px 0;
      }

      grid-view {
        width: var(--grid-side-extent);
        height: var(--grid-side-extent);
      }

      grid-view.rotate {
        transform: rotate(90deg);
        transition: transform ${GRID_TRANSFORM_TRANSITION};
      }

      grid-view.flip {
        transform: scale(-1, 1);
        transition: transform ${GRID_TRANSFORM_TRANSITION};
      }

      grid-view.pause-changing {
        transform: scaleY(0);
        transition: transform 80ms;
      }

      grid-view.pause-changed {
        transform: scaleY(1);
        transition: transform 80ms;
      }

      @media (prefers-reduced-motion) {
        grid-view.rotate,
        grid-view.flip,
        grid-view.pause-changing,
        grid-view.pause-changed {
          transition: transform 1ms;
        }
      }

      #grid {
        grid-column: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 20px;
        flex: 0 0 0;
      }

      #below-grid {
        height: var(--below-grid-height);
        width: 100%;
        display: flex;
        align-items: center;
        user-select: none;
        -webkit-user-select: none;
      }

      #below-grid > * {
        text-align: center;
        flex: 3 1 0;
      }

      #below-grid > *:nth-child(odd) {
        flex: 1 1 0;
      }

      /* Vertical layout */
      @media (max-aspect-ratio: 7/8) {
        :host {
          --grid-side-extent: min(
            var(--base-grid-side-extent),
            100vw - 2 * var(--page-grid-gap),
            100vh - var(--below-grid-height) - var(--found-height) -
              var(--controls-height) - var(--summary-height) - 4 *
              var(--page-grid-gap)
          );
          grid-template-rows: min-content min-content min-content auto;
        }

        #summary,
        #found {
          grid-column: 2;
          padding-top: 0;
        }

        .opt-break {
          display: none;
        }
      }

      .impossible-word {
        color: orange;
      }

      .too-short-word {
        font-style: italic;
      }

      .duplicate-word {
        color: #777;
      }

      .found-new-word {
        color: green;
      }

      .duplicate-word,
      .found-new-word {
        font-weight: bold;
        font-size: 24px;
      }

      #expired div {
        display: flex;
        gap: 1rem;
      }

      #expired button {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    `,
  ];

  override render() {
    const {theme, gameState} = this;
    return [
      this.showTimerExpiredDialog ? this.renderTimerExpiredDialog() : '',
      this.renderControls(theme, gameState),
      this.renderSummary(gameState),
      this.renderGrid(theme, gameState),
      this.renderFoundWords(theme, gameState),
    ];
  }

  private renderTimerExpiredDialog(): TemplateResult {
    return html`
      <dialog id="expired" @keydown=${this.handleDialogKey}>
        <p>Time's up!</p>
        <p>
          You earned ${renderCount(this.gameState?.earnedPoints ?? 0, 'point')}.
        </p>
        <div>
          <button id="expired-quit" @click=${this.quit}>
            <mat-icon name="stop_circle"></mat-icon> Quit
          </button>
          <button id="expired-resume" @click=${this.resumePlay}>
            <mat-icon name="play_circle"></mat-icon> Keep playing
          </button>
        </div>
      </dialog>
    `;
  }

  private renderControls(
    theme: Theme,
    gameState: GameState | null
  ): TemplateResult {
    const newTheme =
      theme === getCurrentSystemTheme()
        ? theme === 'light'
          ? 'dark'
          : 'light'
        : 'auto';
    return html`
      <div id="controls">
        <div>
          <a @click=${this.goToHistory} title="Go to the history page">
            <mat-icon name="arrow_back"></mat-icon>
          </a>
        </div>
        <div>
          <a @click=${this.setTheme} title="Switch to ${newTheme} theme">
            <mat-icon
              name=${newTheme === 'auto' ? 'contrast' : `${newTheme}_mode`}
              data-theme=${newTheme}
            ></mat-icon>
          </a>
          ${gameState && !gameState.isPaused
            ? html`
                <a
                  @click=${this.rotatePuzzle}
                  title="Rotate puzzle"
                  class="d4-control"
                >
                  <mat-icon name="rotate_90_degrees_cw"></mat-icon>
                  <div class="d4-state">${d4Rotation(gameState.d4)}</div>
                </a>
                <a
                  @click=${this.flipPuzzle}
                  title="Flip puzzle"
                  class="d4-control"
                >
                  <mat-icon name="flip"></mat-icon>
                  <div class="d4-state">${Number(d4Flipped(gameState.d4))}</div>
                </a>
              `
            : ''}
        </div>
        <div><meta-panel></meta-panel></div>
      </div>
    `;
  }

  private renderSummary(gameState: GameState | null): TemplateResult {
    return html`
      <div id="summary">
        ${gameState
          ? html`
              <div>
                <b>${gameState.puzzleId.spec.minLength}</b> or more letters per
                word.
                <br class="opt-break" />
                ${getShowTimer()
                  ? html`
                      Earned ${renderCount(gameState.earnedPoints, 'point')}.
                    `
                  : ''}
              </div>
              <div>
                ${renderCounts(gameState.getWordCounts(), 'word')},
                <br />
                ${renderCounts(gameState.getWordPoints(), 'point')}.
              </div>
            `
          : ''}
      </div>
    `;
  }

  private renderGrid(
    theme: Theme,
    gameState: GameState | null
  ): TemplateResult {
    return html`
      <div id="grid">
        <grid-view
          theme=${theme}
          class=${classMap(this.gridTransitionClasses)}
          isInteractive
          .isPaused=${gameState?.isPaused ?? true}
          .puzzleId=${this.puzzleId}
          .puzzle=${this.puzzle}
          @words-traced=${this.wordsTraced}
          @words-selected=${this.wordsSelected}
          @transitionend=${this.handleGridTransition}
        ></grid-view>
        <div id="below-grid">
          ${this.loadingWords
            ? html`
                <div></div>
                <div>Loading words...</div>
                <div></div>
              `
            : gameState
            ? html`
                <game-timer
                  .gameState=${gameState}
                  @timer-ticked=${this.saveGame}
                  @timer-expired=${this.timerExpired}
                ></game-timer>
                ${this.pendingWords.length
                  ? html`
                      <div>
                        ${this.pendingWords.map(
                          (word, i) =>
                            html`<span
                              class=${this.judgementClass(
                                this.pendingWordsJudgements[i]
                              )}
                            >
                              ${word}
                            </span>`
                        )}
                      </div>
                      <div></div>
                    `
                  : gameState.isPaused
                  ? html`
                      <div>
                        ${gameState.isStarted
                          ? html`
                              <a @click=${this.resumePlay} title="Resume play">
                                <mat-icon
                                  name="play_circle"
                                  size="large"
                                ></mat-icon>
                              </a>
                            `
                          : html`
                              <a @click=${this.resumePlay} title="Start play">
                                <mat-icon
                                  name="not_started"
                                  size="large"
                                ></mat-icon>
                              </a>
                            `}
                      </div>
                      <div>
                        <a @click=${this.quit} title="Quit" class="right">
                          <mat-icon name="stop_circle" size="small"></mat-icon>
                        </a>
                      </div>
                    `
                  : html`
                      <div>
                        <a @click=${this.pausePlay} title="Pause play">
                          <mat-icon name="pause_circle" size="large"></mat-icon>
                        </a>
                      </div>
                      <div></div>
                    `}
              `
            : ''}
        </div>
      </div>
    `;
  }

  private renderFoundWords(
    theme: Theme,
    gameState: GameState | null
  ): TemplateResult {
    return html`
      <div id="found" class="may-scroll">
        ${repeat(
          this.gameState?.getFoundWords() ?? [],
          word => word,
          word => html`
            <div>
              <solution-word
                word=${word}
                theme=${this.theme}
                .category=${this.puzzle!.words.get(word) ?? null}
                .expand=${word === this.latestWord}
              ></solution-word>
            </div>
          `
        )}
      </div>
    `;
  }

  @property({reflect: true}) theme: Theme = 'light';
  @property({
    attribute: false,
    hasChanged: (value?: PuzzleId, oldValue?: PuzzleId) =>
      value?.seed !== oldValue?.seed,
  })
  puzzleId: PuzzleId = PuzzleId.daily();
  @property({type: Boolean}) resumeImmediately = false;
  @property({type: Boolean}) loadingWords = true;
  @query('#found') found?: HTMLElement;
  @query('dialog') dialog?: HTMLDialogElement;
  @query('#expired-resume') expiredResumeButton?: HTMLButtonElement;
  @query('#expired-quit') expiredQuitButton?: HTMLButtonElement;

  @state() private puzzle: GridResultMessage | null = null;
  @state() private showTimerExpiredDialog = false;
  private gameState: GameState | null = null;
  private readonly db = openWordgridDb();

  private readonly foregroundnessHandler = () => {
    if (document.visibilityState !== 'visible') {
      this.pauseGame(/*auto=*/ true, 'foregroundness');
    }
  };

  private readonly windowBlurHandler = () => {
    this.pauseGame(/*auto=*/ true, 'window blur');
  };

  private lastInteraction = new Date();
  private noteInteraction() {
    this.lastInteraction = new Date();
  }

  private readonly spacebarHandler = (event: KeyboardEvent) => {
    this.noteInteraction();
    if (event.key === ' ') {
      if (this.gameState?.isPaused) {
        this.resumePlay();
      } else {
        this.pauseGame(/*auto=*/ false, 'spacebar');
      }
    }
  };

  private readonly showTimerHandler = () => {
    this.requestUpdate();
  };

  private readonly gridTransitionQueue: GridTransition[] = [];
  private pendingGridTransition?: GridTransition;
  @state() private gridTransitionClasses: Record<string, boolean> = {};
  private handleGridTransition(_event: Event) {
    const {pendingGridTransition} = this;
    if (pendingGridTransition) {
      const gridTransitionClasses = {...this.gridTransitionClasses};
      delete gridTransitionClasses[pendingGridTransition.className];
      this.gridTransitionClasses = gridTransitionClasses;
      this.pendingGridTransition = undefined;
      pendingGridTransition.updateGrid();
    }
    setTimeout(() => this.runGridTransition());
  }

  private runGridTransition() {
    if (this.pendingGridTransition) return;
    if (!this.gridTransitionQueue.length) return;
    this.pendingGridTransition = this.gridTransitionQueue.shift();
    this.gridTransitionClasses = {...this.gridTransitionClasses};
    this.gridTransitionClasses[this.pendingGridTransition?.className!] = true;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('visibilitychange', this.foregroundnessHandler);
    window.addEventListener('blur', this.windowBlurHandler);
    window.addEventListener('keydown', this.spacebarHandler);
    prefsTarget.addEventListener('show-timer', this.showTimerHandler);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener(
      'visibilitychange',
      this.foregroundnessHandler
    );
    window.removeEventListener('blur', this.windowBlurHandler);
    window.removeEventListener('keydown', this.spacebarHandler);
    prefsTarget.removeEventListener('show-timer', this.showTimerHandler);
  }

  protected override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('puzzleId')) {
      this.requestAndLoadPuzzle();
    }
  }

  private handleDialogKey(event: KeyboardEvent) {
    switch (event.key) {
      case 'Tab':
        return; // Allow the default handling for tabs.
      case 'Escape':
        // Don't close the dialog, but do focus the Quit button.
        this.expiredQuitButton?.focus();
        break;
      case 'Enter':
      case ' ':
        (event.target as HTMLElement | null)?.click(); // Treat the same as a click.
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  private setTheme(event: Event) {
    const theme = (event.target as HTMLElement).dataset.theme;
    setPreferredTheme(theme as ThemeOrAuto);
  }

  private async requestAndLoadPuzzle() {
    const {puzzleId} = this;
    this.puzzle = null;
    this.gameState = null;
    this.style.setProperty('--grid-spec-size', puzzleId.spec.size.toString());
    const puzzle = await requestPuzzle(puzzleId);
    if (this.puzzleId.seed !== puzzleId.seed) {
      // We've been superseded
      return;
    }
    this.loadPuzzle(puzzle, puzzleId);
  }

  private async loadPuzzle(puzzle: GridResultMessage, puzzleId: PuzzleId) {
    const db = await this.db;
    const record = await db.get('games', puzzle.message.seed);
    if (record) {
      this.gameState = GameState.fromDbRecord(record, puzzle);
    } else {
      this.gameState = new GameState(puzzleId, puzzle);
    }
    this.puzzle = this.gameState.puzzle;
    if (this.gameState.isComplete) {
      this.redirectToHistory();
    } else if (this.resumeImmediately) {
      this.gameState.resume();
    }
  }

  /** Saves the game state to the database, if it has been started. */
  private async saveGame() {
    const {gameState} = this;
    if (!gameState || !gameState.lastPlayed) return;
    await saveGame(await this.db, gameState);
  }

  private async timerExpired(event: CustomEvent<boolean>) {
    if (!event.detail) return; // Timer wasn't showing
    if (this.pendingWords.length) {
      this.addWords(this.pendingWords, true);
    }
    await this.pauseGameAsync();
    this.showTimerExpiredDialog = true;
    await 0; // Let the dialog be rendered
    this.dialog?.showModal();
    this.expiredResumeButton?.focus();
  }

  private async goToHistory() {
    await this.saveGame();
    this.redirectToHistory();
    logEvent(EventType.ACTION, {category: 'go to history'});
  }

  private resumePlay() {
    this.showTimerExpiredDialog = false;
    this.noteInteraction();
    this.gridTransitionQueue.push({
      className: 'pause-changing',
      updateGrid: () => {
        const {gameState} = this;
        if (gameState) {
          gameState.resume();
          logEvent(EventType.ACTION, {category: 'resume'});
        }
        this.gridTransitionQueue.push({
          className: 'pause-changed',
          updateGrid: () => {},
        });
      },
    });
    this.runGridTransition();
  }

  private pausePlay() {
    this.noteInteraction();
    this.pauseGame(/*auto=*/ false, 'button');
  }

  private async pauseGameAsync(timestamp?: number, update = true) {
    this.gameState?.pause(timestamp);
    if (update) this.requestUpdate();
    await this.saveGame();
    logEvent(EventType.ACTION, {category: 'pause'});
  }

  pauseGame(auto: boolean, why: string) {
    if (this.gameState?.isPaused || this.classList.contains('pause-changing')) {
      return;
    }
    const now = new Date();
    const today = toIsoDateString(now);
    const activeDate = toIsoDateString(this.lastInteraction);
    let timestamp = now.getTime();
    if (today !== activeDate) {
      // All of this date-checking is another attempt to squash the bug where
      // leaving yesterday's puzzle going brings that puzzle back today instead
      // of going to today's daily puzzle.
      timestamp = this.lastInteraction.getTime();
      logEvent(EventType.ACTION, {category: 'pause-next-day', detail: why});
    }
    const updateGrid = () => {
      this.pauseGameAsync(timestamp, false);
      this.gridTransitionQueue.push({
        className: 'pause-changed',
        updateGrid: () => {},
      });
    };
    if (auto) {
      updateGrid();
    } else {
      this.gridTransitionQueue.push({
        className: 'pause-changing',
        updateGrid,
      });
    }
    this.runGridTransition();
  }

  private async quit() {
    this.showTimerExpiredDialog = false;
    this.gameState?.markComplete();
    await this.saveGame();
    this.redirectToHistory();
    logEvent(EventType.ACTION, {category: 'quit'});
  }

  private rotatePuzzle(_event: Event) {
    this.noteInteraction();
    this.gridTransitionQueue.push({
      className: 'rotate',
      updateGrid: () => {
        const {gameState} = this;
        if (gameState) {
          this.puzzle = gameState.applyD4(D4.R);
          logEvent(EventType.ACTION, {category: 'rotate'});
          this.saveGame();
        }
      },
    });
    this.runGridTransition();
  }

  private flipPuzzle(_event: Event) {
    this.noteInteraction();
    this.gridTransitionQueue.push({
      className: 'flip',
      updateGrid: () => {
        const {gameState} = this;
        if (gameState) {
          this.puzzle = gameState.applyD4(D4.F);
          logEvent(EventType.ACTION, {category: 'flip'});
          this.saveGame();
        }
      },
    });
    this.runGridTransition();
  }

  @state() private pendingWords: readonly string[] = [];
  private pendingWordsJudgements: WordJudgement[] = [];
  private pendingWordsTimeoutId = 0;
  @state() private latestWord = '';

  private clearPendingWordsTimeout() {
    if (this.pendingWordsTimeoutId) {
      window.clearTimeout(this.pendingWordsTimeoutId);
      this.pendingWordsTimeoutId = 0;
    }
  }

  private wordsTraced(event: CustomEvent<InputWords>) {
    this.noteInteraction();
    this.pendingWords = event.detail.words;
    this.pendingWordsJudgements = event.detail.words.map(
      word =>
        this.gameState?.judgeWord(word, event.detail.checkPossible) ??
        WordJudgement.NOT_A_WORD
    );
    this.clearPendingWordsTimeout();
  }

  private wordsSelected(event: CustomEvent<InputWords>) {
    this.addWords(event.detail.words, event.detail.checkPossible ?? false);
  }

  private addWords(words: readonly string[], checkPossible: boolean) {
    this.noteInteraction();
    this.pendingWords = words;
    this.pendingWordsJudgements = words.map(
      word =>
        this.gameState?.addFoundWord(word, checkPossible) ??
        WordJudgement.NOT_A_WORD
    );
    this.clearPendingWordsTimeout();
    const newWordIndex = this.pendingWordsJudgements.findIndex(
      j => j === WordJudgement.WORD
    );
    if (newWordIndex >= 0) {
      this.latestWord = words[newWordIndex];
      this.found?.scrollTo({left: 0, behavior: 'smooth'});
      this.saveGame();
      if (this.gameState?.isComplete) {
        this.redirectToHistory();
      }
    } else {
      const oldWordIndex = this.pendingWordsJudgements.findIndex(
        j => j === WordJudgement.DUPLICATE
      );
      if (oldWordIndex >= 0) {
        this.latestWord = words[oldWordIndex];
        const el = this.shadowRoot?.querySelector(
          `solution-word[word=${this.latestWord}]`
        );
        window.setTimeout(() => {
          el?.scrollIntoView({behavior: 'smooth'});
        });
      }
    }
    this.pendingWordsTimeoutId = window.setTimeout(() => {
      this.pendingWords = [];
    }, 1000);
  }

  private judgementClass(judgement: WordJudgement): string {
    switch (judgement) {
      case WordJudgement.TOO_SHORT:
        return 'too-short-word';
      case WordJudgement.NOT_A_WORD:
      default:
        return 'not-a-word';
      case WordJudgement.DUPLICATE:
        return 'duplicate-word';
      case WordJudgement.WORD:
        return 'found-new-word';
      case WordJudgement.IMPOSSIBLE:
        return 'impossible-word';
    }
  }

  private redirectToHistory() {
    this.dispatchEvent(
      new CustomEvent('show-history', {
        detail: {puzzleId: this.puzzleId},
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'game-view': GameView;
  }
}
