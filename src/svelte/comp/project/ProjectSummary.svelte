<script>
   // Svelte imports
   import { onDestroy } from 'svelte';

   // Project Components
   import Checkbox from '../common/controls/Checkbox.svelte';
   import InputText from '../common/controls/InputText.svelte';

   // Stores
   import projectStore from '../../stores/project';

   // Variables
   let contract = '';
   let jobName = '';
   let carNo = '';
   let customer = '';
   let layout = '';
   let metric = false;
   // TODO: 2-18-2021 1:11 PM - need metric settings in database

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      if (Object.keys(store).length !== 0) {
         const project = { ...store };
         contract = project.contract;
         jobName = project.jobName;
         carNo = project.carNo;
         customer = project.customer;
         layout = project.layout;
         metric = project.metric ? project.metric : false;
      }
   });

   // Lifecycle
   onDestroy(() => {
      projectStore.save('project', { contract, jobName, carNo, customer, layout, metric });

      clearProject();
   });
</script>

<p>Enter the project details and proceed to the next step</p>

<div class="form-box">
   <div class="box">
      <InputText bind:value={contract} label="Contract" style={4} bullet />
   </div>

   <div class="box">
      <InputText bind:value={jobName} label="Job Name" style={4} bullet />
   </div>

   <div class="box">
      <InputText bind:value={carNo} label="Car Number" style={4} bullet />
   </div>

   <div class="box">
      <InputText bind:value={customer} label="Customer" style={4} bullet />
   </div>

   <div class="box">
      <InputText bind:value={layout} label="Layout Number" style={4} bullet />
   </div>

   <div class="box">
      <Checkbox bind:checked={metric} label="Show Metric Units" bullet />
   </div>
</div>

<style lang="scss">
   p {
      padding: 0 30px;
   }
   .form-box {
      display: flex;
      flex-wrap: wrap;
      padding: 0 48px;
   }

   .box {
      flex-grow: 1;
      max-width: 100%;
      flex-basis: 100%;
      padding: 16px;
   }

   @media (min-width: 768px) {
      .box {
         max-width: 50%;
         flex-basis: 50%;
      }
   }

   @media (min-width: 1024px) {
      .box {
         max-width: calc(100% / 3);
         flex-basis: calc(100% / 3);
      }
   }
</style>
