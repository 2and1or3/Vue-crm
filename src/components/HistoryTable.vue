<template>
  <table>
    <thead>
    <tr>
      <th>#</th>
      <th>{{'History_Amount' | localize}}</th>
      <th>{{'History_Date' | localize}}</th>
      <th>{{'History_Category' | localize}}</th>
      <th>{{'History_Type' | localize}}</th>
      <th>{{'History_Open' | localize}}</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="(record, i) in records" :key="record.id">
      <td>{{i + 1}}</td>
      <td>{{record.amount |currency('RUB')}}</td>
      <td>{{record.date | date('datetime')}}</td>
      <td>{{record.categoryName}}</td>
      <td>
        <span
          class="white-text badge"
          :class="[record.typeClass]"
        >{{record.typeText}}</span>
      </td>
      <td>
        <button
          class="btn-small btn"
          @click="$router.push(`/detail-record/${record.id}`)"
          v-tooltip=tooltipMessage
        >
          <i class="material-icons">open_in_new</i>
        </button>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import localizeFilter from '@/filters/locolize.filter'

export default {
  name: 'history-table',
  props: ['records'],
  computed: {
    tooltipMessage: () => localizeFilter('History_Tooltip_Watch')
  }

}
</script>
