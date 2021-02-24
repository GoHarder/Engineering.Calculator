<script>
   // Svelte imports
   import { onDestroy } from 'svelte';

   // Project Components
   import Checkbox from '../common/controls/Checkbox.svelte';
   import InputText from '../common/controls/InputText.svelte';

   // Stores
   import projectStore from '../../stores/project';

   // Properties
   export let creator = '';

   // Variables
   let contract = '';
   let jobName = '';
   let carNo = '';
   let customer = '';
   let layout = '';
   let metric = false;
   let created = new Date();
   let opened = [];
   let modules = {};
   let temp = false;

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      // console.log('Project Summary', store);

      if (Object.keys(store).length > 1) {
         const project = { ...store };
         carNo = project.carNo;
         contract = project.contract;
         created = project.created;
         creator = project.creator;
         customer = project.customer;
         jobName = project.jobName;
         layout = project.layout;
         metric = project.metric;
         modules = project.modules;
         opened = project.opened;
         temp = project.temp;

         const search = opened.findIndex((user) => creator === user.userId);

         if (search >= 0) {
            opened[search].time = new Date();
         } else {
            opened.push({ userId: creator, time: created });
         }
      }
   });

   // Lifecycle
   onDestroy(() => {
      projectStore.save('project', { carNo, contract, created, creator, customer, jobName, layout, metric, modules, opened, temp });

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

   <div class="box">
      <Checkbox bind:checked={temp} label="Temporary Workbook" bullet />
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
