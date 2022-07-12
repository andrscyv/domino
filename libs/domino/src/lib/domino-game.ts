import { Game } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import {
  getNextPlayer,
  getPlayerWithNoTiles,
  getSuitsAtEnds,
  getTeamWithFewerPoints,
  nextState,
  tileIsPlayable,
} from './domino-lib';

export const DominoGame: Game = {
  setup: () => {
    // const tiles = buildTiles()
    return {
      // tilesByPlayer: dealTiles(ctx.random.Shuffle(tiles)),
      tilesByPlayer: [
        [
          [0, 0], //, [6, 6]
        ],
        [
          [1, 1],
          [2, 1],
          [3, 1],
        ],
        [
          [1, 4],
          [2, 4],
          [3, 6],
        ],
        [
          [1, 5],
          [2, 5],
          [3, 5],
        ],
      ],
      tilesPlayed: [[0, 6]],
      // tilesPlayed: []
    };
  },
  moves: {
    playTile: (G, ctx, move) => {
      const { tilesPlayed } = G;
      const { currentPlayer } = ctx;
      const { tile } = move;
      const suitsAtEnds = getSuitsAtEnds(tilesPlayed);

      if (tileIsPlayable(tile, suitsAtEnds)) {
        const nextG = nextState(G, { ...move, player: ctx.currentPlayer });
        const nextSuitsAtEnds = getSuitsAtEnds(nextG.tilesPlayed);
        const nextPlayer = getNextPlayer(
          +currentPlayer,
          nextG.tilesByPlayer,
          nextSuitsAtEnds
        );

        if (nextPlayer >= 0) {
          ctx.events?.endTurn({ next: nextPlayer + '' });
        } else {
          ctx.events?.endTurn();
        }

        return nextG;
      } else {
        return INVALID_MOVE;
      }
    },
    pass: (G, ctx) => {
      ctx.events?.endTurn();
    },
    chooseFirstPlayer: (G, ctx, firstPlayerId) => {
      ctx.events?.endTurn({ next: firstPlayerId });
    },
  },
  endIf: (G, ctx) => {
    const { tilesByPlayer, tilesPlayed } = G;
    const { currentPlayer } = ctx;

    if (tilesPlayed.length === 0) {
      return;
    }

    const suitsAtEnds = getSuitsAtEnds(tilesPlayed);
    const winner = getPlayerWithNoTiles(tilesByPlayer);
    if (winner >= 0) {
      return { winner };
    }

    const nextPlayer = getNextPlayer(
      +currentPlayer,
      tilesByPlayer,
      suitsAtEnds
    );

    if (nextPlayer < 0) {
      const teamWithFewerPoints = getTeamWithFewerPoints(tilesByPlayer);
      if (teamWithFewerPoints >= 0) {
        return { winner: teamWithFewerPoints };
      }
    }
  },
};
