<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Edit'|localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="wi of waterIntakes" :key="wi.id" :value="wi.id">{{wi.title}}</option>
          </select>
          <label>{{ 'SelectWaterIntake' | localize }}</label>
        </div>

        <div class="input-field">
          <input id="name-edit" type="text" v-model="title" :class="{invalid: $v.title.$dirty && !$v.title.required}">
          <label for="name-edit">{{'Title'|localize}}</label>
          <span v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid">{{'Message_WaterIntakeTitle'|localize}}</span>
        </div>

        <div class="input-field">
          <select ref="waterBodyCodeAndType" v-model="waterBodyCodeAndType" class="form-control" id="water-body-code">
            <option v-for="option in waterBodyCodeAndTypeOptions" :value="option" :key="option.id">
              {{ option.waterBodyName }}
            </option>
          </select>
          <label for="water-body-code">{{'Water_Body_Code_And_Type'|localize}}</label>
          <span v-if="$v.waterBodyCodeAndType.$dirty && !$v.waterBodyCodeAndType.required"
            class="helper-text invalid">{{'Message_WaterIntakeTitle'|localize}}</span>
        </div>

         <div class="input-field">
          <label for="water-intake-number">{{ 'Water_Intake_Number' | localize }}</label>
          <input id="water-intake-number" v-model="waterIntakeNumber" type="text" class="form-control" />
          <small id="water-intake-number" class="form-text text-muted">({{ 'Water_Discharge_Point' | localize }})</small>
        </div>

        <div class="input-field">
          <label for="guiv-code">{{'GUIV_Code' | localize }}</label>
          <input id="guiv-code" v-model="guivCode" type="text" class="form-control" />
          <small id="guiv-code-help" class="form-text text-muted">{{'GUIV_Code_Helper_Text' | localize}}</small>
        </div>

        <div class="input-field">
             <label for="sea-river-code">{{'Sea_River_Code' | localize }}</label>
             <input id="sea-river-code" v-model="seaRiverCode" type="text" class="form-control" />
             <small id="sea-river-code-help" class="form-text text-muted"></small>
             <span> </span>
        </div>

        <div class="input-field">
          <label for="distance-from-estuary">{{ 'Distance_From_Estuary' | localize }}</label>
          <input id="distance-from-estuary" v-model="distanceFromEstuary" type="text" class="form-control" />
          <small id="distance-from-estuary-help" class="form-text text-muted">({{'KM' | localize}})</small>
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
                    <input
                      class="form-control form-control-sm"
                      v-model="item.feederCode"
                    />
                  </span>
                </td>
                <td>
                  <span v-if="editFeederIndex !== index">{{
                    item.feederName
                  }}</span>
                  <span v-if="editFeederIndex === index">
                    <input
                      class="form-control form-control-sm"
                      v-model="item.feederName"
                    />
                  </span>
                </td>
                <td>
                  <span v-if="editFeederIndex !== index">{{
                    item.feederDescription
                  }}</span>
                  <span v-if="editFeederIndex === index">
                    <input
                      class="form-control form-control-sm"
                      v-model="item.feederDescription"
                    />
                  </span>
                </td>
                <td>
                  <span v-if="editFeederIndex !== index">
                    <button
                      @click.prevent="edit(item, index)"
                      class="btn btn-small btn-outline-warning waves-effect waves-light orange"
                    >
                      <i class="material-icons">edit</i>
                    </button>
                    <button
                      @click.prevent="remove(item, index)"
                      class="btn btn-small btn-outline-danger waves-effect waves-light red"
                    >
                      <i class="material-icons">delete</i>
                    </button>
                  </span>
                  <span v-else>
                    <button
                      class="btn btn-small btn-outline-secondary waves-effect waves-light grey"
                      @click.prevent="cancel(item)"
                    >
                      <i class="material-icons">cancel</i>
                    </button>
                    <button
                      class="btn btn-small btn-outline-success waves-effect waves-light"
                      @click.prevent="save(item)"
                    >
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
          <div class="collapsible-header" @click="toggle"><i class="material-icons">network_check</i>{{ 'Water_Meter' | localize }}</div>
           <div class="card" v-show="showSection">
             <div class="card-content">
              <div class="input-field">
                <label for="water-meter-brand">{{ 'Water_Meter_Brand' | localize }}</label>
                <textarea id="water-meter-brand" v-model="waterMeterBrand" class="materialize-textarea"></textarea>
                <small id="water-meter-brand-help" class="form-text text-muted helper-text">{{'Indicate_Water_Meter_Brand' | localize}}</small>
              </div>

              <div class="input-field">
                <label for="last-verification-date">{{ 'Last_Verification_Date' | localize }}</label>
                <input id="last-verification-date" v-model="lastVerificationDate" type="date" placeholder="Date"  class="datepicker" />
                <small id="last-verification-date-help" class="form-text text-muted"></small>
              </div>
            </div>
           </div>
        </li>
      </ul>
     <!-- END  Прибор водоучета -->

        <!-- Start Coordinates -->
        <div class="section"><i class="material-icons">add_location_alt</i> {{'Coordinates' | localize }} </div>
        <hr>
        <!-- <h6>Координаты</h6> -->
        <table class="responsive-table meta-table">
          <tr>
            <th>{{'Title' | localize }}</th>
            <th>{{'Latitude' | localize }}</th>
            <th>{{'Longitude' | localize }}</th>
          </tr>
          <tr v-for="item of waterIntakes" :key="item.id" :value="item.id">
            <td data-label="Title">
              {{item.title}}</td>
            <td>
              <input v-model.number="item.position.lat" type="number" step="any">
            </td>
            <td>
              <input v-model.number="item.position.lng" type="number" step="any">
            </td>
          </tr>
        </table>

        <div id="example" style="height: 100%; overflow: auto;">
          <l-map ref="myMap" :zoom.sync="zoom" :options="mapOptions" :center="center" :bounds="bounds"
            :min-zoom="minZoom" :max-zoom="maxZoom" style="height: 300px; width: 100%;" id="mymap">
            <l-control-layers :position="layersPosition" />
            <l-tile-layer v-for="tileProvider in tileProviders" :key="tileProvider.name" :name="tileProvider.name"
              :visible="tileProvider.visible" :url="tileProvider.url" :attribution="tileProvider.attribution"
              :token="token" layer-type="base" />
            <l-control-zoom :position="zoomPosition" />
            <l-control-attribution :position="attributionPosition" :prefix="attributionPrefix" />
            <l-control-scale :imperial="imperial" />

            <l-marker v-for="marker in waterIntakes" :key="marker.id" :visible="true" :draggable="true"
              :lat-lng.sync="marker.position" :icon="marker.icon">
              <l-popup :content="marker.title" />
              <l-tooltip :content="marker.title" />
            </l-marker>

          </l-map>
        </div>
        <hr>
        <!-- END Coordinates -->
        <button class="btn waves-effect waves-light" type="submit">
          {{'Update'|localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>

import {
  required,
  minValue
} from 'vuelidate/lib/validators';

import localizeFilter from '@/filters/localize.filter';
import 'vue-select/dist/vue-select.css';

// If you need to reference 'L', such as in 'L.icon', then be sure to
// explicitly import 'leaflet' into your component
import L from 'leaflet';

import {
  latLngBounds,
  Icon
} from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

import {
  LMap,
  LTileLayer,
  LMarker,
  LLayerGroup,
  LTooltip,
  LPopup,
  LControlZoom,
  LControlAttribution,
  LControlScale,
  LControlLayers
} from 'vue2-leaflet';

const tileProviders = [{
    name: 'OpenStreetMap',
    visible: true,
    attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    name: 'OpenTopoMap',
    visible: false,
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
];

export default {
  props: {
    waterIntakes: {
      type: Array,
      required: true
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LLayerGroup,
    LTooltip,
    LPopup,
    LControlZoom,
    LControlAttribution,
    LControlScale,
    LControlLayers
  },
  data: () => ({
    select: null,
    title: '',
    waterBodyCodeAndType: null,
    waterBodyCodeAndTypeOptions: [{
        waterBodyCode: "10",
        waterBodyName: "Море"
      },
      {
        waterBodyCode: "20",
        waterBodyName: "Река"
      },
      {
        waterBodyCode: "21",
        waterBodyName: "Пересыхающая река"
      },
      {
        waterBodyCode: "30",
        waterBodyName: "Озеро"
      },
      {
        waterBodyCode: "40",
        waterBodyName: "Водохранилище, пруд"
      },
      {
        waterBodyCode: "41",
        waterBodyName: "Водохранилище наливное"
      },
      {
        waterBodyCode: "50",
        waterBodyName: "Магистральный канал"
      },
      {
        waterBodyCode: "55",
        waterBodyName: "Магистральный трубопровод"
      },
      {
        waterBodyCode: "60",
        waterBodyName: "Подземный водоносный горизонт"
      },
      {
        waterBodyCode: "61",
        waterBodyName: "Шахта, рудник, карьер"
      },
      {
        waterBodyCode: "62",
        waterBodyName: "Скважины вертикального дренажа"
      },
      {
        waterBodyCode: "70",
        waterBodyName: "Коллекторно-дренажная сеть"
      },
      {
        waterBodyCode: "71",
        waterBodyName: "Коллекторы, не связанные с речной сетью"
      },
      {
        waterBodyCode: "72",
        waterBodyName: "Коллекторы, достигающие поверхностные водные объекты"
      },
      {
        waterBodyCode: "80",
        waterBodyName: "Земледельческие поля орошения"
      },
      {
        waterBodyCode: "81",
        waterBodyName: "Накопители"
      },
      {
        waterBodyCode: "82",
        waterBodyName: "Рельеф местности"
      },
      {
        waterBodyCode: "83",
        waterBodyName: "Поля фильтрации"
      },
      {
        waterBodyCode: "84",
        waterBodyName: "Септик"
      },
      {
        waterBodyCode: "90",
        waterBodyName: "Сеть водопровода"
      },
      {
        waterBodyCode: "91",
        waterBodyName: "Сеть водоотведения"
      }
    ],
    current: null,
    position: null,
    waterIntakeNumber: null,
    guivCode: null,
    seaRiverCode: null,
    distanceFromEstuary: null,
    editFeederIndex: null, // Start притоки
    originalFeederData: null,
    feederItems: [ ],
    // end притоки
    showSection: true,
    waterMeterBrand: null,
    lastVerificationDate: null,
    // related to map
    visible: true,
    // center: [47.989921667414194, 68.73046875000001], 
    center: L.latLng(49.7130280, 81.5851838),
    opacity: 0.6,
    token: 'your token if using mapbox',
    mapOptions: {
      zoomControl: false,
      attributionControl: false,
      zoomSnap: true,
    },
    zoom: 6,
    minZoom: 1,
    maxZoom: 20,
    zoomPosition: 'topleft',
    attributionPosition: 'bottomright',
    layersPosition: 'topright',
    attributionPrefix: 'Vue2Leaflet',
    imperial: false,
    tileProviders: tileProviders,
    bounds: latLngBounds({
        lat: 47.517200697839414,
        lng: 49.21875000000001
      }, // Atyrau coordinates - _southWest
      {
        lat: 48.50204750525715,
        lng: 85.47363281250001
      }, // Oskemen coordinates - _northEast
    ),
  }),
  validations: {
    title: {
      required
    },
    waterBodyCodeAndType: {
      required
    }
  },
  watch: {
    current(wiId) {
      const {
        title,
        waterBodyCodeAndType,
        position,
        waterIntakeNumber,
        guivCode,
        seaRiverCode,
        distanceFromEstuary,
        feederItems,
        waterMeterBrand,
        lastVerificationDate
      } = this.waterIntakes.find(wi => wi.id === wiId)
      this.title = title
      this.waterBodyCodeAndType = waterBodyCodeAndType
      this.position = position
      this.waterIntakeNumber = waterIntakeNumber
      this.guivCode = guivCode,
      this.seaRiverCode = seaRiverCode,
      this.distanceFromEstuary = distanceFromEstuary
      this.feederItems = feederItems,
      this.waterMeterBrand = waterMeterBrand,
      this.lastVerificationDate = lastVerificationDate
    },
  },
  created() {
    const {
      id,
      title,
      waterBodyCodeAndType,
      position,
      waterIntakeNumber,
      guivCode,
      seaRiverCode,
      distanceFromEstuary,
      feederItems,
      waterMeterBrand,
      lastVerificationDate
    } = this.waterIntakes[0]
    this.current = id
    this.title = title
    this.waterBodyCodeAndType = waterBodyCodeAndType
    this.position = position
    this.waterIntakeNumber = waterIntakeNumber
    this.guivCode = guivCode
    this.seaRiverCode = seaRiverCode
    this.distanceFromEstuary = distanceFromEstuary
    this.feederItems = feederItems,
    this.waterMeterBrand = waterMeterBrand,
    this.lastVerificationDate = lastVerificationDate
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const waterIntakeData = {
          id: this.current,
          title: this.title,
          waterBodyCodeAndType: this.waterBodyCodeAndType,
          position: { lat: this.getNewLat, lng: this.getNewLng, draggable: true, visible: true },
          waterIntakeNumber: this.waterIntakeNumber,
          guivCode: this.guivCode,
          seaRiverCode: this.seaRiverCode,
          distanceFromEstuary: this.distanceFromEstuary,
          feederItems: this.feederItems,
          waterMeterBrand: this.waterMeterBrand,
          lastVerificationDate: this.lastVerificationDate
        }
        await this.$store.dispatch('updateWaterIntake', waterIntakeData)
        this.$message(localizeFilter('WaterIntake_HasBeenUpdated'))
        this.$emit('updated', waterIntakeData)
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
  // TO-DO update for dynamic waterIntakes id
  computed: {
    getNewLat() {
      return this.waterIntakes[0].position.lat
    },
    getNewLng() {
      return this.waterIntakes[0].position.lng
    },
  },
  mounted() {
    this.waterBodyCodeAndType = M.FormSelect.init(this.$refs.waterBodyCodeAndType)
    this.select = M.FormSelect.init(this.$refs.select)
    this.selectContol = M.FormSelect.init(this.$refs.selectContol)

    M.updateTextFields();
  },
  destroyed() {
    if (this.waterBodyCodeAndType && this.waterBodyCodeAndType.destroy) {
      this.waterBodyCodeAndType.destroy()
    }
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
     if (this.position && this.position.destroy) {
      this.position.destroy()
    }
  }
}
</script>
