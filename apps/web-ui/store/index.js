import { LobbyClient } from 'boardgame.io/client';

const SERVER_HOST = process.env.NUXT_ENV_SERVER_HOST || 'http://localhost:8000';
const BASE_URL = process.env.NUXT_ENV_BASE_URL || 'http://localhost:3000';

const lobbyClient = new LobbyClient({ server: SERVER_HOST });
export const state = () => ({
  playerName: window.localStorage.getItem('app_playerName') || '',
  playerId: window.localStorage.getItem('app_playerId') || '',
  currentPlayerId: '',
  matchId: window.localStorage.getItem('app_matchId') || '',
  winnerId: '',
  playerCredentials: window.localStorage.getItem('app_playerCredentials') || '',
  baseUrl: BASE_URL,
  playerNames: ['', '', '', ''],
  tilesPlayed: [
    // [3, 6],
    // [6, 6],
    // [6, 2]
  ],
  playerTiles: [
    // {
    //   id: 1,
    //   pips: [1, 2],
    //   isSelected: false
    // },
    // {
    //   id: 2,
    //   pips: [4, 3],
    //   isSelected: false
    // },
    // {
    //   id: 3,
    //   pips: [6, 4],
    //   isSelected: false
    // },
    // {
    //   id: 4,
    //   pips: [1, 1],
    //   isSelected: false
    // },
    // {
    //   id: 5,
    //   pips: [6, 5],
    //   isSelected: false
    // },
    // {
    //   id: 6,
    //   pips: [2, 3],
    //   isSelected: false
    // },
    // {
    //   id: 7,
    //   pips: [0, 4],
    //   isSelected: false
    // }
  ],
  selectedTile: null,
  numTilesByPlayer: [0, 0, 0, 0],
  matchData: null,
});

export const mutations = {
  setPlayerName(state, playerName) {
    state.playerName = playerName;
    window.localStorage.setItem('app_playerName', playerName);
  },
  setPlayerId(state, playerId) {
    state.playerId = playerId;
    window.localStorage.setItem('app_playerId', playerId);
  },
  setMatchId(state, matchId) {
    state.matchId = matchId;
    window.localStorage.setItem('app_matchId', matchId);
  },
  setPlayerCredentials(state, playerCredentials) {
    state.playerCredentials = playerCredentials;
    window.localStorage.setItem('app_playerCredentials', playerCredentials);
  },
  setPlayerTiles(state, tiles) {
    state.playerTiles = tiles;
  },
  setPlayerTileSelected(state, { tileId, isSelected }) {
    const tile = state.playerTiles.find((tile) => tile.id === tileId);
    tile.isSelected = isSelected;
  },
  setSelectedTile(state, tile) {
    state.selectedTile = tile;
  },
  setGameState(state, gameState) {
    if (!gameState) {
      return;
    }
    if (!state.playerId) {
      return;
    }
    const { G, ctx } = gameState;
    const { gameover } = ctx;
    state.tilesPlayed = G.tilesPlayed;
    state.playerTiles = G.tilesByPlayer[parseInt(state.playerId)].map(
      (tile, idx) => {
        return {
          id: idx,
          pips: tile,
          isSelected: false,
        };
      }
    );
    state.currentPlayerId = ctx.currentPlayer;
    state.numTilesByPlayer = G.tilesByPlayer.map((tiles) => tiles.length);

    if (gameover) {
      state.winnerId = gameover.winner;
    }
    this.$game.client.matchData.forEach((player) => {
      if (player.name) {
        state.playerNames.splice(player.id, 1, player.name);
      }
    });
  },
  setMatchData(state, matchData) {
    state.matchData = matchData;
  },
};

export const getters = {
  matchUrl(state) {
    return `${state.baseUrl}/?matchId=${state.matchId}`;
  },
  playersInLobby(state) {
    return state.matchData?.players.filter((player) => player.name) || [];
  },
  playerHasJoinedGame(state) {
    return !!state.playerId || state.playerId === 0;
  },
};

export const actions = {
  playSelectedTile({ commit, state }, { playAtLeftEnd }) {
    if (!state.selectedTile) {
      return;
    }
    this.$game.client.moves.playTile({
      tile: state.selectedTile,
      playAtLeftEnd,
    });
    commit('setSelectedTile', null);
  },
  async createMatch({ commit }, { numPlayers }) {
    const { matchID } = await lobbyClient.createMatch('default', {
      numPlayers,
    });
    commit('setMatchId', matchID);
  },
  async joinMatch({ commit, state }, { playerID, playerName }) {
    let playerCredentials = null;
    try {
      const lobbyResponse = await lobbyClient.joinMatch(
        'default',
        state.matchId,
        {
          playerID,
          playerName,
        }
      );
      playerCredentials = lobbyResponse.playerCredentials;
    } catch (e) {
      if (e.message.includes('409')) {
        // if tried to join with another player's id , try other id of same team
        playerID = '' + (parseInt(playerID) + (2 % 4));
        const lobbyResponse = await lobbyClient.joinMatch(
          'default',
          state.matchId,
          {
            playerID,
            playerName,
          }
        );
        playerCredentials = lobbyResponse.playerCredentials;
      }
    }

    commit('setPlayerCredentials', playerCredentials);
    commit('setPlayerId', playerID);
    commit('setPlayerName', playerName);
  },
  async setNextMatchId({ commit, state }) {
    const { nextMatchID } = await lobbyClient.playAgain(
      'default',
      state.matchId,
      {
        playerID: state.playerId,
        credentials: state.playerCredentials,
      }
    );
    commit('setMatchId', nextMatchID);
  },
  async getMatchData({ commit, state }) {
    if (state.matchId) {
      const matchData = await lobbyClient.getMatch('default', state.matchId);
      commit('setMatchData', matchData);
    }
  },
  async clearMatchData({ commit, state }) {
    try {
      await lobbyClient.leaveMatch('default', state.matchId, {
        playerID: state.playerId,
        credentials: state.playerCredentials,
      });
    } catch (error) {}
    window.localStorage.removeItem('app_playerName');
    window.localStorage.removeItem('app_playerId');
    window.localStorage.removeItem('app_matchId');
    window.localStorage.removeItem('app_playerCredentials');
    commit('setPlayerCredentials', '');
    commit('setPlayerId', '');
    commit('setPlayerName', '');
    commit('setMatchId', '');
    commit('setMatchData', null);
  },
};
