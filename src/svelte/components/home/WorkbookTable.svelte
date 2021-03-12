<!-- NOTE: Depricated -->
<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import WorkbookRow from './WorkbookRow.svelte';

   // SMUI Components
   import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

   // Constants
   const dispatch = createEventDispatcher();

   // Properties
   export let userId = '';
   export let workbooks = [];

   // Reactive Rules
   $: rows = workbooks.map((book) => {
      book.creator = `${book.creator.firstName} ${book.creator.lastName}`;

      const user = book.opened.find((user) => user.userId === `${userId}`);

      book.opened = user ? user.time : 0;

      return book;
   });

   // Events
   const onSelect = (event) => dispatch('select', event.detail);

   const onDelete = (event) => dispatch('delete', event.detail);

   const onShare = (event) => dispatch('share', event.detail);
</script>

<DataTable class="workbook-table">
   <Head>
      <Row>
         <Cell style="text-align: center">Contract #</Cell>
         <Cell style="text-align: center">Job Name</Cell>
         <Cell style="text-align: center">Car #</Cell>
         <Cell style="text-align: center">Customer</Cell>
         <Cell style="text-align: center">Layout #</Cell>
         <Cell style="text-align: center">Created</Cell>
         <Cell style="text-align: center">Last Opened</Cell>
         <Cell style="text-align: center">Owned By</Cell>
         <Cell />
      </Row>
   </Head>
   <Body>
      {#each rows as workbook (workbook._id)}
         <WorkbookRow {...workbook} on:select={onSelect} on:delete={onDelete} on:share={onShare} />
      {/each}
   </Body>
</DataTable>

<style lang="scss">
   :global {
      .workbook-table {
         border-top: 5px solid #ffcb30;
         min-width: 1200px;
         overflow-x: visible;

         table {
            thead {
               background-color: #f2f2f2;
               border-bottom: 3px solid #d9d9d9;
               tr {
                  th {
                     color: #424242;
                     font-size: 16px;
                     font-weight: 600;
                  }
               }
            }
            tbody {
               tr {
                  cursor: pointer;
               }
            }
         }
      }
   }
</style>
