<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { slide } from 'svelte/transition';

   import * as gTables from '../js/tables';
   import * as tables from './tables';

   // Components
   import { Fieldset } from '../../common';
   import { Select, Option } from '../../../material/select';

   // Stores
   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Methods
   const onSave = () => {
      console.log(saveProject);
   };

   const getEngineeringData = async (type, location) => {
      const res = await fetch(`api/engineering/machine?type=${type}&location=${location}`, {
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => {
         console.log(error);
         return { ok: false };
      });

      if (res.ok) {
         const body = await res.json();

         // console.log(body);
         machines = [...body.machines];
      } else {
         console.log(res);
      }
   };

   // Constants
   const dispatch = createEventDispatcher();
   const { metric, modules } = workbook;

   // Variables
   let machines = [];
   let machineType = 'Geared';
   let machineLocation = 'Overhead';
   let machineModel = undefined;

   // Subscriptions
   // Reactive Rules
   $: if (save) onSave();

   $: getEngineeringData(machineType, machineLocation);

   // Events
   const onLink = (event) => dispatch(event.detail.cmd, event.detail.location);

   // Lifecycle
   onMount(() => {
      console.log('workbook', workbook);
      // getEngineeringData(machineType);
   });

   onDestroy(() => onSave());
</script>

<Fieldset title="Properties">
   <Select bind:value={machineType} label="Type">
      <Option text="Geared" />
      <Option text="Gearless" />
   </Select>

   <Select bind:value={machineLocation} label="Location">
      <Option text="Overhead" />
      <Option text="Hoistway" />
      <Option text="Basement" />
   </Select>

   <Select bind:value={machineModel} label="Model">
      {#each machines as { name } (name)}
         <Option text={name} selected={machineModel === name} />
      {/each}
   </Select>
</Fieldset>

<style>
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
   }
</style>
