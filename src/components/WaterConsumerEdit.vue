<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Edit'|localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">

        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="wc of waterConsumers" :key="wc.id" :value="wc.id">{{wc.waterConsumerName}}</option>
          </select>
          <label>{{'SelectWaterConsumer'|localize}}</label>
        </div>

        <p>
          <label>
            <input name="group1" type="radio" value="internalWaterUser" v-model="waterConsumerType" />
            <span>{{ 'Internal_Water_Consumer' | localize }}</span>
          </label>
        </p>
        <p>
          <label>
            <input name="group1" type="radio" value="secondaryWaterUser" v-model="waterConsumerType" />
            <span>{{ 'Secondary_Water_Consumer' | localize }}</span>
          </label>
        </p>
        <!-- Internal -->
        <template v-if="waterConsumerType==='internalWaterUser'">
          <div class="input-field">
            <input id="name" type="text" v-model="waterConsumerName"
              :class="{invalid: $v.waterConsumerName.$dirty && !$v.waterConsumerName.required}">
            <label for="name">{{'Title'|localize}}</label>
            <span v-if="$v.waterConsumerName.$dirty && !$v.waterConsumerName.required"
              class="helper-text invalid">{{'Message_WaterConsumerTitle'|localize}}</span>
          </div>

          <div class="input-field">
            <label for="water-consumer-detail">{{'WaterConsumer_Detail' | localize}}</label>
            <textarea id="water-consumer-detail" type="textarea" v-model="waterConsumerDetail"
              class="materialize-textarea">
          </textarea>
          </div>
        </template>
        <!-- END internal -->

        <!-- Secondary -->
        <template v-else>
          <div class="input-field">
            <input id="name" type="text" v-model="waterConsumerName"
              :class="{invalid: $v.waterConsumerName.$dirty && !$v.waterConsumerName.required}">
            <label for="name">{{'Title'|localize}}</label>
            <span v-if="$v.waterConsumerName.$dirty && !$v.waterConsumerName.required"
              class="helper-text invalid">{{'Message_WaterConsumerTitle'|localize}}</span>
          </div>

          <div class="input-field">
            <label for="water-consumer-detail">{{'WaterConsumer_Detail' | localize}}</label>
            <textarea id="water-consumer-detail" type="textarea" v-model="waterConsumerDetail"
              class="materialize-textarea">
          </textarea>
            
          </div>
        </template>
        <!-- END secondary -->

        <button class="btn waves-effect waves-light" type="submit">
          {{'Update'|localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import localizeFilter from '@/filters/localize.filter'
import 'vue-select/dist/vue-select.css';
export default {
  props: {
    waterConsumers: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
      waterConsumerName: '',
      waterConsumerType: null,
      waterConsumerDetail: '',
      current: null
  }),
  validations: {
    waterConsumerName: { required },
    waterConsumerType: { required }
  },
  watch: {
    current(wcId) {
      const { waterConsumerName, waterConsumerType, waterConsumerDetail } = this.waterConsumers.find(wc => wc.id === wcId)
      this.waterConsumerName = waterConsumerName
      this.waterConsumerType = waterConsumerType
      this.waterConsumerDetail = waterConsumerDetail
    },
  },
  created() {
    const { id, waterConsumerName, waterConsumerType, waterConsumerDetail } = this.waterConsumers[0]
    this.current = id
    this.waterConsumerName = waterConsumerName
    this.waterConsumerType = waterConsumerType
    this.waterConsumerDetail = waterConsumerDetail
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const waterConsumerData = {
          id: this.current,
          waterConsumerName: this.waterConsumerName,
          waterConsumerType: this.waterConsumerType,
          waterConsumerDetail: this.waterConsumerDetail
        }
        await this.$store.dispatch('updateWaterConsumer', waterConsumerData)
        this.$message(localizeFilter('WaterConsumer_HasBeenUpdated'))
        this.$emit('updated', waterConsumerData)
      } catch (e) {}
    }
  },
  mounted() {
    // this.waterBodyCodeAndType = M.FormSelect.init(this.$refs.waterBodyCodeAndType)
    this.select = M.FormSelect.init(this.$refs.select)
    M.updateTextFields()
  },
  destroyed() {
    // if (this.waterConsumerType && this.waterConsumerType.destroy) {
    //   this.waterConsumerType.destroy()
    // }
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>
