<template>
  <div class="meta-table">
    <div class="page-title">
      <h5>{{'History_Title'|localize}}</h5>
      <p class="subcomponent-title">{{companyType.nameRu}} {{ companyName }}</p>
    </div>
    <vue-good-table :columns="columns" :rows="records"
      :search-options="{ enabled: true, placeholder: 'Введите текст для поиска' }"
      :pagination-options="paginationOptions">
      <div slot="table-actions">
        <!-- download excel -->
        <download-excel :data="records" :fields="json_fields" class="btn-small"
          worksheet="waster" name="water.xls" v-tooltip="'Download_Data_XLSX'">
          <span class="material-icons">cloud_download</span>
        </download-excel>
      </div>
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'action'">
          <button v-tooltip="'OpenRecord'" class="btn-small btn" @click="$router.push('/detail/' + props.row.id)">
            <i class="material-icons">open_in_new</i>
          </button>
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
// import the vue-good-table styles
import 'vue-good-table/dist/vue-good-table.css'
import {
  VueGoodTable
} from 'vue-good-table'

import flatPickr from "flatpickr";

import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/themes/material_blue.css";

export default {
  name: 'log-book-table',
  components: {
    VueGoodTable,
    flatPickr
  },
  props: {
    records: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      columns: [{
          label: 'Объем, м3',
          field: 'amount',
          type: 'number',
          sortable: true,
          tdClass: 'center-align',
        },
        {
          label: 'Дата',
          field: 'recordDate',
          type: 'date',
          dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
          dateOutputFormat: 'dd-MM-yyyy',
          sortable: true,
          filterOptions: {
            enabled: true,
            placeholder: "выберите даты",
            filterFn: this.dateRangeFilter
          }
          //   filterable: true,
          //   filterOptions: {
          //     enabled: true,
          //     placeholder: "выберите даты",
          //     filterFn: this.dateRangeFilter
          //   }
        },
        {
          label: 'Код Категории',
          field: 'categoryCode',
        },
        {
          label: 'Категория',
          field: 'categoryName',
        },
        {
          label: 'Код водного объекта',
          field: 'waterBody.waterBodyCodeAndType.waterBodyCode',
        },
        {
          label: 'Тип водного объекта',
          field: 'waterBody.waterBodyCodeAndType.waterBodyName',
        },
        {
          label: 'Название категории',
          field: 'categoryName',
          type: 'number',
        },
        {
          label: 'Водный объект',
          field: 'waterBody.title',
        },
        {
          label: 'Водопотребитель',
          field: 'waterConsumer.waterConsumerName',
        },
        {
          label: 'Тип водопотребителя',
          field: 'waterConsumer.waterConsumerType',
          tdClass: 'center-align',
          formatFn: this.translateType
        },
        {
          label: 'Тип водопотребления',
          field: 'typeText',
          filterOptions: {
            enabled: true,
            filterDropdownItems: ['Расход', 'Прием'],
            placeholder: 'Любой',
          },
        },
        {
          label: 'Действия',
          field: 'action',
          sortable: false,
        },
      ],
      paginationOptions: {
        enabled: true,
        mode: 'records',
        perPage: 5,
        position: 'bottom',
        perPageDropdown: [5, 10, 20],
        dropdownAllowAll: false,
        setCurrentPage: 1,
        nextLabel: '>',
        prevLabel: '<',
        rowsPerPageLabel: 'Строк на странице',
        ofLabel: '/',
        pageLabel: 'стр.', // for 'pages' mode
        allLabel: 'Все',
      },
      // related to excel export
      json_fields: {
        Объем: 'amount',
        'Дата вывоза': {
          field: 'recordDate',
          callback: value => {
            return value.substring(0, 10)
          }
        },
        'Код Категории': 'categoryCode',
        'Код водного объекта': 'waterBody.waterBodyCodeAndType.waterBodyCode',
        'Тип водного объекта': 'waterBody.waterBodyCodeAndType.waterBodyName',
        'Название категории': 'categoryName',
        'Водный объект': 'waterBody.title',
        'Водопотребитель': 'waterConsumer.waterConsumerName',

        'Тип водопотребителя': {
          field: 'waterConsumer.waterConsumerType',
          callback: value => {
            const map = {
              secondaryWaterUser: 'Вторичный водопотребитель',
              internalWaterUser: 'Внутреннее водопотребление',
            };
            return `${map[value]}`;
          }
        },
        'Тип водопотребления': 'typeText',
      },
      json_meta: [
        [{
          key: 'charset',
          value: 'utf-8'
        }]
      ]
    }
  },
  mounted() {
    // related to range select - flatpkr
    let inputs = [
      'input[placeholder="выберите даты"]',
      'input[placeholder="Filter Start Date"]',
      'input[placeholder="Filter Need By Date"]'
    ];
    inputs.forEach(function (input) {
      flatPickr(input, {
        mode: "range",
        dateFormat: 'n/j/Y',
        mode: "range",
        showMonths: 2,
        allowInput: true,
        onOpen: function (selectedDates, dateStr, instance) {
          instance.setDate(instance.input.value, false);
        }
      });
    });
  },
  computed: {
    companyName() {
      return this.$store.getters.info.companyName
    },
    companyType() {
      return this.$store.getters.info.companyType
    },
    // IE 11 or later
    format(date) {
      var month = date.toLocaleString('en-US', { month: 'short' })
      return date.getDate() + ' ' + month + ' ' + date.getFullYear()
    }
  },
  methods: {
    translateType(value) {
      const map = {
        internalWaterUser: 'Внутреннее водопотребление', // to-do add rest of the waterUsers
        secondaryWaterUser: 'Вторичный водопотребитель'
        // amber: 'Янтарный',
      };
      return `${map[value]}`;
    },
    // related to range select - flatpkr
    dateRangeFilter(data, filterString) {
      let dateRange = filterString.split("to");
      let startDate = Date.parse(dateRange[0]);
      let endDate = Date.parse(dateRange[1]);
      return (data =
        Date.parse(data) >= startDate && Date.parse(data) <= endDate);
    },
  }
}
</script>

<style >
    @import '../assets/meta-table.scss';
</style>
