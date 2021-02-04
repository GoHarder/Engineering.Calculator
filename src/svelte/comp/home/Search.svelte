<script>
   // SMUI Components
   import Textfield from '@smui/textfield';
   import IconButton from '@smui/icon-button';
   import Button, { Label, Icon } from '@smui/button';

   // Parameters
   export let value = '';
</script>

<div class="search-container">
   <div class="left-box">
      <div class="search-icon">
         <IconButton class="material-icons">search</IconButton>
      </div>
      <div class="search-field">
         <Textfield class="medium" bind:value fullwidth label="Search Existing Workbooks" />
      </div>
   </div>

   <Button class="text-transform-none" color="secondary" variant="raised">
      <Label>Create New Workbook</Label>
      <Icon class="material-icons">add_circle</Icon>
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
</style>
