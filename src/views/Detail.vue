<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{'Menu_History'|localize}}</router-link>
        <a @click.prevent class="breadcrumb">{{ record.type === 'income' ? 'Income' : 'Outcome' | localize }}</a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="{
            'red': record.type === 'outcome',
            'green': record.type === 'income'
          }">
            <div class="card-content white-text">
              <div class="vertical-table">
                <table>
                  <tr>
                    <th>{{'Date'|localize}}:</th>
                    <td>{{record.date | date('datetime')}}</td>
                  </tr>
                  <tr>
                    <th>{{'Description'|localize}}:</th>
                    <td>{{record.description}}</td>
                  </tr>
                  <tr>
                    <th> {{'Amount'|localize}}:</th>
                    <td>{{record.amount }} м3</td>
                  </tr>
                  <tr>
                    <th>{{'Category'|localize}}:</th>
                    <td>{{record.categoryName}}</td>
                  </tr>
                  <tr>
                    <th>{{'WaterIntake'|localize}}:</th>
                    <td>{{record.waterIntakeName}}</td>
                  </tr>
                  <tr>
                    <th>{{'WaterConsumer'|localize}}:</th>
                    <td>{{record.waterConsumerName}}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>Запись с id={{$route.params.id}} не найдена</p>
  </div>
</template>

<script>
export default {
  name: 'detail',
  metaInfo() {
    return {
      title: this.$title('Detail_Title')
    }
  },
  data: () => ({
    record: null,
    loading: true
  }),
  async mounted() {
    const id = this.$route.params.id
    const record = await this.$store.dispatch('fetchRecordById', id)
    const category = await this.$store.dispatch(
      'fetchCategoryById',
      record.categoryId
    )
    const waterIntake = await this.$store.dispatch(
      'fetchWaterIntakeById',
      record.waterIntakeId
    )

    const waterConsumer = await this.$store.dispatch(
      'fetchWaterConsumerById',
      record.waterConsumerId
    )

    this.record = {
      ...record,
      categoryName: category.title,
      waterIntakeName: waterIntake.title,
      waterConsumerName: waterConsumer.waterConsumerName,
      waterConsumerType: waterConsumer.waterConsumerType,
    }

    this.loading = false
  }
}
</script>
