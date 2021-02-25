<script>
   // Svelte imports
   import { onDestroy } from 'svelte';

   // Project Components
   import ModuleCard from './ModuleCard.svelte';
   import Search from './Search.svelte';

   // Stores
   import projectStore from '../../../stores/project';

   // Constants
   const modules = [
      { i: 0, title: 'Weight Calculations', description: 'Calculates the weight of the elevator', checked: true, module: 'weightCalcs', comp: 'WeightCalcs' },
      { i: 1, title: 'Counterweight', description: '', checked: false, module: 'counterweight', comp: 'Counterweight' },
      { i: 2, title: '3-Beam Reactions & Deflections', description: '', checked: false, module: '3beam', comp: 'tacos' },
   ];

   // Variables
   let search = '';
   let filteredModules = modules;

   // TODO: 2-25-2021 12:48 PM - connect form to store

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      console.log('Calculation Modules', store);

      const stored = Object.keys(store.modules);

      if (stored.length > 1) {
         const test = filteredModules.map((mod) => {
            mod.checked = stored.includes(mod.module);

            return mod;
         });
      }

      // if (Object.keys(store).length > 1) {
      //    const project = { ...store };
      //    carNo = project.carNo;
      //    contract = project.contract;
      //    created = project.created;
      //    creator = project.creator;
      //    customer = project.customer;
      //    jobName = project.jobName;
      //    layout = project.layout;
      //    metric = project.metric;
      //    modules = project.modules;
      //    opened = project.opened;
      //    temp = project.temp;
      //    const search = opened.findIndex((user) => creator === user.userId);
      //    if (search >= 0) {
      //       opened[search].time = new Date();
      //    } else {
      //       opened.push({ userId: creator, time: created });
      //    }
      // }
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

   // Lifecycle
   onDestroy(() => {
      let selectedModules = filteredModules.filter((mod) => mod.checked);

      selectedModules = selectedModules.map((mod) => {
         const { module, comp } = mod;
         return { module, comp };
      });

      projectStore.save('modules', selectedModules);

      clearProject();
   });
</script>

<Search bind:value={search} on:selectAll={onSelectAll} on:selectNone={onSelectNone} />

<div class="form-box">
   {#each filteredModules as module (module.i)}
      <div class="box">
         <ModuleCard title={module.title} description={module.description} bind:checked={module.checked} />
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
