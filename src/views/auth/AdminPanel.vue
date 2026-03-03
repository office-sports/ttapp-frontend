<template>
  <div class="profile-container">
    <div class="profile-left">
      <!-- Sidebar -->
      <nav class="sidebar-nav">
        <a :class="['sidebar-link', { active: activeTab === 'reschedules' }]" @click="activeTab = 'reschedules'">
          Reschedules
        </a>
      </nav>
    </div>

    <!-- Content -->
    <div class="admin-content">
        <div class="content-title">All Reschedule Requests</div>

        <div v-if="loading" class="empty-state">Loading…</div>
        <div v-else-if="requests.length === 0" class="empty-state">No reschedule requests.</div>

        <div v-for="req in requests" :key="req.id" class="request-card">
          <div class="request-header">
            <router-link :to="'/player/' + req.home_player_id + '/profile'" class="req-player-link">{{ req.home_player_name }}</router-link>
            <span class="req-vs">vs</span>
            <router-link :to="'/player/' + req.away_player_id + '/profile'" class="req-player-link">{{ req.away_player_name }}</router-link>
            <span :class="'status-badge status-' + req.status">{{ req.status }}</span>
          </div>
          <div class="request-from">
            Proposed by <strong>{{ req.requester_name }}</strong>
            <span class="date-sep">·</span>
            <span class="date-value">{{ formatDate(req.created_at) }}</span>
          </div>
          <div class="request-dates">
            <span class="date-label">Proposed:</span>
            <span class="date-value">{{ formatDate(req.proposed_date_from) }}</span>
            <template v-if="req.proposed_date_to && req.proposed_date_to !== req.proposed_date_from">
              <span class="date-label">–</span>
              <span class="date-value">{{ formatDate(req.proposed_date_to) }}</span>
            </template>
            <template v-if="req.status === 'accepted' && req.current_date_of_match">
              <span class="date-label" style="margin-left:12px">New date:</span>
              <span class="date-value" style="color:#6dd98c">{{ formatDate(req.current_date_of_match) }}</span>
            </template>
            <template v-else-if="req.original_date_of_match">
              <span class="date-label" style="margin-left:12px">Original:</span>
              <span class="date-value muted">{{ formatDate(req.original_date_of_match) }}</span>
            </template>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      activeTab: "reschedules",
      requests: [],
      loading: false,
    };
  },
  methods: {
    authHeaders() {
      return { Authorization: `Bearer ${localStorage.getItem("authToken")}` };
    },
    formatDate(d) {
      if (!d) return "—";
      const dt = new Date(d);
      return isNaN(dt) ? d : dt.toLocaleDateString(undefined, { dateStyle: "medium" });
    },
    async loadReschedules() {
      this.loading = true;
      try {
        const res = await axios.get("/api/admin/reschedules", { headers: this.authHeaders() });
        this.requests = res.data || [];
      } catch (e) {
        console.error("Failed to load admin reschedules", e);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    if (localStorage.getItem("isAdmin") !== "1") {
      this.$router.push("/");
      return;
    }
    this.loadReschedules();
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: row;
  background: var(--color-container);
  border-radius: 20px;
  overflow: hidden;
  padding: 0;
  align-items: stretch;
}
.profile-left {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: #0f1017;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  margin: 0;
}
.sidebar-link {
  padding: 8px 0;
  border-bottom: 1px solid rgba(84, 84, 84, 0.4);
  color: white;
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  font-size: 15px;
  cursor: pointer;
}
.sidebar-link:last-child { border-bottom: none; }
.sidebar-link:hover { color: #269a47; }
.sidebar-link.active { color: #269a47; font-weight: 600; }
.admin-content { flex: 1; min-width: 0; padding: 20px; }
.empty-state { color: #444; font-size: 13px; padding: 8px 0; }
.request-card {
  background: #0f1017;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.request-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 13px;
}
.req-vs { color: #555; font-size: 11px; }
.req-player-link { color: #c8d8c0; text-decoration: none; }
.req-player-link:hover { text-decoration: underline; }
.request-from { font-size: 12px; color: #666; display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
.request-dates { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 12px; }
.date-label { color: #555; }
.date-value { color: #aaa; }
.date-sep { color: #444; margin: 0 4px; }
.muted { color: #555; }
.status-badge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 8px;
  padding: 1px 7px;
}
.status-pending   { color: #7bb8e0; background: rgba(123,184,224,0.1); }
.status-accepted  { color: #6dd98c; background: rgba(109,217,140,0.1); }
.status-declined  { color: #e06c6c; background: rgba(224,108,108,0.1); }
.status-countered { color: #e0b96c; background: rgba(224,185,108,0.1); }
.status-revoked   { color: #888;    background: rgba(136,136,136,0.1); }
</style>
