<template>
  <component
    v-if="component"
    :is="component"
    @click="$emit('clickIcon', $event)"
  />
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
    },

    svgPath: {
      type: String,
    },
  },
  data() {
    return {
      component: null,
    };
  },
  computed: {
    loader() {
      if (!this.icon && !this.svgPath) {
        return null;
      }

      return () => import(`@/assets/icons/${this.icon}.svg?inline`);
    },
  },
  mounted() {
    if (this.loader) {
      this.loader().then(() => {
        this.component = () => this.loader();
      });
    }
  },
};
</script>
