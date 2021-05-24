<script>
   import { slide } from 'svelte/transition';

   // Properties
   export let count = 0;
   export let check = false;
</script>

<!-- html -->
<div class="wrapper">
   <slot />
   {#if count} <p transition:slide>{count}</p> {/if}
   {#if check} <p transition:slide>✔</p> {/if}
</div>

<style lang="scss">
   @use './src/scss/vantage-theme';

   .wrapper {
      display: inline-block;
      position: relative;
   }

   p {
      background-color: vantage-theme.$mdc-theme-primary;
      color: vantage-theme.$mdc-theme-secondary;
      position: absolute;
      border-radius: 50px;
      right: 0;
      top: 0;
      margin: 0 auto;
      pointer-events: none;
      width: 20px;
      height: 20px;
      font-size: 0.8rem;
      text-align: center;
   }
</style>
