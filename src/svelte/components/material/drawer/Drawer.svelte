<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCDrawer } from '@material/drawer';

   // Components
   // Properties
   export let open = false;
   export let variant = 'dismissible';

   // Methods
   // Constants
   const asideClass = ['mdc-drawer', `mdc-drawer--${variant}`].join(' ').trim();

   // Variables
   let aside = undefined;
   let Drawer = undefined;

   // Subscriptions
   // Reactive Variables
   // Reactive Rules
   $: if (Drawer) {
      Drawer.open = open;
   }

   // Events
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
      <div class="mdc-drawer__header">
         <h3 class="mdc-drawer__title">Modules</h3>
      </div>
      <nav class="mdc-list">
         <span class="mdc-list-item mdc-list-item--activated" aria-current="page">
            <span class="mdc-list-item__ripple" />
            <span class="mdc-list-item__text">Weight Calculations</span>
         </span>
         <span class="mdc-list-item">
            <span class="mdc-list-item__ripple" />
            <span class="mdc-list-item__text">Counterweight</span>
         </span>
      </nav>
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
