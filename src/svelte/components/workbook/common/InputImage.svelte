<script>
   import { slide, fly } from 'svelte/transition';
   // Components
   // Stores
   // Properties
   export let alt = '';
   export let focused = false;
   export let height = 250;
   export let src = '';
   // export let width = 0;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Reactive Variables
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<div class="input-bump input-image" transition:slide>
   {#if focused}
      <img {src} {alt} {height} transition:fly={{ y: 50, opacity: 0 }} />
   {/if}
   <slot />
</div>

<style lang="scss">
   @use 'src/scss/vantage-theme';
   .input-image {
      position: relative;
      img {
         @include vantage-theme.vantage-paper;
         position: absolute;
         bottom: calc(100% + 19px);
         left: 0;
         border: 2px solid #ffcb30;
         background-color: #ffffff;
         z-index: 10;
      }
   }
</style>
