<script>
   import { forwardEvents } from '../lib/forwardEvents.js';
   import { get_current_component } from 'svelte/internal';
   import { onDestroy, onMount } from 'svelte';
   import { MDCBanner } from '@material/banner';

   // Parameters
   export let open = false;
   export let centered = false;

   // Methods
   // Constants
   const events = forwardEvents(get_current_component(), ['MDCBanner:closed', 'MDCBanner:opened']);
   const divClass = ['mdc-banner', centered ? 'mdc-banner--centered' : ''].join(' ');

   // Variables
   let bind;
   let Banner;

   // Reactive Variables

   // Reactive Rules
   $: if (open) {
      Banner.open();
   }

   // Events
   const onClosed = () => {
      open = false;
   };

   const onOpended = () => {
      open = true;
   };

   // Lifecycle
   onMount(() => {
      Banner = new MDCBanner(bind);
   });

   onDestroy(() => {
      Banner.destroy();
   });
</script>

<div bind:this={bind} use:events on:MDCBanner:closed={onClosed} on:MDCBanner:opened={onOpended} class={divClass} role="banner">
   <div class="mdc-banner__content" role="status" aria-live="assertive">
      <slot />
      <!-- <div class="mdc-banner__actions">
         <button type="button" class="mdc-button mdc-banner__primary-action">
            <div class="mdc-button__ripple" />
            <div class="mdc-button__label">Fix it</div>
         </button>
      </div> -->
   </div>
</div>

<style lang="scss" global>
   @use "@material/banner/styles";
</style>
