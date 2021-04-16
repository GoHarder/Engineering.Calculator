<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCDrawer } from '@material/drawer';

   // Properties
   export let open = false;
   export let variant = 'dismissible';
   export let selectedIndex = 0;

   // Constants
   const asideClass = ['mdc-drawer', `mdc-drawer--${variant}`].join(' ').trim();

   // Variables
   let aside = undefined;
   let Drawer = undefined;

   // Reactive Rules
   $: if (Drawer) {
      Drawer.open = open;
   }

   $: if (Drawer && `${selectedIndex}`) {
      Drawer.list.selectedIndex = selectedIndex;
      // console.log(Drawer.list);
   }

   // Lifecycle
   onMount(() => {
      Drawer = MDCDrawer.attachTo(aside);
   });

   onDestroy(() => {
      Drawer.destroy();
   });
</script>

<aside bind:this={aside} class={asideClass}>
   <div class="mdc-drawer__content">
      <slot />
   </div>
</aside>

<style lang="scss" global>
   @use "@material/drawer";
   @use '@material/ripple';
   @include drawer.core-styles;
   @include drawer.dismissible-core-styles;
   @include drawer.modal-core-styles;
   @import './src/scss/vantage-theme';

   .mdc-drawer {
      @include drawer.item-activated-text-ink-color(black);
      @include drawer.item-shape-radius(0, 0);
      .mdc-list-item.mdc-list-item--activated {
         .mdc-list-item__ripple {
            @include ripple.states-base-color($mdc-theme-secondary);
         }
      }
   }
</style>
