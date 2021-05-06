<script>
   import { forwardEvents } from '../lib/forwardEvents.js';
   import { get_current_component } from 'svelte/internal';
   import { onDestroy, onMount } from 'svelte';
   import { MDCDialog } from '@material/dialog';

   // Properties
   export let open = false;

   // Methods
   // Constants
   const events = forwardEvents(get_current_component(), ['MDCDialog:closed', 'MDCDialog:opened']);

   // Variables
   let div = undefined;
   let Dialog = undefined;

   // Subscriptions
   // Reactive Variables
   // Reactive Rules
   $: if (Dialog) {
      if (open) {
         Dialog.open();
      } else {
         Dialog.close();
      }
   }

   // Events
   const onClosed = () => {
      open = false;
   };

   const onOpened = () => {
      open = true;
   };

   // Lifecycle
   onMount(() => {
      Dialog = new MDCDialog(div);
   });

   onDestroy(() => {
      Dialog.destroy();
   });
</script>

<div bind:this={div} use:events on:MDCDialog:opened={onOpened} on:MDCDialog:closed={onClosed} class="mdc-dialog">
   <div class="mdc-dialog__container">
      <div class="mdc-dialog__surface" role="alertdialog">
         <slot />

         <!-- <div class="mdc-dialog__actions">
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
               <div class="mdc-button__ripple" />
               <span class="mdc-button__label">Cancel</span>
            </button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="discard">
               <div class="mdc-button__ripple" />
               <span class="mdc-button__label">Discard</span>
            </button>
         </div> -->
      </div>
   </div>
   <div class="mdc-dialog__scrim" />
</div>

<style lang="scss" global>
   @use '@material/dialog';
   @include dialog.core-styles;
</style>
