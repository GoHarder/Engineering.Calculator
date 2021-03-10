<script>
   import { forwardEvents } from '../lib/forwardEvents.js';
   import { get_current_component } from 'svelte/internal';
   import { onDestroy, onMount } from 'svelte';
   import { MDCMenu } from '@material/menu';

   // Parameters
   export let open = false;
   export let corner = 'bottom-left';

   // Constants
   const events = forwardEvents(get_current_component(), ['MDCMenuSurface:closed', 'MDCMenuSurface:opened']);

   const corners = {
      'top-left': 0,
      'top-right': 4,
      'bottom-left': 1,
      'bottom-right': 5,
   };

   // Variables
   let bind1 = undefined;
   let Menu = undefined;

   // Reactive Rules
   $: if (Menu) {
      Menu.open = open;
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
      Menu = new MDCMenu(bind1);
      Menu.setAnchorCorner(corners[corner]);
   });

   onDestroy(() => {
      Menu.destroy();
   });
</script>

<div bind:this={bind1} use:events on:MDCMenuSurface:opened={onOpened} on:MDCMenuSurface:closed={onClosed} class="mdc-menu mdc-menu-surface">
   <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
      <slot />
   </ul>
</div>

<style lang="scss" global>
   @use "@material/list/mdc-list";
   @use "@material/menu-surface/mdc-menu-surface";
   @use "@material/menu/mdc-menu";

   .mdc-list-item {
      display: flex;
   }
</style>
