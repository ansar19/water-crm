<template>
  <div>
    <div class="page-title">
      <h3>{{'Menu_NewRecord'|localize}}</h3>
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!categories.length">
      {{'NoCategories'|localize}}.
      <router-link to="/categories">{{'AddFirst'|localize}}</router-link>
    </p>

    <form class="form" v-else @submit.prevent="handleSubmit">

      <!-- Дата -->

      <div class="from-group">
        <!-- <div>Opened: <span :class="[opened ? 'text-success' : 'text-danger']">{{ opened }}</span></div> -->
        <div>📅 {{'Water_Removal_Delivery_Date'|localize}}:</div>
        <!-- <span>{{ recordDate }}</span> -->
        <datepicker v-model="recordDate" :language="ru" />
      </div>

      <div class="row">
        <div class="input-field">
          <p>
            <label>
              <input class="with-gap" name="type" type="radio" value="income" v-model="type">
              <span>{{'Income'|localize}}</span>
            </label>
          </p>

          <p>
            <label>
              <input class="with-gap" name="type" type="radio" value="outcome" v-model="type">
              <span>{{'Outcome'|localize}}</span>
            </label>
          </p>
        </div>
      </div>

      <div class="input-field">
          <select ref="waterIntake" v-model="waterIntake">
            <option v-for="wi of waterIntakes" :key="wi.id" :value="wi.id">{{wi.title}}</option>
          </select>
          <label>{{'SelectWaterIntake'|localize}}</label>
        </div>

      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c in categories" :key="c.id" :value="c.id">{{c.title}}</option>
        </select>
        <label>{{'SelectCategory'|localize}}</label>
      </div>

      <div class="input-field">
          <select ref="waterConsumer" v-model="waterConsumer">
            <option v-for="wc of waterConsumers" :key="wc.id" :value="wc.id">{{wc.waterConsumerName}}</option>
          </select>
          <label>{{'SelectWaterConsumer'|localize}}</label>
        </div>

      

      <div class="input-field">
        <input id="amount" type="text" v-model.number="amount" 
          :class="{invalid: $v.amount.$dirty && !$v.amount.$decimal &&!!$v.amount.minValue}" />
        <span v-if="$v.amount.$dirty &&  !$v.amount.$decimal && !$v.amount.$minValue"
          class="helper-text invalid">{{'Message_MinLength'|localize}} {{$v.amount.$params.minValue.min}}</span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">{{'Description'|localize}}</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
        >{{'Message_EnterDescription'|localize}}</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Create'|localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {
  en,
  ru
} from 'vuejs-datepicker/dist/locale'

import Datepicker from 'vuejs-datepicker';

import { required, minValue, decimal } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import localizeFilter from '@/filters/localize.filter'
import 'vue-select/dist/vue-select.css';
export default {
  name: 'record',
  metaInfo() {
    return {
      title: this.$title('Menu_NewRecord')
    }
  },
  data: () => ({
    ru: ru, // vuejs-datepicker
    en: en, // vuejs-datepicker
    loading: true,
    select: null,
    categories: [],
    waterConsumers: [],
    waterConsumer: null,
    category: null,
    type: 'outcome',
    amount: 0.001,
    description: '',
    waterIntake: null,
    waterIntakes: [],
    recordDate: new Date(),
  }),
  validations: {
    amount: { required, minValue: minValue(0.001), decimal },
    description: { required }
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.waterIntakes = await this.$store.dispatch('fetchWaterIntakes')
    this.waterConsumers = await this.$store.dispatch('fetchWaterConsumers')

    this.loading = false

    if (this.categories.length) {
      this.category = this.categories[0].id
    }

    if (this.waterIntakes.length) {
      this.waterIntake = this.waterIntakes[0].id
    }

     if (this.waterConsumers.length) {
      this.waterConsumer = this.waterConsumers[0].id
    }

    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select)
      this.waterIntake = M.FormSelect.init(this.$refs.waterIntake)
      this.waterConsumer = M.FormSelect.init(this.$refs.waterConsumer)

      M.updateTextFields()
    }, 0)
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.category,
            waterIntakeId: this.waterIntake,
            waterConsumerId: this.waterConsumer,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON(),
            recordDate: this.recordDate.toJSON(),
          })
          const bill =
            this.type === 'income' ?
            this.info.bill + this.amount :
            this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', {
            bill
          })
          this.$message(localizeFilter('RecordHasBeenCreated'))
          this.$v.$reset()
          this.amount = 0.001
          this.description = ''
        } catch (e) {}
      } else {
        this.$message(
          `${localizeFilter('NotEnoughMoney')} (${this.amount -
            this.info.bill})`
        )
      }
    },
    // add in input filed if needed: @keypress="only3Digits", note keypress deprecated - replace with suitable
    // only3Digits($event) {
    //   // console.log($event.keyCode); //keyCodes value
    //   let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
    //   // only allow number and one dot
    //   if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || this.amount.indexOf('.') != -1)) { // 46 is dot
    //     $event.preventDefault();
    //   }
    //   // restrict to 3 decimal places
    //   if (this.amount != null && this.amount.indexOf(".") > -1 && (this.amount.split('.')[1].length > 2)) {
    //     $event.preventDefault();
    //   }
    // }
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
    if (this.waterIntake && this.waterIntake.destroy) {
      this.waterIntake.destroy()
    }
    if (this.waterConsumer && this.waterConsumer.destroy) {
      this.waterConsumer.destroy()
    }
  },
  components: {
    Datepicker
  }
}
</script>
