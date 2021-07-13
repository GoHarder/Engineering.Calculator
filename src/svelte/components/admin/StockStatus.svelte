<script>
   // Components
   import { InputSearch } from '../../components/material/input';

   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   let search = '';

   // Subscriptions
   // Reactive Rules
   // Events
   // Lifecycle
   const onSearch = (event) => {
      console.log(event);
   };
</script>

<div class="card">
   <InputSearch bind:value={search} on:click={onSearch} label="Search Steel" />
</div>

<style lang="scss">
   .card {
      padding: 1em;
      background-color: #ffffff;
   }
</style>
