<script>
   import { createEventDispatcher, onDestroy } from 'svelte';

   // Components
   import A from '../../common/A.svelte';
   import ProjectTab from '../common/ProjectTab.svelte';
   import { Button, Label } from '../../material/button';
   import { ArrowBackIos, ArrowForwardIos } from '../../material/button/icons';
   import { InputLength, InputSpeed, InputWeight } from '../../material/input';
   import { Checkbox } from '../../material/checkbox';

   // Stores
   import projectStore from '../../../stores/project';

   // Constants
   const activeTab = 2;
   const dispatch = createEventDispatcher();

   // Variables
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
   let form;

   let capacityError = '';
   let carSpeedError = '';

   // Reactive Variables

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
   const onHome = () => dispatch('changePage', 'Home');

   const onBack = () => dispatch('changePage', 'ProjectSummary');

   const onNext = () => {
      console.log('TODO: 3-15-2021 11:09 AM - hook up next button');
      // dispatch('changePage', 'Requirements');
      form.checkValidity();
   };

   // Lifecycle
   onDestroy(() => {
      const loading = { freight, type };
      const seismic = { ibcCategory, ip, sds, useIbc, zone: seismicZone };

      projectStore.save('globals', { capacity, carRoping, carSpeed, code, cwtRoping, loading, module, overallTravel, type, seismic });

      clearProject();
   });
</script>

<main>
   <div class="head">
      <A on:click={onHome}>Home</A>
      <div class="title">
         <i class="material-icons">engineering</i>
         <h6>Configuration</h6>
      </div>
   </div>

   <div class="paper n1">
      <div class="tabs">
         <ProjectTab on:click={onBack} label="Project Summary" index={1} {activeTab} />
         <ProjectTab label="Requirements" index={2} {activeTab} />
         <ProjectTab on:click={onNext} label="Calculation Modules" index={3} {activeTab} />
      </div>

      <form bind:this={form}>
         <p>Enter the car requirements and proceed to the next step</p>
         <div class="form-box">
            <div class="box">
               <InputWeight bind:value={capacity} bind:invalid={capacityError} disableValidation helperText={capacityError} label="Capacity" {metric} />
            </div>
            <div class="box">
               <InputSpeed bind:value={carSpeed} bind:invalid={carSpeedError} disableValidation helperText={carSpeedError} label="Car Speed" {metric} />
            </div>
            <div class="box">
               <InputLength bind:value={overallTravel} label="Overall Travel" {metric} />
            </div>
            <div class="box">
               <!-- <Input bind:value={customer} label="Customer" /> -->
            </div>
            <div class="box">
               <!-- <Input bind:value={layout} label="Layout Number" /> -->
            </div>
            <div class="box">
               <!-- <Checkbox bind:checked={metric} label="Show Metric Units" /> -->
            </div>
            <div class="box">
               <!-- <Checkbox bind:checked={temp} label="Temporary Workbook" /> -->
            </div>
         </div>
      </form>
   </div>
   <div class="paper n2">
      <Button on:click={onBack} variant="contained" color="secondary">
         <ArrowBackIos />
         <Label>Back</Label>
      </Button>
      <Button on:click={onNext} variant="contained">
         <Label>Next</Label>
         <ArrowForwardIos />
      </Button>
   </div>
</main>

<style lang="scss">
   @import './src/scss/vantage-theme';

   main {
      padding: 16px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
   }
   .head {
      padding-bottom: 16px;
   }
   .title {
      display: flex;
      align-items: center;
      h6 {
         font: {
            weight: 600;
            size: 1.25rem;
         }
         line-height: 1.6;
         margin: 0 0 0 8px;
      }
   }

   .paper {
      @include vantage-paper;
      &.n1 {
         @include vantage-border;
         padding: 0 0 16px;
      }
      &.n2 {
         margin-top: 4px;
         padding: 16px;
         display: flex;
         justify-content: flex-end;
         gap: 16px;
      }
   }

   .tabs {
      background-color: #f5f5f5;
      display: flex;
      padding: 16px 16px 0;
   }
   form {
      padding: 16px;
      height: calc(100vh - 400px);
      overflow-y: auto;
   }
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

   @media (min-width: 786px) {
      main {
         padding: 16px;
      }
      .box {
         max-width: 50%;
         flex-basis: 50%;
      }
   }

   @media (min-width: 1600px) {
      main {
         max-width: 1600px;
      }
      .box {
         max-width: calc(100% / 3);
         flex-basis: calc(100% / 3);
      }
   }
</style>
