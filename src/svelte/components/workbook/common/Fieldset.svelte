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
      @include vantage-theme.vantage-paper;
      border: none;
      background-color: white;
      margin: 5px;
      flex-basis: calc(calc(500px - 100%) * 10000);
      flex-grow: 1;
      max-width: 500px;
      min-width: 400px;
   }

   fieldset > hr {
      clear: both;
      border: 1px solid vantage-theme.$mdc-theme-primary;
   }

   legend {
      font-size: 1.1rem;
      margin: 6px 0 10px;
      float: left;
      clear: right;
   }
</style>
