<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCRipple } from '@material/ripple';

   // Parameters
   export let color = 'primary';
   export let variant = 'text';
   export let disabled = false;
   export let unelevated = false;

   // Variables
   let bind1;
   let buttonRipple;

   let text = variant === 'text' ? 'mdc-button--text' : '';
   let outlined = variant === 'outlined' ? 'mdc-button--outlined' : '';
   let raised = unelevated ? 'mdc-button--unelevated' : 'mdc-button--raised';
   let contained = variant === 'contained' ? raised : '';

   // Reactive Variables
   $: buttonClass = ['mdc-button', `mdc-button-${color}`, text, outlined, contained].join(' ');

   // Lifecycle
   onMount(() => {
      buttonRipple = new MDCRipple(bind1);
   });

   onDestroy(() => {
      buttonRipple.destroy();
   });
</script>

<button bind:this={bind1} on:click {disabled} class={buttonClass}>
   <span class="mdc-button__ripple" />
   <slot />
</button>

<style lang="scss" global>
   @use "@material/theme" with (
      $primary: #ffcb30,
      $secondary: #4d4d4d,
   );

   @use '@material/button';
   @include button.core-styles;

   .mdc-button {
      text-transform: unset;
      @include button.horizontal-padding(12px);

      &.mdc-button {
         &-primary.mdc-button--text {
            @include button.ink-color(#ffffff);
         }

         &-secondary.mdc-button--text {
            @include button.ink-color(#4d4d4d);
         }

         &-primary.mdc-button--outlined {
            @include button.ink-color(#4d4d4d);
            @include button.outline-color(#ffcb30);
         }

         &-secondary.mdc-button--outlined {
            @include button.ink-color(#4d4d4d);
            @include button.outline-color(#4d4d4d);
         }

         &-secondary {
            &.mdc-button--raised,
            &.mdc-button--unelevated {
               @include button.ink-color(#ffffff);
               @include button.container-fill-color(#4d4d4d);
            }
         }
      }
   }
</style>
