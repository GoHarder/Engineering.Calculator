<script>
   // Svelte imports
   import { onDestroy } from 'svelte';

   // Project Components
   import InputNumber from '../common/controls/InputNumber.svelte';
   import Select from '../common/controls/Select.svelte';

   // Stores
   import projectStore from '../../stores/project';

   // Methods
   const filterFreightSel = (type) => freightSel.filter((option) => option.types.includes(type));

   const filterCodeSel = (code) => codeSel.find((option) => option.text === code).ibc;

   // Constants
   const codeSel = [
      { text: 'ASME A17-1 2019', ibc: true },
      { text: 'ASME A17-1 2016', ibc: true },
      { text: 'ASME A17-1 2013', ibc: true },
      { text: 'ASME A17-1 2012', ibc: false },
      { text: 'ASME A17-1 2010', ibc: false },
   ];
   const typeSel = [{ text: 'Passenger' }, { text: 'Freight' }];
   const freightSel = [
      { text: 'None', types: ['Passenger'] },
      { text: 'A', types: ['Passenger', 'Freight'] },
      { text: 'B-Auto', types: ['Freight'] },
      { text: 'B-Truck', types: ['Freight'] },
      { text: 'C1', types: ['Passenger', 'Freight'] },
      { text: 'C2', types: ['Passenger', 'Freight'] },
      { text: 'C3', types: ['Passenger', 'Freight'] },
   ];
   const ropingSel = [
      { text: '1:1', value: 1 },
      { text: '2:1', value: 2 },
   ];
   const seismicZoneSel = [{ text: 0 }, { text: 1 }, { text: 2 }, { text: 3 }, { text: 4 }];
   const ibcCategorySel = [{ text: 'A' }, { text: 'B' }, { text: 'C' }, { text: 'D' }, { text: 'E' }, { text: 'F' }];
   const ibcIpSel = [{ text: 1 }, { text: 1.5 }];

   // Variables
   let capacity = 0;
   let carSpeed = 0;
   let overallTravel = 0;
   let code = 'ASME A17-1 2010';
   let type = 'Passenger';
   let freight = 'None';
   let carRoping = 1;
   let cwtRoping = 1;
   let seismicZone = 0;
   let metric = false;

   let ibcCategory = 'A';
   let ip = 1;
   let sds = 0;
   let showIP = false;
   let showSDS = false;

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      console.log('Requirements', store);

      if (Object.keys(store).length !== 0) {
         const project = { ...store };

         // Project data
         metric = project.metric;

         if (project.modules.globals) {
            const globals = project.modules.globals;

            // Global data
            capacity = globals.capacity;
            carSpeed = globals.carSpeed;
            overallTravel = globals.overallTravel;
            code = globals.code;
            type = globals.loading.type;
            freight = globals.loading.freight;
            carRoping = globals.carRoping;
            cwtRoping = globals.cwtRoping;
            seismicZone = globals.seismic.zone;

            // Weird seisic data
            ibcCategory = globals.ibcCategory;
            ip = globals.ip;
            sds = globals.sds;
         }
      }
   });

   // Reactive Variables
   $: filteredFreightSel = filterFreightSel(type);
   $: ibc = filterCodeSel(code);

   // Reactive Rules
   $: if (carRoping) cwtRoping = carRoping;

   // NOTE: Logic is from ASME TR A17.1-8.4-2013
   // This converts the convoluted new seismic zones to the 0-4 scale
   $: if (ibc) {
      switch (ibcCategory) {
         case 'C':
            showIP = true;
            showSDS = ip === 1.5;

            if (ip === 1) {
               showSDS = false;
               seismicZone = 0;
            } else {
               showSDS = true;

               if (sds <= 0.496) {
                  seismicZone = 2;
               } else if (sds <= 0.993) {
                  seismicZone = 3;
               } else {
                  seismicZone = 4;
               }
            }
            break;

         case 'D':
         case 'E':
         case 'F':
            showIP = true;
            showSDS = true;

            if (ip === 1) {
               showSDS = false;

               if (sds <= 0.745) {
                  seismicZone = 2;
               } else if (sds <= 1.487) {
                  seismicZone = 3;
               } else {
                  seismicZone = 4;
               }
            } else {
               showSDS = true;

               if (sds <= 0.496) {
                  seismicZone = 2;
               } else if (sds <= 0.993) {
                  seismicZone = 3;
               } else {
                  seismicZone = 4;
               }
            }
            break;

         default:
            showIP = false;
            showSDS = false;
            seismicZone = 0;
            break;
      }
   }

   // Lifecycle
   onDestroy(() => {
      console.log('TODO: 2-24-2021 11:11 AM - add to store when unmount');

      // projectStore.save('project', { contract, jobName, carNo, customer, layout, metric });

      clearProject();
   });
</script>

<p>Enter the car requirements and proceed to the next step</p>

<div class="form-box">
   <div class="box">
      <InputNumber bind:value={capacity} label="Capacity" type="weight" style={4} {metric} bullet />
   </div>

   <div class="box">
      <InputNumber bind:value={carSpeed} label="Car Speed" type="speed" style={4} {metric} bullet />
   </div>

   <div class="box">
      <InputNumber bind:value={overallTravel} label="Overall Travel" type="length" style={4} {metric} bullet />
   </div>

   <div class="box">
      <Select bind:value={code} label="Governing Code" options={codeSel} selected={4} style={4} bullet />
   </div>

   <div class="box">
      <Select bind:value={type} label="Loading Type" options={typeSel} style={4} bullet />
   </div>

   <div class="box">
      <Select bind:value={freight} label="Freight Class" options={filteredFreightSel} style={4} bullet />
   </div>

   <div class="box">
      <Select bind:value={carRoping} label="Car Roping" options={ropingSel} style={4} bullet />
   </div>

   <div class="box">
      <Select bind:value={cwtRoping} label="Counterweight Roping" options={ropingSel} style={4} bullet />
   </div>

   <div class="box">
      <Select bind:value={seismicZone} label="Seismic Zone" options={seismicZoneSel} style={4} bullet />
   </div>
</div>

{#if ibc}
   <p>IBC/ASCE 7 Seismic Parameters</p>

   <div class="form-box">
      <div class="box">
         <Select bind:value={ibcCategory} label="Seismic Design Category" options={ibcCategorySel} style={4} bullet />
      </div>

      {#if showIP}
         <div class="box">
            <Select bind:value={ip} label="IP" options={ibcIpSel} style={4} bullet />
         </div>

         {#if showSDS}
            <div class="box">
               <InputNumber bind:value={sds} label="SDS" style={4} {metric} bullet precision={0.001} />
            </div>
         {/if}
      {/if}
   </div>
{/if}

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
