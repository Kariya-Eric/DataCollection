<template>
  <div></div>
</template>

<script>
//排他性校验
export default {
  name: 'RuleExclusivity',
  props: ['value', 'drawingList'],
  data() {
    return {
      exclusiveVal: [
        {
          left: [
            {
              operator: '',
              type: 'current',
              value: 'fied102'
            },
            {
              operator: '',
              type: 'current',
              value: 'fied102'
            },
            {
              operator: '',
              type: 'current',
              value: 'fied102'
            },
            {
              operator: '',
              type: 'current',
              value: 'fied102'
            }
          ],
          operator: '',
          right: [
            {
              operator: '',
              type: 'current',
              value: 'fied102'
            }
          ],
          and_or: ''
        }
      ]
    }
  },

  methods: {}
}
</script>

<style scoped lang="scss"></style>
