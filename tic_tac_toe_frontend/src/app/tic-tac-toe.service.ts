/* eslint-disable no-undef */
import { Injectable } from '@angular/core';

/**
 * Service to handle Tic Tac Toe game logic, moves, AI and game state.
 */
@Injectable({ providedIn: 'root' })
export class TicTacToeService {
  /** Board is an array of 9 cells: 'X', 'O', or null */
  board!: ('X' | 'O' | null)[];
  /** Current player: 'X' or 'O' (X always starts matches) */
  currentPlayer!: 'X' | 'O';
  /** Game mode: '2p' = 2 players, 'ai' = vs AI */
  mode: '2p' | 'ai';
  /** Winner: 'X', 'O', or null for ongoing/tied games */
  winner!: 'X' | 'O' | null;
  /** Board indices of winner cells, or null */
  winningCombo!: number[] | null;
  /** True when game is finished */
  gameOver!: boolean;
  /** True if playing against AI and it's the AI's turn */
  aiThinking!: boolean;

  /** Winning lines for reference */
  private winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];

  constructor() {
    this.mode = '2p';
    this.reset();
  }

  // PUBLIC_INTERFACE
  setMode(mode: '2p'|'ai') {
    /** Set game mode and reset. */
    this.mode = mode;
    this.reset();
  }

  // PUBLIC_INTERFACE
  reset(): void {
    /** Resets board state and current player. */
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.winningCombo = null;
    this.gameOver = false;
    this.aiThinking = false;
  }

  // PUBLIC_INTERFACE
  makeMove(idx: number): boolean {
    /** Attempt a move; returns success, checks winner & triggers AI as needed. */
    if (this.gameOver || this.board[idx]) return false;
    this.board[idx] = this.currentPlayer;
    this.checkGameOver();
    if (!this.gameOver) {
      this.switchPlayer();
      if (this.mode === 'ai' && this.currentPlayer === 'O') {
        this.aiPlay();
      }
    }
    return true;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  checkGameOver() {
    for (const pattern of this.winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[b] === this.board[c]
      ) {
        this.winner = this.board[a];
        this.winningCombo = pattern;
        this.gameOver = true;
        return;
      }
    }
    if (this.board.every(cell => cell)) {
      this.winner = null;
      this.winningCombo = null;
      this.gameOver = true;
    }
  }

  // PUBLIC_INTERFACE
  /** Called only in AI mode, when it's O's turn; makes AI move with a little delay */
  aiPlay(): void {
    this.aiThinking = true;
    setTimeout(() => {
      const aiMove = this.findAIMove();
      this.board[aiMove] = 'O';
      this.checkGameOver();
      this.aiThinking = false;
      if (!this.gameOver) {
        this.switchPlayer();
      }
    }, 550); // slight delay for user feel
  }

  // Minimax (depth-limited for TicTacToe)
  private findAIMove(): number {
    // 1. Win if possible
    for (let i = 0; i < 9; i++) {
      if (!this.board[i]) {
        this.board[i] = 'O';
        this.checkGameOver();
        if (this.winner === 'O') {
          this.board[i] = null;
          this.winner = null;
          this.winningCombo = null;
          this.gameOver = false;
          return i;
        }
        this.board[i] = null;
        this.winner = null;
        this.winningCombo = null;
        this.gameOver = false;
      }
    }
    // 2. Block X's win
    for (let i = 0; i < 9; i++) {
      if (!this.board[i]) {
        this.board[i] = 'X';
        this.checkGameOver();
        if (this.winner === 'X') {
          this.board[i] = null;
          this.winner = null;
          this.winningCombo = null;
          this.gameOver = false;
          return i;
        }
        this.board[i] = null;
        this.winner = null;
        this.winningCombo = null;
        this.gameOver = false;
      }
    }
    // 3. Pick center
    if (!this.board[4]) return 4;
    // 4. Pick a random corner
    const corners = [0,2,6,8].filter(i => !this.board[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    // 5. Pick first empty side
    const sides = [1,3,5,7].filter(i => !this.board[i]);
    return sides.length ? sides[0] : this.board.findIndex(cell => !cell);
  }
}
