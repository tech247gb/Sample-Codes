<script lang="ts">
import Vue from 'vue';
import type { PropOptions } from 'vue';
import type { AppDataPagination } from '~/interfaces/appData.interface';

export default Vue.extend({
  name: 'AppDataTable',

  props: {
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Object,
      required: true,
    } as PropOptions<AppDataPagination>,
  },

  data() {
    return {
      selectAll: false,
      selectedCopy: [...this.selected],
    };
  },

  computed: {
    currentPage(): number {
      return this.pagination.currentPage;
    },
    totalPages(): number {
      return this.pagination.totalPages;
    },
    totalHits(): number {
      return 0;
    },
  },

  watch: {
    selected(newValue): void {
      if (newValue.length === this.data.length) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
      if (newValue.length !== this.selectedCopy.length) {
        this.selectedCopy = [...newValue];
      }
    },
  },

  methods: {
    changeSelectAll(): void {
      let selected: any[] = [];
      if (this.selectAll) {
        selected = [...this.data];
      }
      this.$store.commit('appData/SET_SELECTED', {
        listId: this.id,
        selected,
      });
    },
    changePage(value: number): void {
      const totalPages = this.pagination.totalPages;
      let first = this.pagination.first;
      let last = this.pagination.last;
      if (value < 0) {
        last = null;
      } else {
        first = null;
      }
      this.$store.commit('appData/SET_PAGINATION', {
        listId: this.id,
        pagination: {
          hasNext: this.pagination.hasNext,
          last,
          first,
          limit: this.pagination.limit,
          currentPage: this.pagination.currentPage + value,
          totalPages,
        },
      });
      this.$emit('changePage');
    },
    handleSelected(): void {
      const selected = [...this.selectedCopy];
      this.$store.commit('appData/SET_SELECTED', {
        listId: this.id,
        selected,
      });
    },
  },
});
</script>

<template>
  <div>
    <table class="gw-dashboard-table">
      <thead class="border-t border-b">
        <tr class="bg-white">
          <th>
            <input
              v-model="selectAll"
              type="checkbox"
              @change="changeSelectAll"
            >
          </th>
          <th
            v-for="header in headers"
            :key="`${id}-header-${header}`"
            class="text-gray-600"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <component
          :is="`${id}-app-data`"
          v-for="row in data"
          :key="row.id"
          :data="row"
        >
          <template #select>
            <input
              v-model="selectedCopy"
              type="checkbox"
              :value="row"
              @change="handleSelected"
            >
          </template>
        </component>
      </tbody>
    </table>

    <nav
      v-if="pagination"
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      aria-label="Pagination"
    >
      <div class="hidden sm:block">
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">
            {{ currentPage }}
          </span>
          to
          <span class="font-medium">
            {{ totalPages }}
          </span>
          of
          <span class="font-medium">
            {{ totalHits }}
          </span>
          results
        </p>
      </div>
      <div class="flex-1 flex justify-between sm:justify-end">
        <button
          class="btn-outline-secondary"
          :disabled="currentPage <= 0"
          @click="changePage(-1)"
        >
          Previous
        </button>
        <button
          class="btn-outline-secondary ml-2"
          :disabled="currentPage >= totalPages"
          @click="changePage(1)"
        >
          Next
        </button>
      </div>
    </nav>
  </div>
</template>
