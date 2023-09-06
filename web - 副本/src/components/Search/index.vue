<template>
  <mform
    ref="searchForm"
    :items="items"
    :form="form"
    :inline="true"
    class="headerForm"
    :label-width="labelWidth"
    submitButtons
    okBtn="查询"
    cancelBtn="重置"
    @cancel="cancel"
    @submit="submit"
  />
</template>

<script>
export default {
  name: "Search",
  props: {
    form: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    labelWidth: {
      type: String,
      default: "80px",
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },

    submit() {
      this.$emit("submit");
    },
  },
};
</script>

<style></style>
