<template>
  <div class="content">
    <div class="typewriter">
      <h1>Dominó.</h1>
    </div>
    <div class="user-form">
      <div class="form-input">
        <span> {{ $t('name') }} </span>
        <input
          id=""
          v-model="playerName"
          type="text"
          name=""
          :disabled="playerHasJoinedGame"
        />
      </div>
      <div class="form-input">
        <span> {{ $t('team') }} </span>
        <select v-model="team" :disabled="playerHasJoinedGame">
          <option value="red">
            {{ $t('team_r') }}
          </option>
          <option value="blue">
            {{ $t('team_b') }}
          </option>
        </select>
      </div>
      <input
        v-if="matchId && !playerHasJoinedGame"
        type="button"
        :value="$t('join')"
        class="form-btn"
        @click="joinGame"
      />
      <app-share-link v-if="matchId" />
      <app-players-in-lobby-list-vue
        v-if="matchId"
        :players-in-lobby="playersInLobby"
      />
      <p v-if="playerHasJoinedGame">{{ $t('waiting_for_players') }}</p>
      <input
        type="button"
        :value="$t('new')"
        class="form-btn"
        @click="newGame"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import AppShareLink from '../components/App/AppShareLink.vue';
import AppPlayersInLobbyListVue from '../components/App/AppPlayersInLobbyList.vue';
export default {
  components: { AppShareLink, AppPlayersInLobbyListVue },
  data() {
    return {
      playerName: '',
      team: 'red',
      matchDataPollIntervalId: null,
    };
  },
  computed: {
    ...mapGetters(['playersInLobby', 'playerHasJoinedGame']),
    ...mapState(['matchId', 'playerId']),
    playerId() {
      return this.team === 'red' ? '0' : '1';
    },
  },
  watch: {
    playersInLobby: {
      deep: true,
      handler(newVal) {
        if (newVal?.length === 4) {
          clearInterval(this.matchDataPollIntervalId);
          this.$router.push('game');
        }
      },
    },
  },
  mounted() {
    const matchId = this.$route.query.matchId;
    this.playerName = this.$store.state.playerName;
    if (matchId) {
      this.setMatchId(matchId);
    }
    if (this.$game.client) {
      this.$game.client.stop();
    }
    // poll match data every 2 seconds
    this.matchDataPollIntervalId = setInterval(() => {
      if (this.matchId) {
        this.$store.dispatch('getMatchData');
      }
    }, 2000);
  },
  methods: {
    ...mapMutations(['setPlayerName', 'setMatchId']),
    async newGame() {
      if (this.playerHasJoinedGame) {
        this.$store.dispatch('clearMatchData');
        try {
          await this.$router.replace('/');
        } catch (error) {
          if (error.name !== 'NavigationDuplicated') {
            throw error;
          }
        }
      } else {
        await this.$store.dispatch('createMatch', { numPlayers: 4 });
        await this.joinGame();
      }
    },
    async joinGame() {
      try {
        await this.$store.dispatch('joinMatch', {
          playerID: this.playerId,
          playerName: this.playerName,
        });
      } catch (error) {
        alert(this.$t('team_is_full'));
      }
    },
  },
};
</script>

<style scoped>
.user-form {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  margin: 30px 0;
}
.form-input {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  width: 300px;
}
.form-btn {
  margin: 10px 0;
}
/* DEMO-SPECIFIC STYLES */
.typewriter h1 {
  width: 165px;
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: 0.15em solid white; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  margin-top: 80px;
  letter-spacing: 0.15em; /* Adjust as needed */
  animation: typing 1.5s steps(8, end), blink-caret 0.5s step-end infinite;
  font-size: 2em;
}

/* The typing effect */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 165px;
  }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: white;
  }
}
</style>
