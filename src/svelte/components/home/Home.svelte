<script>
   // Svelte Imports
   import { createEventDispatcher, onDestroy } from 'svelte';

   // Project Components
   import WorkbookRow from './WorkbookRow.svelte';
   import { InputSearch } from '../material/input';
   import { Button, Label } from '../material/button';
   import { AddCircle, Check } from '../material/button/icons';
   import { Body, Cell, Head, Row, Table } from '../material/data-table';
   import { Actions as BannerActions, Banner, Text } from '../material/banner';
   import { Actions as DialogActions, Content, Dialog, Title } from '../material/dialog';
   import { Radio } from '../material/radio';

   // Stores
   import projectStore from '../../stores/project';
   import loadingStore from '../../stores/loading';

   // Properties
   export let _id = '';
   export let firstName = '';
   export let lastName = '';
   export let admin = false;

   // Variables
   let openBanner = false;
   let menuError = 'Error';
   let openDeleteDialog = false;
   let openShareDialog = false;
   let userList = [];
   let shareId = '';
   let shareUser = '';
   let calcId = '';
   let user = '';
   let project = {};

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      project = { ...store };
   });

   // Methods
   const fetchRecent = async (page) => {
      loadingStore.set(true);
      const res = await fetch(`api/proj?id=${_id}&page=${page}`).catch(() => ({ ok: false }));

      const body = await res.json();

      // console.log(body);

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
      const res = await fetch(`api/proj?search=${search}&page=${page}`).catch(() => ({ ok: false }));
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
   let workbooks = undefined;
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
      dispatch('changePage', { comp: 'Project', run: 'open', calcId: event.detail, checkIn: project._id });
   };

   const onDeleteDialog = (event) => {
      calcId = event.detail.calcId;
      user = event.detail.user;

      openDeleteDialog = true;
   };

   const onDelete = async (event) => {
      // const { calcId, user } = event.detail;
      loadingStore.set(true);

      // console.log(event);

      if (user === _id || admin) {
         const res = await fetch(`api/proj/${calcId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
         }).catch(() => ({ ok: false }));

         if (res.ok) {
            loadingStore.set(false);
            workbooks = fetchRecent(1);
            calcId = '';
            user = '';
            openDeleteDialog = false;
         } else {
            const body = await res.json();
            menuError = body.error.menu;
            openBanner = true;
            loadingStore.set(false);
            openDeleteDialog = false;
         }
      } else {
         menuError = 'You do not have permission to delete this file';
         openBanner = true;
         loadingStore.set(false);
      }
   };

   const onShareDialog = async (event) => {
      loadingStore.set(true);
      const res = await fetch(`api/users/all`).catch(() => ({ ok: false }));

      if (res.ok) {
         const body = await res.json();
         userList = body.filter((user) => user._id !== _id);
         shareId = event.detail;
         loadingStore.set(false);
         openShareDialog = true;
         return body;
      } else {
         loadingStore.set(false);
         throw new Error('text');
      }
   };

   const onShare = async () => {
      loadingStore.set(true);

      const payload = JSON.stringify({
         _type: 'share',
         calcId: shareId,
         userId: shareUser,
         email: userList.find((user) => user._id === shareUser).email,
      });

      const res = await fetch('api/proj', {
         method: 'PUT',
         body: payload,
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => ({ ok: false, error }));

      if (res.ok) {
         loadingStore.set(false);
         openShareDialog = false;
      } else {
         loadingStore.set(false);
         throw new Error('text');
      }
   };

   // Lifecycle
   onDestroy(() => {
      clearProject();
   });
</script>

<svelte:head>
   <title>HW Engineering Calculator</title>
</svelte:head>

<Banner bind:open={openBanner} centered>
   <Text>
      <span style="color: #b00020;">
         {menuError}
      </span>
   </Text>

   <BannerActions>
      <Button color="primary" class="mdc-banner__primary-action" variant="contained">
         <Label>Ok</Label>
         <Check />
      </Button>
   </BannerActions>
</Banner>

<Dialog bind:open={openDeleteDialog}>
   <Content>Delete workbook?</Content>
   <DialogActions>
      <Button on:click={() => (openDeleteDialog = false)} class="mdc-dialog__button" color="secondary" variant="outlined">
         <Label>Cancel</Label>
      </Button>
      <Button on:click={onDelete} class="mdc-dialog__button" variant="contained">
         <Label>Ok</Label>
      </Button>
   </DialogActions>
</Dialog>

<Dialog bind:open={openShareDialog}>
   <Title>Select user to share workbook</Title>

   <Content>
      {#each userList as { firstName, lastName, _id }}
         <div>
            <Radio label={`${firstName} ${lastName}`} bind:group={shareUser} value={_id} />
         </div>
      {/each}
   </Content>
   <DialogActions>
      <Button on:click={() => (openShareDialog = false)} class="mdc-dialog__button" color="secondary" variant="outlined">
         <Label>Cancel</Label>
      </Button>
      <Button on:click={onShare} disabled={!shareUser} class="mdc-dialog__button" variant="contained">
         <Label>Ok</Label>
      </Button>
   </DialogActions>
</Dialog>

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

   <div>
      <div class="search-container">
         <div class="box n1"><InputSearch bind:value={search} on:click={onSearch} label="Search Workbooks" /></div>
         <div class="box n2">
            <Button on:click={onNew} variant="contained">
               <Label>Create New Workbook</Label>
               <AddCircle />
            </Button>
         </div>
      </div>
      <div class="table">
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
                  {#if workbooks.length !== 0}
                     {#each workbooks as workbook (workbook._id)}
                        <WorkbookRow userId={_id} {workbook} on:delete={onDeleteDialog} on:share={onShareDialog} on:select={onOpen} />
                     {/each}
                  {:else}
                     <Cell row colspan="20">Nothing Available...</Cell>
                  {/if}
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
      padding: 19px 19px 0;
      background-color: #ffffff;
      max-width: 835px;
      width: 100%;

      .box.n1 {
         flex-grow: 1;
         margin-right: 8px;
         max-width: 700px;
      }
      .box.n2 {
         margin-left: 10px;
         margin-bottom: 20px;
      }
   }

   .table {
      box-shadow: $mdc-elevation-3;
      border-top: 5px solid $mdc-theme-primary;
   }

   @media (min-width: 1100px) {
      .search-container {
         max-width: 930px;
      }
   }
</style>
