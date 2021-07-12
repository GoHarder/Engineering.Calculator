<script>
   import modules from '../../workbook/modules/modules';
   import { createEventDispatcher, onDestroy } from 'svelte';

   // Components
   import ModuleCard from './ModuleCard.svelte';
   import ProjectShell from '../common/ProjectShell.svelte';
   import { IconButton } from '../../material/button';
   import { DoneAll, RemoveDone } from '../../material/button/icons';
   import { InputSearch } from '../../material/input';

   // Stores
   import projectStore from '../../../stores/project';

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
   $: disableStart = filteredModules.filter((mod) => mod.checked).length === 0;

   // Reactive Rules
   $: if (search) {
      const _search = search.toUpperCase();
      let copy = [...filteredModules].filter((module) => module.title.toUpperCase().indexOf(_search) > -1);

      filteredModules = copy;
   } else {
      filteredModules = modules;
   }

   // Events
   const onBack = () => dispatch('changePage', 'Requirements');

   const onStart = () => dispatch('changePage', 'Workbook');

   const onHome = () => dispatch('changePage', 'Home');

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
               if (!nth.checked) {
                  delete acc[nth.module];
               }
            } else {
               if (nth.checked) {
                  acc[nth.module] = {};
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

<ProjectShell on:onNext={onStart} on:onBack={onBack} on:onHome={onHome} activeTab={3} validForm={!disableStart}>
   <div class="form">
      <div class="search-container">
         <div class="sub-box-1">
            <InputSearch bind:value={search} label="Search Modules" />
         </div>

         <div class="sub-box-2">
            <IconButton on:click={onSelectNone} title="Select None">
               <RemoveDone />
            </IconButton>
            <IconButton on:click={onSelectAll} title="Select All">
               <DoneAll />
            </IconButton>
         </div>
      </div>

      <hr />

      <div class="form-box">
         {#each filteredModules as { i, title, description, checked } (i)}
            <div class="box">
               <ModuleCard {title} {description} {checked} on:select={onSelect} />
            </div>
         {/each}
      </div>
   </div>
</ProjectShell>

<style>
   .form {
      padding: 16px;
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
      justify-content: center;
      margin-bottom: 8px;
   }
   .sub-box-1 {
      width: 500px;
      margin: 0 10px 10px;
   }
   .sub-box-2 {
      margin: 0 10px 10px;
   }
   hr {
      border: 1px solid #e6e6e6;
   }
</style>
