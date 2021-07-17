<template>
  <div>
    <div class="page-title">
      <h3>{{'Wastewater_Receivers'|localize}}</h3>
    </div>
    <section>
      <Loader v-if="loading"/>
      <div class="row" v-else>
        <CreateWastewaterReceiver @created="addNewWastewaterReceiver"/>

        <WastewaterReceiverEdit
          v-if="wastewaterReceivers.length"
          :wastewaterReceivers="wastewaterReceivers"
          :key="wastewaterReceivers.length + updateCount"
          @updated="updateWastewaterReceiver"
        /> 
        <p v-else class="center">{{'No_Wastewater_Receivers'|localize}}</p> 
      </div>
    </section>
  </div>
</template>

<script>
import CreateWastewaterReceiver from '@/components/CreateWastewaterReceiver'
import WastewaterReceiverEdit from '@/components/WastewaterReceiverEdit'

export default {
  name: 'wastewaterreceivers',
  metaInfo() {
    return {
      title: this.$title('Menu_Wastewater_Receivers')
    }
  },
  data: () => ({
    wastewaterReceivers: [],
    loading: true,
    updateCount: 0
  }),
  async mounted() {
    this.wastewaterReceivers = await this.$store.dispatch('fetchWastewaterReceivers')
    this.loading = false
  },
  components: {
    CreateWastewaterReceiver,
    WastewaterReceiverEdit
  },
  methods: {
    addNewWastewaterReceiver(wastewaterReceiver) {
      this.wastewaterReceivers.push(wastewaterReceiver)
    },
    updateWastewaterReceiver(wastewaterReceiver) {
      const idx = this.wastewaterReceivers.findIndex(wc => wc.id === wastewaterReceiver.id)
      this.wastewaterReceivers[idx].wastewaterReceiverName = wastewaterReceiver.wastewaterReceiverName
      this.wastewaterReceivers[idx].wastewaterReceiverType = wastewaterReceiver.wastewaterReceiverType
      this.wastewaterReceivers[idx].wastewaterReceiverDetail = wastewaterReceiver.wastewaterReceiverDetail
      this.updateCount++
    }
  }
}
</script>
