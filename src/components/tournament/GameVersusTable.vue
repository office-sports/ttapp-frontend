<template>
  <table>
    <tr>
      <td
        class="w-player-name"
        :class="match.home_player_id !== 0 ? 'txtr' : 'txtr txt-col-darker'"
      >
        <span
          :class="
            match.winner_id !== 0 && match.winner_id === match.home_player_id
              ? 'col-winner'
              : ''
          "
        >
          <router-link :to="'/player/' + match.home_player_id + '/profile'"
            >{{ match.home_player_name }}
          </router-link>
        </span>
      </td>
      <td class="w-vs txtc txt-col-darker">vs</td>
      <td
        class="w-player-name"
        :class="match.home_player_id !== 0 ? 'txtl' : 'txtl txt-col-darker'"
      >
        <span
          :class="
            match.winner_id !== 0 && match.winner_id === match.away_player_id
              ? 'col-winner'
              : ''
          "
        >
          <router-link :to="'/player/' + match.away_player_id + '/profile'"
            >{{ match.away_player_name }}
          </router-link></span
        >
      </td>
    </tr>
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
