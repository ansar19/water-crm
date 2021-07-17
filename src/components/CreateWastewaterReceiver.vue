<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Create'|localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
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
        <template v-if="wastewaterReceiverType==='internalWastewaterReceiver'">
          <div class="input-field">
            <input id="wastewater-receiver-name-create" type="text" v-model="wastewaterReceiverName"
              :class="{invalid: $v.wastewaterReceiverName.$dirty && !$v.wastewaterReceiverName.required}">
            <label for="wastewater-receiver-name-create">{{'Title'|localize}}</label>
            <span v-if="$v.wastewaterReceiverName.$dirty && !$v.wastewaterReceiverName.required"
              class="helper-text invalid">{{'Message_Wastewater_Receiver_Title'|localize}}</span>
          </div>

          <div class="input-field">
            <label for="wastewater-consumer-detail-create">{{'Wastewater_Receiver_Detail' | localize}}</label>
            <textarea id="wastewater-consumer-detail-create" type="textarea" v-model="wastewaterReceiverDetail"
              class="materialize-textarea">
          </textarea>
          </div>
        </template>
        <!-- END internal -->

        <!-- Secondary -->
        <template v-else>
          <div class="input-field">
            <input id="name" type="text" v-model="wastewaterReceiverName"
              :class="{invalid: $v.wastewaterReceiverType.$dirty && !$v.wastewaterReceiverName.required}">
            <label for="name">{{'Title'|localize}}</label>
            <span v-if="$v.wastewaterReceiverName.$dirty && !$v.wastewaterReceiverName.required"
              class="helper-text invalid">{{'Message_Wastewater_Receiver_Title'|localize}}</span>
          </div>

          <div class="input-field">
            <label for="wastewater-consumer-detail-create">{{'Wastewater_Receiver_Detail' | localize}}</label>
            <textarea id="wastewater-consumer-detail-create" type="textarea" v-model="wastewaterReceiverDetail"
              class="materialize-textarea">
          </textarea>
            
          </div>
        </template>
        <!-- END secondary -->

<!-- 
        <div class="input-field">
          <select ref="waterBodyCodeAndType" v-model="waterBodyCodeAndType" class="form-control" id="water-body-code">
            <option v-for="(option, index) in waterBodyCodeAndTypeOptions" v-bind:value="option" v-bind:key="index">
              {{ option.waterBodyName }}
            </option>
          </select>
          <label for="water-body-code">{{'Water_Body_Code_And_Type'|localize}}</label>
          <span v-if="$v.waterBodyCodeAndType.$dirty && !$v.waterBodyCodeAndType.required"
            class="helper-text invalid">{{'Message_WaterConsumerTitle'|localize}}</span>
        </div> -->

        <button class="btn waves-effect waves-light" type="submit">
          {{'Create'|localize}}
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
  data: () => ({
    wastewaterReceiverName: '',
    wastewaterReceiverType: 'internalWastewaterReceiver',
    wastewaterReceiverDetail: ''
  }),
  validations: {
    wastewaterReceiverName: { required },
    wastewaterReceiverType: { required }
  },
  mounted() {
    // M.updateTextFields(),
    // setTimeout(() => {
    //   this.wastewaterReceiverType = M.FormSelect.init(this.$refs.wastewaterReceiverType)
    //   M.updateTextFields()
    // }, 0)
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const wastewaterReceiver = await this.$store.dispatch('createWastewaterReceiver', {
          wastewaterReceiverName: this.wastewaterReceiverName,
          wastewaterReceiverType: this.wastewaterReceiverType,
          wastewaterReceiverDetail: this.wastewaterReceiverDetail
        })
        this.wastewaterReceiverName = ''
        this.wastewaterReceiverType = ''
        this.wastewaterReceiverDetail = ''
        this.$v.$reset()
        this.$message(localizeFilter('Wastewater_Receiver_HasBeenCreated'))
        this.$emit('created', wastewaterReceiver)
      } catch (e) {}
    }
  },
  destroyed() {
    if (this.wastewaterReceiverType && this.wastewaterReceiverType.destroy) {
      this.wastewaterReceiverType.destroy()
    }
  }
}
</script>
