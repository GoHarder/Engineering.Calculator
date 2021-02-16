<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // SMUI Components
   import Textfield from '@smui/textfield';
   import IconButton from '@smui/icon-button';
   import Button, { Label } from '@smui/button';

   // Parameters
   export let value = '';

   // Constants
   const dispatch = createEventDispatcher();

   // Events
   const onNew = () => dispatch('new');

   const onSearch = () => dispatch('search');

   const onKeydown = (event) => {
      if (event.keyCode === 13) onSearch();
   };
</script>

<svelte:window on:keydown={onKeydown} />

<div class="search-container">
   <div class="left-box">
      <div class="search-icon">
         <IconButton on:click={onSearch} class="material-icons">search</IconButton>
      </div>
      <div class="search-field">
         <Textfield class="medium" bind:value fullwidth label="Search Existing Workbooks" />
      </div>
   </div>

   <Button on:click={onNew} class="text-transform-none" color="secondary" variant="raised">
      <Label>Create New Workbook</Label>

      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
         <path d="M0 0h24v24H0z" fill="none" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
      </svg>
   </Button>
</div>

<style>
   .search-container {
      height: 60px;
      display: flex;
      margin: 16px 0;
      align-items: center;
      justify-content: space-between;
      border-radius: 8px;
      padding: 14px 14px 14px 0;
      background-color: rgb(244, 244, 244);
      min-width: 1200px;
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
      min-width: 500px;
      margin-left: 16px;
   }

   svg {
      margin-left: 5px;
   }
</style>
