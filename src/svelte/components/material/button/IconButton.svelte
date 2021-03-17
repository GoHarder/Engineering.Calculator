<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCRipple } from '@material/ripple';
   import { MDCIconButtonToggle } from '@material/icon-button';

   // export let value = false;
   export let color = 'default';
   export let toggle = false;
   export let title = '';

   // Constants
   const buttonClass = ['mdc-icon-button', color].join(' ');

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

<button bind:this={bind} {title} on:click class={buttonClass}>
   <slot />
</button>

<style lang="scss" global>
   @use "@material/icon-button";
   @include icon-button.core-styles;

   .mdc-icon-button {
      &.primary {
         @include icon-button.ink-color(rgba($color: #000000, $alpha: 0.87));
         background-color: #ffcb30;
         border-radius: 100%;
      }
      &.secondary {
         @include icon-button.ink-color(#ffffff);
         background-color: #4d4d4d;
         border-radius: 100%;
      }
   }
</style>
