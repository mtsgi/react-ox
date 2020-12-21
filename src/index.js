import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onTap}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.sq[i]}
        onTap={() => {this.props.onTap(i)}}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hist: [
        { sq: Array(9).fill(null) }
      ],
      step: 0,
      x: true
    }
  }

  handleTap(i) {
    const history = this.state.hist.slice(0, this.state.step + 1);
    const current = history[history.length - 1];
    const s = current.sq.slice();
    if (calcWinner(s) || s[i]) return;
    s[i] = this.state.x ? 'X' : 'O';
    this.setState({
      hist: history.concat([{ sq: s }]),
      step: history.length,
      x: !this.state.x
    });
  }

  jumpTo(step) {
    this.setState({
      step,
      x: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.hist;
    const current = history[this.state.step];
    const winner = calcWinner(current.sq);

    const moves = history.map((step, move) => {
      const label = move ?
        `#${move}へ戻る` :
        '最初から';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{label}</button>
        </li>
      );
    });
    let status;
    if (winner) status = `Winner: ${winner}`;
    else status = `Next player: ${this.state.x ? 'X' : 'O'}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            sq={current.sq}
            onTap={i => this.handleTap(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calcWinner(sq) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return sq[a];
    }
  }
  return null;
}
