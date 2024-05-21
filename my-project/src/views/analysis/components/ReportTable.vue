<template>
  <table>
    <tbody>
      <slot name="title">
        <tr v-for="(item, i) in title" :key="i">
          <th v-for="(subitem, j) in item" :key="j" :rowspan="subitem.rowspan || 1" :colspan="subitem.colspan || 1" :width="subitem.width || 100">
            <p>{{ subitem.value }}</p>
          </th>
        </tr>
      </slot>
      <tr v-for="(item, i) in content" :key="i">
        <td v-for="(subitem, j) in item" :key="j" :rowspan="subitem.rowspan || 1" :colspan="subitem.colspan || 1" :width="subitem.width || 100">
          <p>{{ subitem.value }}</p>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'ReportTable',
  props: {
    title: {
      type: Array,
      default: () => {
        return []
      }
    },
    content: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>