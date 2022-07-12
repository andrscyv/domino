export type Tile = number[];
export type TilesByPlayer = Record<number, Tile[]>;
export function dealTiles(tiles: Tile[]) {
  const tilesByPlayer = [];

  for (let i = 0; i < 4; i++) {
    tilesByPlayer.push(tiles.slice(i * 7, i * 7 + 7));
  }

  return tilesByPlayer;
}

export function buildTiles(): Tile[] {
  const tiles = [];
  for (let i = 0; i < 7; i++) {
    for (let k = i; k < 7; k++) {
      tiles.push([i, k] as Tile);
    }
  }

  return tiles;
}

export function nextState(
  G: { tilesPlayed: Tile[]; tilesByPlayer: TilesByPlayer },
  {
    tile,
    playAtLeftEnd,
    player,
  }: { tile: Tile; playAtLeftEnd: boolean; player: number }
) {
  const tilesPlayed = deepCopy(G.tilesPlayed);
  const nextTilesByPlayer = deepCopy(G.tilesByPlayer);
  let nextTilesPlayed = [];
  const tileToPlay = [...tile];

  if (tilesPlayed.length === 0) {
    nextTilesPlayed = [tileToPlay];
  } else {
    const suitsAtEnds = getSuitsAtEnds(tilesPlayed);
    if (playAtLeftEnd) {
      if (suitsAtEnds[0] !== tileToPlay[1]) {
        tileToPlay.reverse();
      }
      nextTilesPlayed = [tileToPlay, ...tilesPlayed];
    } else {
      if (suitsAtEnds[1] !== tileToPlay[0]) {
        tileToPlay.reverse();
      }
      nextTilesPlayed = [...tilesPlayed, tileToPlay];
    }
  }

  nextTilesByPlayer[player] = nextTilesByPlayer[player].filter((t: Tile) => {
    return !areEqual(t, tile);
  });

  return {
    tilesPlayed: nextTilesPlayed,
    tilesByPlayer: nextTilesByPlayer,
  };
}

export function getSuitsAtEnds(tilesPlayed: Tile[]) {
  return tilesPlayed.length > 0
    ? [tilesPlayed[0][0], tilesPlayed[tilesPlayed.length - 1][1]]
    : [];
}

export function areEqual(tile1: Tile, tile2: Tile) {
  const firstIsSubsetOfSecond =
    tile2.includes(tile1[0]) && tile2.includes(tile1[1]);
  const secondIsSubsetOfFirst =
    tile1.includes(tile2[0]) && tile1.includes(tile2[1]);
  return firstIsSubsetOfSecond && secondIsSubsetOfFirst;
}

export function hasPlayableTile(playerTiles: Tile[], suitsAtEnds: number[]) {
  for (const tile of playerTiles) {
    if (tileIsPlayable(tile, suitsAtEnds)) {
      return true;
    }
  }

  return false;
}

export function tileIsPlayable(tile: Tile, suitsAtEnds: number[]) {
  return suitsAtEnds.length > 0
    ? suitsAtEnds.includes(tile[0]) || suitsAtEnds.includes(tile[1])
    : true;
}

export function getNextPlayer(
  currentPlayer: number,
  tilesByPlayer: TilesByPlayer,
  suitsAtEnds: number[]
) {
  for (let idx = currentPlayer + 1; idx <= currentPlayer + 4; idx++) {
    const player = idx % 4;
    if (hasPlayableTile(tilesByPlayer[player], suitsAtEnds)) {
      return player;
    }
  }
  return -1;
}

export function getPlayerWithNoTiles(tilesByPlayer: TilesByPlayer) {
  for (let i = 0; i < 4; i++) {
    if (tilesByPlayer[i].length === 0) {
      return i;
    }
  }
  return -1;
}

export function countPoints(playerTiles: Tile[]) {
  return playerTiles
    .map((tile: Tile) => tile[0] + tile[1])
    .reduce((prev: number, curr: number) => prev + curr, 0);
}

export function getTeamWithFewerPoints(tilesByPlayer: TilesByPlayer) {
  const pointsTeam0 = countPoints([...tilesByPlayer[0], ...tilesByPlayer[2]]);
  const pointsTeam1 = countPoints([...tilesByPlayer[1], ...tilesByPlayer[3]]);

  if (pointsTeam0 < pointsTeam1) {
    return 0;
  }
  if (pointsTeam0 > pointsTeam1) {
    return 1;
  }

  return -1;
}

function deepCopy(arr: unknown) {
  return JSON.parse(JSON.stringify(arr));
}
