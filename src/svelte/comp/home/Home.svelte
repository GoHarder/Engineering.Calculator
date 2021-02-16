<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Project Components
   import WorkbookTable from './WorkbookTable.svelte';
   import Search from './Search.svelte';

   // Parameters
   export let _id = '';
   export let firstName = '';
   export let lastName = '';

   // Methods
   const fetchRecent = async (page) => {
      const res = await fetch(`api/proj?id=${_id}&page=${page}`);
      const body = await res.json();

      if (res.ok) {
         // fetchType = 'recent';
         return body;
      } else {
         throw new Error('text');
      }
   };

   const fetchSearch = async (page) => {
      const res = await fetch(`api/proj?search=${search}&page=${page}`);
      const body = await res.json();

      if (res.ok) {
         // fetchType = 'search';
         return body;
      } else {
         throw new Error('text');
      }
   };

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let workbooks = fetchRecent(1);
   let search = '';
   // let fetchType = '';

   // Events
   const onSearch = () => {
      if (search) {
         workbooks = fetchSearch(1);
      } else {
         workbooks = fetchRecent(1);
      }
   };

   const onOpen = (event) => {
      if (event.detail) {
         dispatch('changePage', { comp: 'Project' });
      } else {
         dispatch('changePage', 'Project');
      }
   };

   const onDelete = (event) => {
      console.log('TODO: 2-15-2021 9:47 AM - hook up delete event');
      console.log(event);
   };

   const onShare = (event) => {
      console.log('TODO: 2-15-2021 9:48 AM - hook up share event');
      console.log(event);
   };

   // TODO: 2-10-2021 9:11 AM - load more rows when scrolled to bottom of page
</script>

<main>
   <div>
      <div>
         <h5>Hi {`${firstName} ${lastName}`},</h5>
         <h6 class="title-1">
            Welcome to the
            <span>Hollister-Whitney Engineering Calculator</span>
         </h6>
      </div>
      <h6 class="title-2">
         Select an existing
         <strong>Workbook</strong>
         from the list below or click the
         <strong>Create New Workbook</strong>
         button
      </h6>
      <Search bind:value={search} on:search={onSearch} on:new={onOpen} />

      {#await workbooks}
         <p>...waiting</p>
      {:then workbooks}
         <WorkbookTable userId={_id} {workbooks} on:select={onOpen} on:delete={onDelete} on:share={onShare} />
      {:catch error}
         <p style="color: red">{error.message}</p>
      {/await}
   </div>
</main>

<style lang="scss">
   main {
      margin-bottom: 30px;
      padding: 16px;
      display: flex;
      flex-grow: 1;
      justify-content: center;
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
</style>
