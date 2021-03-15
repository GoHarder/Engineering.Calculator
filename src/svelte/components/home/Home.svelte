<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';
   import { fade } from 'svelte/transition';

   // Project Components
   import WorkbookRow from './WorkbookRow.svelte';
   import { InputSearch } from '../material/input';
   import { Button, Label } from '../material/button';
   import { AddCircle } from '../material/button/icons';
   import { Body, Cell, Head, Row, Table } from '../material/data-table';

   // Stores
   import projectStore from '../../stores/project';
   import loadingStore from '../../stores/loading';

   // Properties
   export let _id = '';
   export let firstName = '';
   export let lastName = '';

   // Methods
   const fetchRecent = async (page) => {
      loadingStore.set(true);
      const res = await fetch(`api/proj?id=${_id}&page=${page}`);
      const body = await res.json();

      if (res.ok) {
         // fetchType = 'recent';
         loadingStore.set(false);
         return body;
      } else {
         loadingStore.set(false);
         throw new Error('text');
      }
   };

   const fetchSearch = async (page) => {
      loadingStore.set(true);
      const res = await fetch(`api/proj?search=${search}&page=${page}`);
      const body = await res.json();

      if (res.ok) {
         // fetchType = 'search';
         loadingStore.set(false);
         return body;
      } else {
         loadingStore.set(false);
         throw new Error('text');
      }
   };

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let workbooks = fetchRecent(1);
   let search = '';
   // let fetchType = '';

   $: if (_id) {
      workbooks = fetchRecent(1);
   }

   // Events
   const onSearch = () => {
      if (search) {
         workbooks = fetchSearch(1);
      } else {
         workbooks = fetchRecent(1);
      }
   };

   const onNew = () => {
      dispatch('changePage', 'ProjectSummary');
      projectStore.set({});
   };

   const onOpen = (event) => {
      dispatch('changePage', { comp: 'Project', run: 'open', calcId: event.detail });
   };

   const onDelete = (event) => {
      console.log('TODO: 2-15-2021 9:47 AM - hook up delete event');
      console.log(event);
   };

   const onShare = (event) => {
      console.log('TODO: 2-15-2021 9:48 AM - hook up share event');
      console.log(event);
   };
</script>

<main>
   <div class="title-container">
      <h5>Hi {`${firstName} ${lastName}`},</h5>
      <h6 class="title-1">
         Welcome to the
         <span>Hollister-Whitney Engineering Calculator</span>
      </h6>
      <h6 class="title-2">
         Select an existing
         <strong>Workbook</strong>
         from the list below or click the
         <strong>Create New Workbook</strong>
         button
      </h6>
   </div>

   <div transition:fade>
      <div class="search-container">
         <div class="box n1"><InputSearch bind:value={search} on:click={onSearch} label="Search Workbooks" /></div>
         <div class="box n2">
            <Button on:click={onNew} variant="contained">
               <Label>Create New Workbook</Label>
               <AddCircle />
            </Button>
         </div>
      </div>
      <div class="table" transition:fade>
         <Table sticky>
            <Head>
               <Row header>
                  <Cell header>Contract #</Cell>
                  <Cell header class="workbook-cell job-name">Job Name</Cell>
                  <Cell header class="workbook-cell car-no">Car #</Cell>
                  <Cell header class="workbook-cell customer">Customer</Cell>
                  <Cell header class="workbook-cell layout">Layout #</Cell>
                  <Cell header class="workbook-cell date">Created</Cell>
                  <Cell header class="workbook-cell date">Last Opened</Cell>
                  <Cell header class="workbook-cell owner">Owned By</Cell>
                  <Cell header />
               </Row>
            </Head>
            <Body>
               {#await workbooks}
                  <Cell row colspan="20">Loading...</Cell>
               {:then workbooks}
                  {#each workbooks as workbook (workbook._id)}
                     <WorkbookRow userId={_id} {workbook} on:delete={onDelete} on:share={onShare} on:select={onOpen} />
                  {/each}
               {:catch error}
                  <Cell row colspan="20"><span style="color: red">{error.message}</span></Cell>
               {/await}
            </Body>
         </Table>
      </div>
   </div>
</main>

<style lang="scss">
   @import './src/scss/vantage-theme';
   main {
      margin-bottom: 30px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
   }
   h5 {
      color: #676767;
      font: {
         size: 30px;
         weight: 400;
      }
      line-height: 1.334;
      margin: 0;
   }
   .title-container {
      margin: 0 auto;
   }

   .title-1 {
      color: #343434;
      font: {
         size: 24px;
         weight: 500;
      }
      line-height: 1.6;
      margin: 0;
      span {
         font-weight: 600;
      }
   }
   .title-2 {
      color: #343434;
      font: {
         size: 16px;
         weight: 500;
      }
      line-height: 1.57;
      margin: 0 {
         top: 8px;
      }
   }

   .search-container {
      display: flex;
      margin: 16px auto;
      align-items: center;
      justify-content: space-between;
      border-radius: 4px;
      padding: 14px;
      background-color: #ffffff;
      max-width: 835px;
      width: 100%;

      .box.n1 {
         flex-grow: 1;
         margin-right: 8px;
         max-width: 700px;
      }
      .box.n2 {
         margin-left: 8px;
      }
   }

   .table {
      box-shadow: $mdc-elevation-3;
      border-top: 5px solid $mdc-theme-primary;
   }

   @media (min-width: 1100px) {
      .search-container {
         max-width: 1070px;
      }
   }

   @media (min-width: 1200px) {
      .search-container {
         max-width: 1170px;
      }
   }
</style>
