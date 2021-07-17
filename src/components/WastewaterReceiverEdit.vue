<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Edit'|localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">

        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="wr of wastewaterReceivers" :key="wr.id" :value="wr.id">{{wr.wastewaterReceiverName}}</option>
          </select>
          <label>{{'Select_Wastewater_Receiver'|localize}}</label>
        </div>

        <p>
          <label>
            <input name="group1" type="radio" value="internalWastewaterReceiver" v-model="wastewaterReceiverType" />
            <span>{{ 'Internal_Wastewater_Receiver' | localize }}</span>
          </label>
        </p>
        <p>
          <label>
            <input name="group1" type="radio" value="externalWastewaterReceiver" v-model="wastewaterReceiverType" />
            <span>{{ 'External_Wastewater_Receiver' | localize }}</span>
          </label>
        </p>
        <!-- Internal -->
        <template v-if="wastewaterReceiverType==='internalWaterUser'">
          <div class="input-field">
            <input id="name" type="text" v-model="wastewaterReceiverName"
              :class="{invalid: $v.wastewaterReceiverName.$dirty && !$v.wastewaterReceiverName.required}">
            <label for="name">{{'Title'|localize}}</label>
            <span v-if="$v.wastewaterReceiverName.$dirty && !$v.wastewaterReceiverName.required"
              class="helper-text invalid">{{'Message_Wastewater_Receiver_Title'|localize}}</span>
          </div>

          <div class="input-field">
            <label for="wastewater-consumer-detail-edit">{{'Wastewater_Receiver_Detail' | localize}}</label>
            <textarea id="wastewater-consumer-detail-edit" type="textarea" v-model="wastewaterReceiverDetail"
              class="materialize-textarea">
          </textarea>
          </div>
        </template>
        <!-- END internal -->

        <!-- Secondary -->
        <template v-else>
          <div class="input-field">
            <input id="name" type="text" v-model="wastewaterReceiverName"
              :class="{invalid: $v.wastewaterReceiverName.$dirty && !$v.wastewaterReceiverName.required}">
            <label for="name">{{'Title'|localize}}</label>
            <span v-if="$v.wastewaterReceiverName.$dirty && !$v.wastewaterReceiverName.required"
              class="helper-text invalid">{{'Message_Wastewater_Receiver_Title'|localize}}</span>
          </div>

          <div class="input-field">
            <label for="water-consumer-detail">{{'Wastewater_Receiver_Detail' | localize}}</label>
            <textarea id="water-consumer-detail" type="textarea" v-model="wastewaterReceiverDetail"
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
    wastewaterReceivers: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
      wastewaterReceiverName: '',
      wastewaterReceiverType: null,
      wastewaterReceiverDetail: '',
      current: null
  }),
  validations: {
    wastewaterReceiverName: { required },
    wastewaterReceiverType: { required }
  },
  watch: {
    current(wcId) {
      const { wastewaterReceiverName, wastewaterReceiverType, wastewaterReceiverDetail } = this.wastewaterReceivers.find(wc => wc.id === wcId)
      this.wastewaterReceiverName = wastewaterReceiverName
      this.wastewaterReceiverType = wastewaterReceiverType
      this.wastewaterReceiverDetail = wastewaterReceiverDetail
    },
  },
  created() {
    const { id, wastewaterReceiverName, wastewaterReceiverType, wastewaterReceiverDetail } = this.wastewaterReceivers[0]
    this.current = id
    this.wastewaterReceiverName = wastewaterReceiverName
    this.wastewaterReceiverType = wastewaterReceiverType
    this.wastewaterReceiverDetail = wastewaterReceiverDetail
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const wastewaterReceiverData = {
          id: this.current,
          wastewaterReceiverName: this.wastewaterReceiverName,
          wastewaterReceiverType: this.wastewaterReceiverType,
          wastewaterReceiverDetail: this.wastewaterReceiverDetail
        }
        await this.$store.dispatch('updateWastewaterReceiver', wastewaterReceiverData)
        this.$message(localizeFilter('Wastewater_Receiver_HasBeenUpdated'))
        this.$emit('updated', wastewaterReceiverData)
      } catch (e) {}
    }
  },
  mounted() {
    // this.waterBodyCodeAndType = M.FormSelect.init(this.$refs.waterBodyCodeAndType)
    this.select = M.FormSelect.init(this.$refs.select)
    M.updateTextFields()
  },
  destroyed() {
    // if (this.wastewaterReceiverType && this.wastewaterReceiverType.destroy) {
    //   this.wastewaterReceiverType.destroy()
    // }
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>
