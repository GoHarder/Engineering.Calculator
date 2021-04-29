<script>
   import modules from './modules/modules';
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';

   // Components
   import { Button, IconButton, Label } from '../material/button';
   import { ArrowBackIos, ArrowForwardIos, Check, Menu, Note, Print, Save, Share } from '../material/button/icons';
   import { AppContent, Drawer, Header, Item, List, Title } from '../material/drawer';
   import { Actions, Banner, Text } from '../material/banner';

   // Project Components
   import A from '../common/A.svelte';

   // Stores
   import projectStore from '../../stores/project';
   import loadingStore from '../../stores/loading';

   // Methods
   const saveProject = async () => {
      loadingStore.set(true);

      const method = '_id' in project ? 'PUT' : 'POST';

      const res = await fetch('api/proj', {
         method,
         body: JSON.stringify(project),
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => ({ ok: false, error }));

      const body = await res.json();

      if (res.ok) {
         if (method === 'POST') {
            projectStore.set(body);
         } else {
            projectStore.set(body);
         }

         loadingStore.set(false);
         save = false;
      } else {
         console.log(body.error.workbook);
         workbookError = body?.error?.workbook ?? `${res.status}: ${res.statusText}`;
         loadingStore.set(false);
         openBanner = true;
         save = false;
      }
   };

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let openBanner = false;
   let workbookError = 'Workbook error';

   let contract = '';
   let jobName = '';
   let carNo = '';
   let workbook = {};

   let project = undefined;
   let menuOpen = true;
   let activeTab = undefined;
   let title = 'HW Engineering Calculator';
   let domTitle = 'Workbook';
   let tabs = [];
   let save = false;

   // Subscriptions
   const clearLoading = loadingStore.subscribe(() => {});
   const clearProject = projectStore.subscribe((store) => {
      project = { ...store };

      if (Object.keys(project).length > 1) {
         contract = project.contract;
         carNo = project.carNo;
         jobName = project.jobName;
         workbook = project;

         // Setup tabs
         tabs = modules.filter((mod) => Object.keys(project.modules).includes(mod.module));

         if (!activeTab) activeTab = tabs[0];
      }
   });

   // Reactive Variables
   $: disablePrevious = activeTab.i === 0;
   $: disableNext = activeTab.i + 1 === tabs.length;

   // Reactive Rules
   $: if (contract && jobName && carNo) {
      domTitle = `${contract} - ${jobName} - ${carNo}`;
      title = domTitle;
   }

   // Events
   const onHome = () => dispatch('changePage', 'Home');
   const onConfiguration = () => dispatch('changePage', 'ProjectSummary');

   const onShare = () => {
      console.log('TODO: 2-26-2021 9:23 AM - hook up share button');
   };

   const onNote = () => {
      console.log('TODO: 2-26-2021 9:24 AM - hook up note button');
   };

   const onPrint = () => {
      console.log('TODO: 2-26-2021 9:25 AM - hook up print button');
   };

   const onSave = () => (save = true);

   const setActiveTab = (tab) => (activeTab = tab);

   const onPrevious = () => (activeTab = tabs[activeTab.i - 1]);

   const onNext = () => (activeTab = tabs[activeTab.i + 1]);

   const onChangePage = (event) => dispatch('changePage', event.detail);

   const onChangeModule = (event) => (activeTab = tabs.find((tab) => tab.module === event.detail));

   // Lifecycle
   onMount(() => {
      saveProject();
   });

   onDestroy(() => {
      clearProject();
      clearLoading();
   });
</script>

<svelte:head>
   <title>{title}</title>
</svelte:head>

<!-- <svelte:window on:keydown={onKeydown} /> -->

<Banner bind:open={openBanner} centered>
   <Text>
      <span style="color: #b00020;">
         {workbookError}
      </span>
   </Text>

   <Actions>
      <Button color="primary" class="mdc-banner__primary-action" variant="contained">
         <Label>Ok</Label>
         <Check />
      </Button>
   </Actions>
</Banner>

<main>
   <header>
      <div>
         <nav>
            <A on:click={onHome}>Home</A><span>></span><A on:click={onConfiguration}>Configuration</A>
         </nav>
         <div class="title">
            <i class="material-icons">calculate</i>
            <h6>{domTitle}</h6>
         </div>
      </div>
      <div class="button-box">
         <IconButton on:click={onShare} disabled={true} title="Share">
            <Share />
         </IconButton>
         <IconButton on:click={onNote} disabled={true} title="Notes">
            <Note />
         </IconButton>
         <IconButton on:click={onPrint} disabled={true} title="Print">
            <Print />
         </IconButton>
         <IconButton on:click={onSave} title="Save">
            <Save />
         </IconButton>
      </div>
   </header>
   <section class="paper">
      <Drawer bind:open={menuOpen} selectedIndex={activeTab.i}>
         <Header>
            <Title>Modules</Title>
         </Header>
         <List>
            {#each tabs as tab}
               <Item on:click={() => setActiveTab(tab)} activated={activeTab === tab}>
                  {tab.title}
               </Item>
            {/each}
         </List>
      </Drawer>
      <AppContent>
         <div class="page-title">
            <div class="box-1">
               <IconButton on:click={() => (menuOpen = !menuOpen)} title="Navigaiton">
                  <Menu />
               </IconButton>
               <h6>{activeTab.title}</h6>
            </div>
            <div class="box-2">
               <div class="border-1">
                  <IconButton on:click={onPrevious} disabled={disablePrevious} title="Previous">
                     <ArrowBackIos />
                  </IconButton>
               </div>
               <div class="border-2">
                  <IconButton on:click={onNext} disabled={disableNext} title="Next">
                     <ArrowForwardIos />
                  </IconButton>
               </div>
            </div>
         </div>
         <div class="comp">
            <svelte:component this={activeTab.comp} bind:workbook on:changePage={onChangePage} on:changeModule={onChangeModule} {save} {saveProject} />
         </div>
      </AppContent>
   </section>
</main>

<style lang="scss">
   @import './src/scss/vantage-theme';
   $border-color: rgba(
      $color: #000000,
      $alpha: 0.12,
   );

   main {
      padding: 16px;
      margin: 0 auto;
   }

   header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 8px;
   }

   nav span {
      margin: 0 6px;
   }

   .title {
      display: flex;
      align-items: center;
      h6 {
         font: {
            weight: 600;
            size: 1.25rem;
         }
         line-height: 1.6;
         margin: 0 0 0 8px;
      }
   }

   .paper {
      @include vantage-border;
      @include vantage-paper;
      min-height: calc(100vh - 190px);
      position: relative;
   }

   .page-title {
      border-bottom: 1px solid $border-color;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3px;
      position: sticky;
      top: 0px;
      background-color: #ffffff;
      z-index: 2;
      h6 {
         font-family: Roboto, sans-serif;
         font-size: 1.25rem;
         line-height: 2rem;
         font-weight: 500;
         letter-spacing: 0.0125em;
         display: block;
         // margin-top: 0;
         line-height: normal;
         // margin-bottom: -20px;
         margin: 0 0 0 8px;
      }
      .box-1,
      .box-2 {
         display: flex;
         align-items: center;
      }
      .border {
         &-1 {
            border-right: 0.5px solid $border-color;
            padding-right: 3px;
         }
         &-2 {
            border-left: 0.5px solid $border-color;
            padding-left: 3px;
         }
      }
   }

   .comp {
      padding: 16px;
      background-color: #e6e6e6;
      min-height: 727px;
   }

   @media (min-width: 768px) {
      main {
         padding: 16px 24px;
      }
   }
   @media (min-width: 1600px) {
      main {
         max-width: 1600px;
      }
   }
</style>
