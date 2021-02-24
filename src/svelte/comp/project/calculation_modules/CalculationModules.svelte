<script>
   // SMUI Components
   import ModuleCard from './ModuleCard.svelte';
   import Search from './Search.svelte';

   // Constants
   const modules = [
      { i: 0, title: 'Weight Calculations', description: 'Calculates the weight of the elevator', checked: true },
      { i: 1, title: 'Counterweight', description: '', checked: true },
      { i: 2, title: '3-Beam Reactions & Deflections', description: '', checked: true },
   ];

   // Variables
   let search = '';
   let filteredModules = modules;

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
</script>

<Search bind:value={search} on:selectAll={onSelectAll} on:selectNone={onSelectNone} />

<div class="form-box">
   {#each filteredModules as module}
      <div class="box">
         <ModuleCard title={module.title} description={module.description} bind:checked={module.checked} />
      </div>
   {/each}
</div>

<style>
   .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
   }
   .form-box {
      display: flex;
      flex-wrap: wrap;
      padding: 12px 48px 0;
      justify-content: space-evenly;
   }
</style>
