<template>
  <div class="meta-table">
    <vue-good-table :columns="columns" :rows="records" :search-options="{ enabled: true, placeholder: 'Введите текст для поиска' }" :pagination-options="paginationOptions">
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'action'">
          <button
            v-tooltip="'OpenRecord'"
            class="btn-small btn"
            @click="$router.push('/detail/' + props.row.id)"
          >
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

export default {
  name: 'log-book-table',
  components: {
    VueGoodTable,
  },
  props: {
    records: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      columns: [
        {
          label: 'Объем, м3',
          field: 'amount',
          type: 'number',
          sortable: true,
          tdClass: 'center-align',
        },
        {
          label: 'Дата',
          field: 'date',
          type: 'date',
          dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
          dateOutputFormat: 'dd-MM-yyyy',
          sortable: true,
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
          label: 'Тип водопотребителя',
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
    }
  },
  methods: {
      translateType(value) {
        const map = {
            internalWaterUser: 'Внутреннее водопотребление', // to-do add rest of the waterUsers
            // amber: 'Янтарный',
        };
      return `${map[value]}`;
    },
  }
}
</script>

<style >
    @import '../assets/meta-table.scss';
</style>
