<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCRipple } from '@material/ripple';
   import { MDCIconButtonToggle } from '@material/icon-button';

   // export let value = false;
   export let toggle = false;

   // Variables
   let bind;
   let ButtonRipple;
   let ButtonToggle;

   // Lifecycle
   onMount(() => {
      ButtonRipple = new MDCRipple(bind);
      if (toggle) {
         ButtonToggle = new MDCIconButtonToggle(bind);
      }
      ButtonRipple.unbounded = true;
   });

   onDestroy(() => {
      ButtonRipple.destroy();
      if (toggle) {
         ButtonToggle.destroy();
      }
   });
</script>

<button bind:this={bind} on:click class="mdc-icon-button">
   <slot />
</button>

<style lang="scss" global>
   @use "@material/icon-button";
   @include icon-button.core-styles;
</style>
