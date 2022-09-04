<template>
  <BaseFormFieldVue :title="title" :error="error">
    <textarea class="form__input form__input--area" :placeholder="placeholder"
              v-model="dataValue"></textarea>
  </BaseFormFieldVue>
</template>

<script>
import formFieldMixins from '@/mixins/formFieldMixin';

export default {
  mixins: [formFieldMixins],
};
</script>
