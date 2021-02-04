<script>
   // Project Components
   import WorkbookRow from './WorkbookRow.svelte';

   // SMUI Components
   import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

   // Properties
   export let workbooks = [];
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
      {#each workbooks as workbook (workbook._id)}
         <WorkbookRow {...workbook} />
      {/each}
   </Body>
</DataTable>

<style lang="scss">
   :global {
      .workbook-table {
         border-top: 5px solid #ffcb30;

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
