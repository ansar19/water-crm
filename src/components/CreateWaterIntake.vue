<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ 'Create' | localize }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input id="name" type="text" v-model="title" :class="{ invalid: $v.title.$dirty && !$v.title.required }" />
          <label for="name">{{ 'Title' | localize }}</label>
          <span v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid">{{ 'Message_WaterIntakeTitle' | localize }}</span>
        </div>

        <div class="input-field">
          <select ref="waterBodyCodeAndType" v-model="waterBodyCodeAndType" class="form-control" id="water-body-code">
            <option v-for="(option, index) in waterBodyCodeAndTypeOptions" v-bind:value="option" v-bind:key="index">
              {{ option.waterBodyName }}
            </option>
          </select>
          <label for="water-body-code">{{
            'Water_Body_Code_And_Type' | localize
          }}</label>
          <span v-if="
              $v.waterBodyCodeAndType.$dirty &&
              !$v.waterBodyCodeAndType.required
            " class="helper-text invalid">{{ 'Message_WaterIntakeTitle' | localize }}</span>
        </div>

        <div class="input-field">
          <label for="water-intake-number">{{ 'Water_Intake_Number' | localize }}</label>
          <input id="water-intake-number" v-model="waterIntakeNumber" type="text" class="form-control" />
          <small id="water-intake-number"
            class="form-text text-muted">({{ 'Water_Discharge_Point' | localize }})</small>
        </div>

        <div class="input-field">
          <label for="guiv-code">{{ 'GUIV_Code' | localize }}</label>
          <input id="guiv-code" v-model="guivCode" type="text" class="form-control" />
          <small id="guiv-code-help" class="form-text text-muted">{{
            'GUIV_Code_Helper_Text' | localize
          }}</small>
        </div>

        <div class="input-field">
          <label for="sea-river-code">{{'Sea_River_Code' | localize }}</label>
          <input id="sea-river-code" v-model="seaRiverCode" type="text" class="form-control" />
          <small id="sea-river-code-help" class="form-text text-muted"></small>
          <span> </span>
        </div>

        <div class="input-field">
          <label for="distance-from-estuary">{{
            'Distance_From_Estuary' | localize
          }}</label>
          <input id="distance-from-estuary" v-model="distanceFromEstuary" type="text" class="form-control" />
          <small id="distance-from-estuary-help" class="form-text text-muted">({{ 'KM' | localize }})</small>
        </div>

        <!--    Притоки         -->
        <div class="">
          <h6>{{ 'Feeders' | localize }}</h6>
          <table class="table table-bordered mt-4">
            <thead class="thead-light">
              <tr>
                <th>#</th>
                <th>{{ 'Code' | localize }}</th>
                <th>{{ 'Title' | localize }}</th>
                <th>{{ 'Description' | localize }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in feederItems" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <span v-if="editFeederIndex !== index">{{
                    item.feederCode
                  }}</span>
                  <span v-if="editFeederIndex === index">
                    <input class="form-control form-control-sm" v-model="item.feederCode" />
                  </span>
                </td>
                <td>
                  <span v-if="editFeederIndex !== index">{{
                    item.feederName
                  }}</span>
                  <span v-if="editFeederIndex === index">
                    <input class="form-control form-control-sm" v-model="item.feederName" />
                  </span>
                </td>
                <td>
                  <span v-if="editFeederIndex !== index">{{
                    item.feederDescription
                  }}</span>
                  <span v-if="editFeederIndex === index">
                    <input class="form-control form-control-sm" v-model="item.feederDescription" />
                  </span>
                </td>
                <td>
                  <span v-if="editFeederIndex !== index">
                    <button @click.prevent="edit(item, index)"
                      class="btn btn-small btn-outline-warning waves-effect waves-light orange">
                      <i class="material-icons">edit</i>
                    </button>
                    <button @click.prevent="remove(item, index)"
                      class="btn btn-small btn-outline-danger waves-effect waves-light red">
                      <i class="material-icons">delete</i>
                    </button>
                  </span>
                  <span v-else>
                    <button class="btn btn-small btn-outline-secondary waves-effect waves-light grey"
                      @click.prevent="cancel(item)">
                      <i class="material-icons">cancel</i>
                    </button>
                    <button class="btn btn-small btn-outline-success waves-effect waves-light"
                      @click.prevent="save(item)">
                      <i class="material-icons">save</i>
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--     END Притоки        -->

        <!-- to-do Прибор водоучета -->
        <ul class="collapsible">
          <li>
            <div class="collapsible-header" @click="toggle"><i
                class="material-icons">network_check</i>{{ 'Water_Meter' | localize }}</div>
            <div class="card" v-show="showSection">
              <div class="card-content">
                <div class="input-field">
                  <label for="water-meter-brand">{{ 'Water_Meter_Brand' | localize }}</label>
                  <textarea id="water-meter-brand" v-model="waterMeterBrand" class="materialize-textarea"></textarea>
                  <small id="water-meter-brand-help"
                    class="form-text text-muted helper-text">{{'Indicate_Water_Meter_Brand' | localize}}</small>
                </div>

                <div class="input-field">
                  <label for="last-verification-date">{{ 'Last_Verification_Date' | localize }}</label>
                  <input id="last-verification-date" v-model="lastVerificationDate" type="date" placeholder="Date"
                    class="datepicker" />
                  <small id="last-verification-date-help" class="form-text text-muted"></small>
                </div>

                <!-- <div class="mb-3">
                <label for="formFileMultiple" class="form-label">{{ 'Attach_Documents' | localize }}</label>
                <input class="form-control" type="file" id="formFileMultiple" multiple>
              </div> -->

                <form action="#">
                  <div class="file-field input-field">
                    <div class="btn">
                      <label for="formFileMultiple"
                        class="form-label text-white">{{ 'Attach_Documents' | localize }}</label>
                      <input type="file" multiple>
                    </div>
                    <div class="file-path-wrapper">
                      <input class="file-path validate" type="text" placeholder=".pdf">
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </li>
        </ul>
        <!-- END  Прибор водоучета -->

        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Create' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import localizeFilter from '@/filters/localize.filter'
