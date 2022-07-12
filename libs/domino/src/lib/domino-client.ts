/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DominoGame } from './domino-game';

export class DominoClient {
  client: any;
  start(playerID: any, matchID: any, credentials: any) {
    this.client = Client({
      game: DominoGame,
      numPlayers: 4,
      // multiplayer: SocketIO({ server: '143.198.227.84:8000' }),
      multiplayer: SocketIO({
        server: process.env['GAME_SERVER_HOST'] || 'localhost:8000',
      }),
      playerID,
      matchID,
      credentials,
      debug: false,
    });
    this.client.start();
  }
}
