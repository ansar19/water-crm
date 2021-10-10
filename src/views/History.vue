<template>
  <div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!records.length">
      {{'NoRecords'|localize}}.
      <router-link to="/record">{{'AddFirst'|localize}}</router-link>
    </p>

    <section v-else>

      <!-- <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Back' | localize"
        :next-text="'Forward' | localize"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      /> --> 

      <LogBookTable :records="items" style="text-align: center;" />

    </section>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'
// import HistoryTable from '@/components/HistoryTable'
import LogBookTable from '@/components/LogBookTable'
import { Pie } from 'vue-chartjs'
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'history',
  metaInfo() {
    return {
      title: this.$title('Menu_History')
    }
  },
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    const categoires = await this.$store.dispatch('fetchCategories')
    const waterIntakes = await this.$store.dispatch('fetchWaterIntakes')
    const waterConsumers = await this.$store.dispatch('fetchWaterConsumers')

    this.setup(categoires, waterIntakes, waterConsumers)
    
    this.loading = false
  },
  methods: {
    setup(categoires, waterIntakes, waterConsumers) {
      this.setupPagination(
        this.records.map(record => {
          return {
            ...record,
            categoryName: categoires.find(c => c.id === record.categoryId)
              .title,
            categoryCode: categoires.find(c => c.id === record.categoryId)
              .code,
            typeClass: record.type === 'income' ? 'green' : 'red',
            waterBody: waterIntakes.find(wi => wi.id === record.waterIntakeId),
            waterConsumer: waterConsumers.find(wc => wc.id === record.waterConsumerId),
            typeText:
              record.type === 'income'
                ? localizeFilter('Income')
                : localizeFilter('Outcome')
          }
        })
      )

    }
  },
  components: {
    LogBookTable
  }
}
</script>

