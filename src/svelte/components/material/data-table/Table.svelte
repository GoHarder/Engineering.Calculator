<script>
   import { onMount } from 'svelte';
   import { MDCDataTable } from '@material/data-table';

   export let sticky = false;

   let bind = undefined;
   let DataTable = undefined;

   onMount(() => {
      DataTable = new MDCDataTable(bind);
   });
</script>

<div bind:this={bind} class="mdc-data-table" class:mdc-data-table--sticky-header={sticky}>
   <div class="mdc-data-table__table-container">
      <table class="mdc-data-table__table">
         <slot />
      </table>
   </div>
</div>

<style lang="scss" global>
   @use "@material/data-table";
   @include data-table.core-styles;

   .mdc-data-table {
      @include data-table.header-row-fill-color(#f2f2f2);

      .mdc-data-table__header-cell {
         font-weight: bold;
      }

      .mdc-data-table__table-container {
         overflow: unset;
      }
   }
</style>
