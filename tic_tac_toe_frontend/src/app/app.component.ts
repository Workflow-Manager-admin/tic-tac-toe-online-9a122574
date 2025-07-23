import { Component } from '@angular/core';
import { TicTacToeService } from './tic-tac-toe.service';
import { TicTacToeBoardComponent } from './tic-tac-toe-board.component';

/**
 * Root app component. Renders the game UI: status bar, board, controls.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TicTacToeBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tic Tac Toe';

  constructor(public ttt: TicTacToeService) {}

  // PUBLIC_INTERFACE
  get statusText(): string {
    /** Returns the game status or winner/tie message. */
    if (this.ttt.gameOver) {
      if (this.ttt.winner === 'X') {
        return 'Player 1 (X) wins! 🎉';
      }
      if (this.ttt.winner === 'O') {
        return this.ttt.mode === 'ai'
          ? 'AI (O) wins! 🤖'
          : 'Player 2 (O) wins! 🎉';
      }
      return 'It\'s a tie! 🤝';
    }
    if (this.ttt.mode === 'ai' && this.ttt.currentPlayer === 'O') {
      return 'AI is thinking...';
    }
    return this.ttt.currentPlayer === 'X'
      ? 'Player 1 (X), your move!'
      : this.ttt.mode === 'ai'
        ? 'AI (O) is playing...'
        : 'Player 2 (O), your move!';
  }

  // PUBLIC_INTERFACE
  onCellMove(idx: number) {
    /** Called after a user clicks a cell. */
    if (
      !this.ttt.gameOver &&
      !this.ttt.aiThinking &&
      !this.ttt.board[idx]
    ) {
      this.ttt.makeMove(idx);
    }
  }

  // PUBLIC_INTERFACE
  setMode(mode: '2p'|'ai') {
    this.ttt.setMode(mode);
  }

  // PUBLIC_INTERFACE
  reset() {
    this.ttt.reset();
  }
}
