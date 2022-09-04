<template>
  <BaseFormFieldVue :title="title" :error="error">
    <input class="form__input" :type="type" :placeholder="placeholder" v-model="dataValue">
  </BaseFormFieldVue>
</template>

<script>

import formFieldMixins from '@/mixins/formFieldMixin';

export default {
  props: {
    type: {
      default: 'text',
    },
  },
  mixins: [formFieldMixins],
};
</script>
