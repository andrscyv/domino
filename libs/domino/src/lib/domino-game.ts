import { Game } from 'boardgame.io';
import { INVALID_MOVE, Stage } from 'boardgame.io/core';
import {
  buildTiles,
  dealTiles,
  getNextPlayer,
  getPlayerWithNoTiles,
  getSuitsAtEnds,
  getTeamWithFewerPoints,
  nextState,
  tileIsPlayable,
} from './domino-lib';

export const DominoGame: Game = {
  turn: {
    activePlayers: { all: Stage.NULL, maxMoves: 1 },
  },
  setup: (ctx) => {
    const tiles = buildTiles();
    return {
      tilesByPlayer: dealTiles(ctx.random?.Shuffle(tiles) || tiles),
      // tilesByPlayer: [
      //   [
      //     [0, 0], //, [6, 6]
      //   ],
      //   [
      //     [1, 1],
      //     [2, 1],
      //     [3, 1],
      //   ],
      //   [
      //     [1, 4],
      //     [2, 4],
      //     [3, 6],
      //   ],
      //   [
      //     [1, 5],
      //     [2, 5],
      //     [3, 5],
      //   ],
      // ],
      // tilesPlayed: [[0, 6]],
      tilesPlayed: [],
    };
  },
  moves: {
    playTile: (G, ctx, move) => {
      const { tilesPlayed } = G;
      const { currentPlayer, playerID } = ctx;
      const { tile } = move;

      // We allow all players to make moves in the turn's config
      // so they can agree amongst themselves who plays the first tile.
      // Because of this, we have to check the players turn after the
      // first move
      const isNotFirstMove = (tilesPlayed || []).length !== 0;
      const isNotPlayersTurn = currentPlayer !== playerID;
      if (!playerID) {
        console.error('Falsy playerID');
        return INVALID_MOVE;
      }
      if (isNotFirstMove && isNotPlayersTurn) {
        return INVALID_MOVE;
      }

      const suitsAtEnds = getSuitsAtEnds(tilesPlayed);

      if (tileIsPlayable(tile, suitsAtEnds)) {
        const nextG = nextState(G, { ...move, player: playerID });
        const nextSuitsAtEnds = getSuitsAtEnds(nextG.tilesPlayed);
        const nextPlayer = getNextPlayer(
          +playerID,
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
    const { playerID } = ctx;

    if (!playerID) {
      console.error('Falsy playerID');
      return;
    }

    if (tilesPlayed.length === 0) {
      return;
    }

    const suitsAtEnds = getSuitsAtEnds(tilesPlayed);
    const winner = getPlayerWithNoTiles(tilesByPlayer);
    if (winner >= 0) {
      return { winner };
    }

    const nextPlayer = getNextPlayer(+playerID, tilesByPlayer, suitsAtEnds);

    if (nextPlayer < 0) {
      const teamWithFewerPoints = getTeamWithFewerPoints(tilesByPlayer);
      if (teamWithFewerPoints >= 0) {
        return { winner: teamWithFewerPoints };
      }
    }
  },
};
