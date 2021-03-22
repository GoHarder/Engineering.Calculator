<script>
   import modules from '../../workbook/modules/modules';
   import { createEventDispatcher, onDestroy } from 'svelte';

   // Components
   import A from '../../common/A.svelte';
   import ProjectTab from '../common/ProjectTab.svelte';
   import ModuleCard from './ModuleCard.svelte';
   import { Button, IconButton, Label } from '../../material/button';
   import { ArrowBackIos, ArrowForwardIos, DoneAll, RemoveDone } from '../../material/button/icons';
   import { InputSearch } from '../../material/input';

   // Stores
   import projectStore from '../../../stores/project';

   // Properties
   // Methods
   // Constants
   const activeTab = 3;
   const dispatch = createEventDispatcher();

   // Variables
   let search = '';
   let filteredModules = [...modules];
   let projectModules = {};

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      // console.log('Calculation Modules', store);
      const project = { ...store };
      const stored = Object.keys(project.modules);

      if (stored.length > 1) {
         // Set the checked status for each module in the menu
         filteredModules.map((mod) => {
            mod.checked = stored.includes(mod.module);
            return mod;
         });
      }

      // Load the modules
      projectModules = project.modules;
   });

   // Reactive Variables
   // Reactive Rules
   $: if (search) {
      const _search = search.toUpperCase();
      let copy = [...filteredModules].filter((module) => module.title.toUpperCase().indexOf(_search) > -1);

      filteredModules = copy;
   } else {
      filteredModules = modules;
   }

   // Events
   const onHome = () => dispatch('changePage', 'Home');
   const onBack = () => dispatch('changePage', 'Requirements');
   const onProject = () => dispatch('changePage', 'ProjectSummary');
   const onStart = () => {
      // TODO: 3-16-2021 3:37 PM - check if there are modules selected
      // TODO: 3-22-2021 1:55 PM - save setup
      dispatch('changePage', 'Workbook');
   };

   const onSelectAll = () => {
      const copy = [...filteredModules];

      copy.map((module) => (module.checked = true));

      filteredModules = copy;
   };

   const onSelectNone = () => {
      const copy = [...filteredModules];

      copy.map((module) => (module.checked = false));

      filteredModules = copy;
   };

   const onSelect = (event) => {
      const copy = [...filteredModules];
      const search = copy.findIndex((nth) => nth.title === event.detail.title);

      copy[search].checked = event.detail.checked;

      filteredModules = copy;
   };

   // Lifecycle
   onDestroy(() => {
      projectModules = filteredModules.reduce(
         (acc, nth) => {
            if (Object.keys(acc).includes(nth.module)) {
               // console.log('already exist', nth.module);

               if (!nth.checked) {
                  delete acc[nth.module];
               }
            } else {
               // console.log('does not exist', nth.module);

               if (nth.checked) {
                  acc[nth.module] = { module: nth.module };
               }
            }

            return acc;
         },
         { ...projectModules }
      );

      projectStore.save('modules', projectModules);

      clearProject();
   });
</script>

<main>
   <div class="head">
      <A on:click={onHome}>Home</A>
      <div class="title">
         <i class="material-icons">engineering</i>
         <h6>Configuration</h6>
      </div>
   </div>

   <div class="paper n1">
      <div class="tabs">
         <ProjectTab on:click={onProject} label="Project Summary" index={1} {activeTab} />
         <ProjectTab on:click={onBack} label="Requirements" index={2} {activeTab} />
         <ProjectTab label="Calculation Modules" index={3} {activeTab} />
      </div>

      <div class="form">
         <div class="search-container">
            <div class="box n1">
               <p>Select modules for your workbook</p>
            </div>

            <div class="box n2">
               <div class="sub-box-1">
                  <InputSearch bind:value={search} label="Search Modules" />
               </div>
               <div class="sub-box-2">
                  <IconButton on:click={onSelectNone} color="secondary" title="Select None">
                     <RemoveDone />
                  </IconButton>
                  <IconButton on:click={onSelectAll} color="primary" title="Select All">
                     <DoneAll />
                  </IconButton>
               </div>
            </div>
         </div>

         <div class="form-box">
            {#each filteredModules as { i, title, description, checked } (i)}
               <div class="box">
                  <ModuleCard {title} {description} {checked} on:select={onSelect} />
               </div>
            {/each}
         </div>
      </div>
   </div>
   <div class="paper n2">
      <Button on:click={onBack} variant="contained" color="secondary">
         <ArrowBackIos />
         <Label>Back</Label>
      </Button>
      <Button on:click={onStart} variant="contained">
         <Label>Start</Label>
         <ArrowForwardIos />
      </Button>
   </div>
</main>

<style lang="scss">
   @import './src/scss/vantage-theme';

   main {
      padding: 16px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
   }
   .head {
      padding-bottom: 16px;
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
      @include vantage-paper;
      &.n1 {
         @include vantage-border;
         padding: 0 0 16px;
      }
      &.n2 {
         margin-top: 4px;
         padding: 16px;
         display: flex;
         justify-content: flex-end;
         gap: 16px;
      }
   }

   .tabs {
      background-color: #f5f5f5;
      display: flex;
      padding: 16px 16px 0;
   }
   .form {
      padding: 16px;
      height: calc(100vh - 400px);
      overflow-y: auto;
   }
   p {
      margin: 0 30px;
   }
   .form-box {
      display: flex;
      flex-wrap: wrap;
      padding: 12px 48px 0;
      justify-content: space-evenly;
      gap: 16px;
   }

   .search-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      .box.n1 {
         flex-grow: 1;
      }

      .box.n2 {
         flex-grow: 1;
         display: flex;
         align-items: center;
         gap: 8px;
         .sub-box-1 {
            flex-grow: 1;
         }
      }
   }

   // .box {
   //    flex-grow: 1;
   //    max-width: 100%;
   //    flex-basis: 100%;
   //    padding: 16px;
   // }

   @media (min-width: 786px) {
      main {
         padding: 16px;
      }
      // .box {
      //    max-width: 50%;
      //    flex-basis: 50%;
      // }
   }

   @media (min-width: 1600px) {
      main {
         max-width: 1600px;
      }
      // .box {
      //    max-width: calc(100% / 3);
      //    flex-basis: calc(100% / 3);
      // }
   }
</style>
