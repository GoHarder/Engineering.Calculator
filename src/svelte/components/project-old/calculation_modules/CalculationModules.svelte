<script>
   import modules from '../../workbook/modules/modules';

   // Svelte imports
   import { onDestroy } from 'svelte';

   // Project Components
   import ModuleCard from './ModuleCard.svelte';
   import Search from './Search.svelte';

   // Stores
   import projectStore from '../../../stores/project';

   // Variables
   let search = '';
   let filteredModules = [...modules];
   let projectModules = {};

   // TODO: 2-25-2021 12:48 PM - connect form to store

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

   // Reactive Rules
   $: if (search) {
      const _search = search.toUpperCase();
      let copy = [...filteredModules];

      copy = copy.filter((module) => module.title.toUpperCase().indexOf(_search) > -1);

      filteredModules = copy;
   } else {
      filteredModules = modules;
   }

   // Events
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

<Search bind:value={search} on:selectAll={onSelectAll} on:selectNone={onSelectNone} />

<div class="form-box">
   {#each filteredModules as { i, title, description, checked } (i)}
      <div class="box">
         <ModuleCard {title} {description} {checked} on:select={onSelect} />
      </div>
   {/each}
</div>

<style>
   .form-box {
      display: flex;
      flex-wrap: wrap;
      padding: 12px 48px 0;
      justify-content: space-evenly;
   }
</style>
