<script>
   import modules from './modules/modules';
   import { createEventDispatcher, onDestroy } from 'svelte';

   // Components
   // import Drawer, { AppContent, Content, Header, Title } from '@smui/drawer';
   // import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list';
   import { IconButton } from '../material/button';
   import { ArrowBackIos, ArrowForwardIos, Menu, NoteAdd, Print, Save, Share } from '../material/button/icons';
   import { AppContent, Drawer } from '../material/drawer';

   // Project Components
   import A from '../common/A.svelte';

   // Stores
   import projectStore from '../../stores/project';

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let contract = '';
   let jobName = '';
   let carNo = '';
   let workbook = {};

   let menuOpen = true;
   let activeTab = 'Tab Title';
   let title = 'HW Engineering Calculator';
   let domTitle = 'Workbook';
   let tabs = [];
   let save = false;

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      // console.log('Workbook', store);

      const project = { ...store };

      if (Object.keys(project).length > 1) {
         contract = project.contract;
         carNo = project.carNo;
         jobName = project.jobName;
         workbook = project;

         // Setup tabs
         tabs = modules.filter((mod) => Object.keys(project.modules).includes(mod.module));
         activeTab = tabs[0];
      }
   });

   // Reactive Rules
   $: if (jobName && carNo) {
      title = `${jobName} | ${carNo}`;
   }

   $: if (contract && jobName && carNo) {
      domTitle = `${contract} | ${jobName} | ${carNo}`;
   }

   // Events
   const onHome = () => dispatch('changePage', 'Home');
   const onConfiguration = () => dispatch('changePage', 'Project');

   const onShare = () => {
      console.log('TODO: 2-26-2021 9:23 AM - hook up share button');
   };

   const onNote = () => {
      console.log('TODO: 2-26-2021 9:24 AM - hook up note button');
   };

   const onPrint = () => {
      console.log('TODO: 2-26-2021 9:25 AM - hook up print button');
   };

   const onSave = () => {
      save = true;

      console.log('TODO: 3-19-2021 10:37 AM - have data push to the store');

      setTimeout(() => {
         save = false;
      }, 5);
   };

   const setActiveTab = (tab) => (activeTab = tab);

   // Lifecycle
   onDestroy(() => {
      clearProject();
   });
</script>

<svelte:head>
   <title>{title}</title>
</svelte:head>

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
         <IconButton on:click={onShare} title="Share"><Share /></IconButton>
         <IconButton on:click={onNote} title="Add Note"><NoteAdd /></IconButton>
         <IconButton on:click={onPrint} title="Print"><Print /></IconButton>
         <IconButton on:click={onSave} title="Save"><Save /></IconButton>
      </div>
   </header>

   <section class="paper">
      <Drawer bind:open={menuOpen}>Placeholder</Drawer>
      <AppContent>
         <div class="page-title">
            <div class="box-1">
               <IconButton on:click={() => (menuOpen = !menuOpen)} title="Navigaiton"><Menu /></IconButton>
               <h6>{activeTab.title}</h6>
            </div>
            <div class="box-2">
               <div class="border-1">
                  <IconButton on:click={() => console.log('TODO: 2-26-2021 3:13 PM - connect previous page button')} title="Previous"><ArrowBackIos /></IconButton>
               </div>
               <div class="border-2">
                  <IconButton on:click={() => console.log('TODO: 2-26-2021 3:13 PM - connect next page button')} title="Next"><ArrowForwardIos /></IconButton>
               </div>
            </div>
         </div>
      </AppContent>
   </section>

   <!-- <div class="paper mdc-elevation--z3"> -->
   <!-- <div class="form"> -->
   <!-- <Drawer variant="dismissible" bind:this={sideMenu} bind:open={menuOpen}> -->
   <!-- <Header style="background-color: #333; display: flex; justify-content: space-between;"> -->
   <!-- <Title style="color: #ffcb30; font-weight: medium">Modules</Title> -->
   <!-- </Header> -->

   <!-- <Content> -->
   <!-- <List> -->
   <!-- {#each tabs as tab} -->
   <!-- <Item on:click={() => setActiveTab(tab)} activated={activeTab === tab}> -->
   <!-- <Graphic class="material-icons" aria-hidden="true">{tab}</Graphic> -->
   <!-- <Text>{tab.title}</Text> -->
   <!-- </Item> -->
   <!-- {/each} -->
   <!-- </List> -->
   <!-- </Content> -->
   <!-- </Drawer> -->

   <!-- <AppContent class="app-content"> -->
   <!-- <div class="main-content"> -->
   <!-- <div class="section-title"> -->
   <!-- <div class="n1"> -->
   <!-- <IconButton title="Menu" class="material-icons" on:click={() => (menuOpen = !menuOpen)}>menu</IconButton> -->
   <!-- <h6>{activeTab.title}</h6> -->
   <!-- </div> -->

   <!-- <div class="n2"> -->
   <!-- <IconButton title="Previous Page" class="material-icons" on:click={() => console.log('TODO: 2-26-2021 3:13 PM - connect previous page button')}> -->
   <!-- chevron_left -->
   <!-- </IconButton> -->
   <!-- <span>|</span> -->
   <!-- <IconButton title="Next Page" class="material-icons" on:click={() => console.log('TODO: 2-26-2021 3:13 PM - connect next page button')}> -->
   <!-- chevron_right -->
   <!-- </IconButton> -->
   <!-- </div> -->
   <!-- </div> -->
   <!-- <div class="comp"> -->
   <!-- <svelte:component this={activeTab.comp} bind:workbook {save} /> -->
   <!-- </div> -->
   <!-- </div> -->
   <!-- </AppContent> -->
   <!-- </div> -->
   <!-- </div> -->
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

   // .paper {
   //    border-top: solid 5px #ffcb30;
   //    background-color: #ffffff;
   // }

   // .form {
   //    min-height: calc(100vh - 190px);
   //    position: relative;
   //    display: flex;
   //    border: 1px solid rgba(0, 0, 0, 0.1);
   //    overflow: hidden;
   //    z-index: 0;
   // }

   // * :global(.mdc-drawer--modal, .mdc-drawer-scrim) {
   //    /* This is not needed for a page-wide modal. */
   //    position: absolute;
   // }
   // * :global(.app-content) {
   //    flex: auto;
   //    overflow: auto;
   //    position: relative;
   //    flex-grow: 1;
   // }

   // .section-title {
   //    display: flex;
   //    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
   //    height: 63px;
   //    justify-content: space-between;

   //    .n1 {
   //       display: flex;
   //       align-items: center;
   //       margin: 0 8px;
   //       h6 {
   //          margin-left: 6px;
   //       }
   // //    }
   //    .n2 {
   //       display: flex;
   //       align-items: center;
   //       margin-right: 8px;
   //    }
   //    h6 {
   //       margin: 0;
   //    }
   // }

   // .main-content {
   //    overflow: auto;
   //    box-sizing: border-box;
   // }
   // .comp {
   //    padding: 16px;
   // }
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
