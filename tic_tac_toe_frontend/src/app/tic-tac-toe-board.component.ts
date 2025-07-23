import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * TicTacToeBoardComponent presents the 3x3 grid, emits cell clicks,
 * and highlights the winning combination.
 */
@Component({
  selector: 'tic-tac-toe-board',
  templateUrl: './tic-tac-toe-board.component.html',
  styleUrl: './tic-tac-toe-board.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class TicTacToeBoardComponent {
  /** Board state: an array of 9 cells, each 'X', 'O', or null */
  @Input() board: ('X' | 'O' | null)[] = Array(9).fill(null);
  /** Indices of winning cells to highlight */
  @Input() winningCombo: number[] | null = null;
  /** Whether the board is currently disabled */
  @Input() disabled: boolean = false;
  /** Emits the index of the cell clicked */
  @Output() cellMove = new EventEmitter<number>();

  // PUBLIC_INTERFACE
  handleCellClick(idx: number) {
    /** Called when a cell is clicked; emits cellMove event if enabled. */
    if (!this.disabled && !this.board[idx]) {
      this.cellMove.emit(idx);
    }
  }

  // PUBLIC_INTERFACE
  isWinningCell(idx: number): boolean {
    /** Returns true if cell is part of the winning combination. */
    return this.winningCombo ? this.winningCombo.includes(idx) : false;
  }
}
