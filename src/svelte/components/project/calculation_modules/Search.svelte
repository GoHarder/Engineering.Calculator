<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // SMUI Components
   import Textfield from '@smui/textfield';
   import IconButton from '@smui/icon-button';
   import Button, { Group, Label } from '@smui/button';

   // Parameters
   export let value = '';

   // Constants
   const dispatch = createEventDispatcher();

   // Events
   const onSelectAll = () => dispatch('selectAll');

   const onSelectNone = () => dispatch('selectNone');
</script>

<div class="search-container">
   <div class="left-box">
      <div class="search-icon">
         <IconButton class="material-icons">search</IconButton>
      </div>
      <div class="search-field">
         <Textfield class="medium" bind:value fullwidth label="Search Modules" />
      </div>
   </div>

   <Group variant="outlined">
      <Button variant="outlined" class="text-transform-none" on:click={onSelectAll}><Label>Select All</Label></Button>
      <Button variant="outlined" class="text-transform-none" on:click={onSelectNone}><Label>Select None</Label></Button>
   </Group>
</div>

<style>
   .search-container {
      /* height: 40px; */
      display: flex;
      /* margin: 16px 0; */
      align-items: center;
      justify-content: space-between;
      /* border-radius: 8px; */
      /* padding: 14px 14px 14px 0; */
      /* background-color: rgb(244, 244, 244); */
      /* min-width: 500px; */
   }

   .left-box {
      display: flex;
      align-items: center;
   }

   .search-icon {
      border-right: 1px solid rgba(0, 0, 0, 0.54);
      padding: 0 6px;
   }

   .search-field {
      width: 50%;
      min-width: 400px;
      margin-left: 16px;
   }
</style>
