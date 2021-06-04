<script>
   import { fade } from 'svelte/transition';

   // Properties
   export let title = '';
</script>

<fieldset transition:fade>
   <legend>{title}</legend>
   <hr />
   <slot />
</fieldset>

<style lang="scss">
   @use './src/scss/vantage-theme';

   fieldset {
      @include vantage-theme.vantage-fieldset;
      flex-basis: calc(calc(500px - 100%) * 10000);
      flex-grow: 1;
      max-width: 500px;
      min-width: 400px;
   }
</style>
