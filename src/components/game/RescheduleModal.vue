<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <div class="modal-header">
        <span>Suggest Reschedule</span>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <p class="modal-game-label">
          {{ game.home_player_name }} vs {{ game.away_player_name }}
          <span v-if="game.date_of_match" class="modal-current-date">
            Currently: {{ formatDate(game.date_of_match) }}
          </span>
        </p>

        <div class="modal-field">
          <label>Proposed date</label>
          <input type="date" v-model="dateFrom" :min="today" />
        </div>

        <div class="modal-field">
          <label>Alternative date (optional)</label>
          <input type="date" v-model="dateTo" :min="today" />
        </div>

        <p class="modal-hint">
          If you propose a single date, the opponent accepts or counter-proposes.<br />
          If you propose a range, the opponent picks from it or counter-proposes.
        </p>

        <div v-if="error" class="modal-error">{{ error }}</div>

        <div class="modal-actions">
          <button class="btn-secondary" @click="$emit('close')">Cancel</button>
          <button class="btn-primary" :disabled="!dateFrom || loading" @click="submit">
            {{ loading ? 'Sending…' : 'Send Proposal' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  emits: ["close", "submitted"],
  props: {
    game: { type: Object, required: true },
    counterRequestId: { type: Number, default: null },
  },
  data() {
    return {
      dateFrom: "",
      dateTo: "",
      loading: false,
      error: "",
    };
  },
  computed: {
    today() {
      return new Date().toISOString().slice(0, 10);
    },
  },
  methods: {
    formatDate(d) {
      if (!d) return "—";
      return new Date(d).toLocaleDateString(undefined, { dateStyle: "medium" });
    },
    async submit() {
      this.error = "";
      this.loading = true;
      try {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        const dateTo = this.dateTo || this.dateFrom;
        const body = {
          proposed_date_from: this.dateFrom <= dateTo ? this.dateFrom : dateTo,
          proposed_date_to:   this.dateFrom <= dateTo ? dateTo : this.dateFrom,
        };
        if (this.counterRequestId) {
          await axios.post(`/api/reschedule/${this.counterRequestId}/counter`, body, { headers });
        } else {
          await axios.post(`/api/games/${this.game.id}/reschedule`, body, { headers });
        }
        this.$emit("submitted");
      } catch (e) {
        this.error = e.response?.data?.error || "Failed to send proposal.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: var(--color-container);
  border-radius: 16px;
  width: 480px;
  max-width: 95vw;
  overflow: hidden;
}
.modal-header {
  background: #0f1017;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  color: #e0e0e0;
}
.modal-close {
  background: none;
  border: none;
  color: #888;
  font-size: 16px;
  cursor: pointer;
}
.modal-close:hover { color: #e0e0e0; }
.modal-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal-game-label {
  font-size: 13px;
  color: #b0b0b0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.modal-current-date {
  font-size: 11px;
  color: #666;
}
.modal-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}
.modal-field label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.modal-field input {
  display: block;
  background: #0f1017;
  border: 1px solid rgba(84, 84, 84, 0.65);
  border-radius: 4px;
  padding: 6px 8px;
  color: #e0e0e0;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  width: 100% !important;
  min-width: 150px;
  box-sizing: border-box;
  color-scheme: dark;
}
.modal-field input:focus { border-color: rgba(200, 200, 200, 1); }
.modal-hint {
  font-size: 11px;
  color: #555;
  margin: 0;
  line-height: 1.5;
}
.modal-error {
  font-size: 12px;
  color: #e06c6c;
}
.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
}
.btn-primary {
  background: #4a7c59;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 20px;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
}
.btn-primary:hover:not(:disabled) { background: #5a9469; }
.btn-primary:disabled { opacity: 0.5; cursor: default; }
.btn-secondary {
  background: #2a2a35;
  color: #aaa;
  border: none;
  border-radius: 8px;
  padding: 9px 20px;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
}
.btn-secondary:hover { background: #333342; color: #ccc; }
</style>
