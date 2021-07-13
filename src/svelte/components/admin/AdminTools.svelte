<script>
   // Components
   import StockStatus from './StockStatus.svelte';
   import { AppContent, Drawer, Item, List } from '../../components/material/drawer';

   // Stores
   // Properties
   // Methods
   // Constants
   const comps = [{ i: 0, title: 'Steel Stock Status', comp: StockStatus }];

   // Variables
   let selectedIndex = 0;

   // Subscriptions
   // Reactive Rules
   $: comp = comps.find((nth) => nth.i === selectedIndex).comp;

   // Events
   // Lifecycle
</script>

<main>
   <section class="paper">
      <Drawer open={true} {selectedIndex}>
         <List>
            <Item activated={true}>Steel Stock Status</Item>
         </List>
      </Drawer>
      <AppContent>
         <div class="comp">
            <svelte:component this={comp} />
         </div>
      </AppContent>
   </section>
</main>

<style lang="scss">
   @use './src/scss/vantage-theme';

   .paper {
      @include vantage-theme.vantage-paper;
      @include vantage-theme.vantage-border;
      min-height: calc(100vh - 120px);
      position: relative;
      margin: 1em;
   }

   .comp {
      padding: 16px;
      background-color: #e6e6e6;
      min-height: calc(100vh - 125px);
   }
</style>
