import { DominoClient } from '@domino/domino'

export default ({ _app }, inject) => {
  inject('game', new DominoClient())
}
