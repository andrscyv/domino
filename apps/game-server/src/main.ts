import { Origins, Server } from 'boardgame.io/server';
import { DominoGame } from '@domino/domino';

const server = Server({
  games: [DominoGame],
  origins: Origins.LOCALHOST_IN_DEVELOPMENT,
});

server.run(8000);
