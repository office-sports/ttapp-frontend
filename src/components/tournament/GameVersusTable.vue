<template>
  <table>
    <tbody>
      <tr>
        <td
          class="w-player-name"
          :class="
            match.home_player_id !== 0
              ? 'text-right'
              : 'text-right txt-col-darker'
          "
        >
          <span
            :class="
              match.winner_id !== 0 && match.winner_id === match.home_player_id
                ? 'col-winner'
                : ''
            "
          >
            <router-link
              v-if="match.home_player_id !== 0"
              :to="'/player/' + match.home_player_id + '/profile'"
              >{{ match.home_player_name }}
            </router-link>
            <span v-else class="text-white">
              (<span class="txt-col-darker">{{ match.home_player_name }}</span
              >) <i class="far fa-question-circle"></i>
            </span>
          </span>
        </td>
        <td class="w-vs text-center txt-col-darker">vs</td>
        <td
          class="w-player-name"
          :class="
            match.home_player_id !== 0
              ? 'text-left'
              : 'text-left txt-col-darker'
          "
        >
          <span
            :class="
              match.winner_id !== 0 && match.winner_id === match.away_player_id
                ? 'col-winner'
                : ''
            "
          >
            <router-link
              v-if="match.away_player_id !== 0"
              :to="'/player/' + match.away_player_id + '/profile'"
              >{{ match.away_player_name }}
            </router-link>
            <span v-else class="text-white">
              <i class="far fa-question-circle"></i> (<span
                class="txt-col-darker"
                >{{ match.away_player_name }}</span
              >)
            </span>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["match"],
};
</script>

<style scoped>
.w-player-name {
  width: 47%;
}

.w-vs {
  width: 6%;
}

table td {
  padding: 0;
}
</style>