import 'vue-select/dist/vue-select.css'

export default {
  data: () => ({
    title: '',
    waterBodyCodeAndType: {},
    position: {
      lat: '',
      lng: '',
      draggable: true,
      visible: true,
    },
    waterBodyCodeAndTypeOptions: [
      {
        waterBodyCode: '10',
        waterBodyName: 'Море',
      },
      {
        waterBodyCode: '20',
        waterBodyName: 'Река',
      },
      {
        waterBodyCode: '21',
        waterBodyName: 'Пересыхающая река',
      },
      {
        waterBodyCode: '30',
        waterBodyName: 'Озеро',
      },
      {
        waterBodyCode: '40',
        waterBodyName: 'Водохранилище, пруд',
      },
      {
        waterBodyCode: '41',
        waterBodyName: 'Водохранилище наливное',
      },
      {
        waterBodyCode: '50',
        waterBodyName: 'Магистральный канал',
      },
      {
        waterBodyCode: '55',
        waterBodyName: 'Магистральный трубопровод',
      },
      {
        waterBodyCode: '60',
        waterBodyName: 'Подземный водоносный горизонт',
      },
      {
        waterBodyCode: '61',
        waterBodyName: 'Шахта, рудник, карьер',
      },
      {
        waterBodyCode: '62',
        waterBodyName: 'Скважины вертикального дренажа',
      },
      {
        waterBodyCode: '70',
        waterBodyName: 'Коллекторно-дренажная сеть',
      },
      {
        waterBodyCode: '71',
        waterBodyName: 'Коллекторы, не связанные с речной сетью',
      },
      {
        waterBodyCode: '72',
        waterBodyName: 'Коллекторы, достигающие поверхностные водные объекты',
      },
      {
        waterBodyCode: '80',
        waterBodyName: 'Земледельческие поля орошения',
      },
      {
        waterBodyCode: '81',
        waterBodyName: 'Накопители',
      },
      {
        waterBodyCode: '82',
        waterBodyName: 'Рельеф местности',
      },
      {
        waterBodyCode: '83',
        waterBodyName: 'Поля фильтрации',
      },
      {
        waterBodyCode: '84',
        waterBodyName: 'Септик',
      },
      {
        waterBodyCode: '90',
        waterBodyName: 'Сеть водопровода',
      },
      {
        waterBodyCode: '91',
        waterBodyName: 'Сеть водоотведения',
      },
    ],
    waterIntakeNumber: '',
    guivCode: 'kz64sd',
    seaRiverCode: '',
    distanceFromEstuary: '',
    editFeederIndex: null, // Start притоки
    originalFeederData: null,
    feederItems: [
      {
        id: '1',
        feederCode: '001',
        feederName: 'Приток 1',
        feederDescription: 'Описание',
      },
      {
        id: '2',
        feederCode: '002',
        feederName: 'Приток 2',
        feederDescription: 'Описание',
      },
      {
        id: '3',
        feederCode: '003',
        feederName: 'Приток 3',
        feederDescription: 'Описание',
      },
      {
        id: '4',
        feederCode: '004',
        feederName: 'Приток 4',
        feederDescription: 'Описание',
      },
      {
        id: '5',
        feederCode: '005',
        feederName: 'Приток 5',
        feederDescription: 'Описание',
      },
    ],
    //       end притоки
    showSection: true,
    waterMeterBrand: '',
    lastVerificationDate: new Date(),
  }),
  validations: {
    title: { required },
    waterBodyCodeAndType: { required },
  },
  mounted() {
    // M.updateTextFields(),
    setTimeout(() => {
      this.waterBodyCodeAndType = M.FormSelect.init(
        this.$refs.waterBodyCodeAndType
      )
      M.updateTextFields()
    }, 0)
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const waterIntake = await this.$store.dispatch('createWaterIntake', {
          title: this.title,
          waterBodyCodeAndType: this.waterBodyCodeAndType,
          position: this.position,
          waterIntakeNumber: this.waterIntakeNumber,
          guivCode: this.guivCode,
          distanceFromEstuary: this.distanceFromEstuary,
          feederItems: this.feederItems,
          waterMeterBrand: this.waterMeterBrand,
          lastVerificationDate: this.lastVerificationDate,
          seaRiverCode: this.seaRiverCode
        })
        this.title = ''
        this.waterBodyCodeAndType = {}
        this.position = {}
        this.waterIntakeNumber = ''
        this.guivCode = ''
        this.seaRiverCode = ''
        this.distanceFromEstuary = ''
        this.feederItems = []
        this.waterMeterBrand = ''
        this.lastVerificationDate = ''
        this.$v.$reset()
        this.$message(localizeFilter('Category_HasBeenCreated'))
        this.$emit('created', waterIntake)
      } catch (e) {}
    },

    add() {
      this.originalFeederData = null
      this.feederItems.push({
        feederCode: '',
        feederName: '',
        feederDescription: '',
      })
      this.editFeederIndex = this.feederItems.length - 1
    },
    edit(item, index) {
      this.originalFeederData = Object.assign({}, item)
      this.editFeederIndex = index
    },
    cancel(item) {
      this.editFeederIndex = null
      if (!this.originalFeederData) {
        this.feederItems.splice(this.feederItems.indexOf(item), 1)
        return
      }
      Object.assign(item, this.originalFeederData)
      this.originalFeederData = null
    },
    remove(item, index) {
      this.feederItems.splice(index, 1)
    },
    save(item) {
      this.originalFeederData = null
      this.editFeederIndex = null
    },
    toggle() {
      this.showSection = !this.showSection;
    },
  },
  destroyed() {
    if (this.waterBodyCodeAndType && this.waterBodyCodeAndType.destroy) {
      this.waterBodyCodeAndType.destroy()
    }
  },
}
</script>
