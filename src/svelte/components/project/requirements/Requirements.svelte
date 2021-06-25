<script>
   import { createEventDispatcher, onDestroy } from 'svelte';

   // Components
   import SectionTitle from '../../common/SectionTitle.svelte';
   import ProjectShell from '../common/ProjectShell.svelte';
   import { HelperText, Input, InputLength, InputSpeed, InputWeight } from '../../material/input';
   import { Checkbox } from '../../material/checkbox';
   import { Option, Select } from '../../material/select';

   // Stores
   import projectStore from '../../../stores/project';

   // Methods
   const filterFreightSel = (type) => freightSel.filter((option) => option.types.includes(type));

   const filterCodeSel = (code) => codeSel.find((option) => option.text === code).ibc;

   // Constants
   const dispatch = createEventDispatcher();
   const codeSel = [
      { text: 'ASME A17-1 2019', ibc: true },
      { text: 'ASME A17-1 2016', ibc: true },
      { text: 'ASME A17-1 2013', ibc: true },
      { text: 'ASME A17-1 2012', ibc: false },
      { text: 'ASME A17-1 2010', ibc: false },
      { text: 'ASME A17-1 2005S', ibc: false },
      { text: 'ASME A17-1 2000', ibc: false },
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
   let _id = undefined;

   // - Workbook
   let capacity = 0;
   let carRoping = 1;
   let carSpeed = 0;
   let code = 'ASME A17-1 2010';
   let cwtRoping = 1;
   // - Loading
   let freight = 'None';
   let type = 'Passenger';

   let overallTravel = 0;
   // - Seismic
   let seismicZone = 0;
   let ibcCategory = 'A';
   let ip = 1;
   let sds = 0;

   // - DOM
   let metric = false;
   let showIP = false;
   let showSDS = false;
   let useIbc = false;
   let bind = undefined;

   // Reactive Variables
   $: filteredFreightSel = filterFreightSel(type);
   $: ibc = filterCodeSel(code);

   $: capacityError = capacity <= 0;
   $: carSpeedError = carSpeed <= 0;
   $: overallTravelError = overallTravel <= 0;
   $: formError = capacityError || carSpeedError || overallTravelError;

   // Reactive Rules
   $: if (carRoping) cwtRoping = carRoping;

   // NOTE: Logic is from ASME TR A17.1-8.4-2013
   // This converts the convoluted new seismic zones to the 0-4 scale
   $: if (ibc && useIbc) {
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

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      // console.log('Requirements', store);

      if (Object.keys(store).length !== 0) {
         const project = { ...store };

         // Project data
         metric = project.metric;

         if (project.modules.globals) {
            const globals = project.modules.globals;

            // Global data
            _id = globals?._id;
            capacity = globals.capacity;
            carSpeed = globals.carSpeed;
            overallTravel = globals.overallTravel;
            code = globals.code;
            type = globals.loading.type;
            freight = globals.loading.freight;
            carRoping = globals.carRoping;
            cwtRoping = globals.cwtRoping;

            // Weird seisic data
            useIbc = globals.seismic.useIbc;
            seismicZone = globals.seismic.zone;
            ibcCategory = globals.seismic.ibcCategory;
            ip = globals.seismic.ip;
            sds = globals.seismic.sds;
         }
      }
   });

   // Events
   const onBack = () => dispatch('changePage', 'ProjectSummary');

   const onNext = () => {
      if (!formError) {
         dispatch('changePage', 'CalculationModules');
      } else {
         const inputs = bind.querySelectorAll('input');
         console.log(inputs);

         for (let i = 0; i < inputs.length; i++) {
            const element = inputs[i];

            // Trips all the inputs to show the error
            // element.focus();
            // element.blur();
         }
      }
   };

   // Lifecycle
   onDestroy(() => {
      const loading = { freight, type };
      const seismic = { ibcCategory, ip, sds, useIbc, zone: seismicZone };
      const saveData = { capacity, carRoping, carSpeed, code, cwtRoping, loading, overallTravel, type, seismic };

      if (_id) saveData._id = _id;

      projectStore.save('globals', saveData);

      clearProject();
   });
</script>

<ProjectShell on:onNext={onNext} on:onBack={onBack} activeTab={2} validForm={!formError}>
   <div class="form">
      <p>Enter the car requirements and proceed to the next step</p>
      <div class="form-box">
         <div class="box">
            <InputWeight bind:value={capacity} type="number" bind:invalid={capacityError} helperText="Invalid capacity" label="Capacity" {metric} />
         </div>
         <div class="box">
            <InputSpeed bind:value={carSpeed} bind:invalid={carSpeedError} helperText="Invalid car speed" label="Car Speed" {metric} />
         </div>
         <div class="box">
            <InputLength bind:value={overallTravel} bind:invalid={overallTravelError} helperText="Invalid length" label="Overall Travel" {metric} />
         </div>
         <div class="box">
            <Select bind:value={code} label="Governing Code">
               {#each codeSel as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>
         <div class="box">
            <Select bind:value={type} label="Loading Type">
               {#each typeSel as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>
         <div class="box">
            <Select bind:value={freight} label="Freight Class">
               {#each filteredFreightSel as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>
         <div class="box">
            <Select bind:value={carRoping} label="Car Roping">
               {#each ropingSel as { text, value }}
                  <Option {text} {value} />
               {/each}
            </Select>
         </div>
         <div class="box">
            <Select bind:value={cwtRoping} label="Counterweight Roping">
               {#each ropingSel as { text, value }}
                  <Option {text} {value} />
               {/each}
            </Select>
         </div>
         <div class="box">
            <Select bind:value={seismicZone} disabled={ibc && useIbc} label="Seismic Zone">
               {#each seismicZoneSel as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>
      </div>
   </div>

   <div class="form">
      {#if ibc}
         <div class="section-title">
            <SectionTitle>IBC/ASCE 7 Seismic Parameters</SectionTitle>
         </div>

         <div class="form-box">
            <div class="box">
               <Checkbox bind:checked={useIbc} label="Use IBC/ASCE 7 Seismic Parameters" />
            </div>

            {#if useIbc}
               <div class="box">
                  <Select bind:value={ibcCategory} label="Seismic Design Category">
                     {#each ibcCategorySel as { text }}
                        <Option {text} />
                     {/each}
                  </Select>
               </div>

               {#if showIP}
                  <div class="box">
                     <Select bind:value={ip} label="IP" options={ibcIpSel}>
                        {#each ibcIpSel as { text }}
                           <Option {text} />
                        {/each}
                     </Select>
                  </div>

                  {#if showSDS}
                     <div class="box">
                        <Input bind:value={sds} label="SDS" min={0} max={1.487} step={0.001} type="number">
                           <span slot="helperText">
                              <HelperText validation>Invalid SDS</HelperText>
                           </span>
                        </Input>
                     </div>
                  {/if}
               {/if}
            {/if}
         </div>
      {/if}
   </div>
</ProjectShell>

<style>
   .form {
      padding: 16px;
   }
   p,
   .section-title {
      margin: 0 30px;
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
      padding: 16px 16px 0;
   }
   @media (min-width: 786px) {
      .box {
         max-width: 50%;
         flex-basis: 50%;
      }
   }
   @media (min-width: 1600px) {
      .box {
         max-width: calc(100% / 3);
         flex-basis: calc(100% / 3);
      }
   }
</style>
