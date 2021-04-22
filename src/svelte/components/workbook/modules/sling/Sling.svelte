<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { fade } from 'svelte/transition';
   import { floor, round } from '../round';
   import * as tables from './tables';
   import * as options from './options';
   import * as shared from '../shared';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Components
   import { Input, InputLength, InputSpeed, InputWeight } from '../../../material/input';
   import { OptGroup, Option, Select } from '../../../material/select';
   import { Checkbox } from '../../../material/checkbox';
   import { IconButton } from '../../../material/button';
   import { Link } from '../../../material/button/icons';

   // Methods
   const onSave = () => {
      const saveData = {
         car: {
            railSize: carRailSize,
         },
         safety: {
            model: safetyModel,
         },
         shoe: {
            model: shoeModel,
         },
      };

      const safety = {
         height: safetyHeight,
         weight: safetyWeight,
      };

      const shoe = {
         height: shoeHeight,
         weight: shoeWeight,
      };

      if (saveData.safety.model === 'Other') saveData.safety = { ...saveData.safety, ...safety };
      if (saveData.shoe.model === 'Other') saveData.shoe = { ...saveData.shoe, ...shoe };

      workbook.modules.sling = { ...workbook.modules.sling, ...saveData };

      saveProject();
   };

   const getEngineeringData = async (capacity, carSpeed) => {
      const res = await fetch(`api/engineering/sling?capacity=${capacity}&carSpeed=${carSpeed}`, {
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => {
         console.log(error);
         return { ok: false };
      });

      if (res.ok) {
         const body = await res.json();

         shoes = [...body.shoe];
         safeties = [...body.safety];
         sheaves = [...body.sheaves];
      } else {
         console.log(res);
      }
   };

   const getShoeOptions = (shoes, railSize) => {
      let options = [{ name: 'Other', railSizes: tables.railSize, height: 0, weight: 0 }];

      if (shoes) options = [...shoes, ...options];

      options = options.map((shoe) => {
         return {
            text: shoe.name,
            valid: shoe.railSizes.includes(railSize),
         };
      });

      options = options.filter((shoe) => (shoe.text === '371-CS' && !shoe.valid) === false);

      return options;
   };

   const getShoe = (model, options) => options.find((shoe) => shoe.name === model);

   const getSafetyOptions = (safeties, railSize) => {
      let options = [{ name: 'Other', railSizes: tables.railSize }];

      if (safeties) options = [...safeties, ...options];

      options = options.map((safety) => {
         return {
            text: safety.name,
            valid: safety.railSizes.includes(railSize),
         };
      });

      return options;
   };

   const getSafety = (model, options) => options.find((safety) => safety.name === model);

   const getSheaveOptions = (sheaves = [], qty, diameter, pitch) => {
      let options = [];
      const requiredWidth = round((qty - 1) * pitch + diameter + 0.625, 4);
      const requiredDiameter = round(diameter * 40, 3);

      if (sheaves) options = [...sheaves];

      options = options.map((sheave) => {
         return {
            value: sheave.name,
            text: `${sheave.name} (Ø${floor(sheave.diameter)}")`,
            valid: sheave.diameter >= requiredDiameter && sheave.rimWidth >= requiredWidth,
         };
      });

      return options;
   };

   const getSheave = (model, options) => options.find((sheave) => sheave.name === model);

   // Constants
   const dispatch = createEventDispatcher();
   const { metric, modules } = workbook;
   const { capacity, carRoping, carSpeed } = modules.globals;
   const { sling: module } = workbook.modules;
   // console.log(workbook.modules);

   // Variables

   let railLock = false; // if true then two shoe plates
   // rail Lock weight: 108, height: 2.5

   let carRailSize = module?.car?.railSize ?? '15#';
   let carDBG = 0;

   let stilesBackToBack = 0;
   let underBeamHeight = 20;

   let safetyModel = module?.safety?.model ?? '';
   let safetyHeight = module?.safety?.height ?? 0;
   let safetyWeight = module?.safety?.weight ?? 0;

   let shoeModel = module?.shoe?.model ?? '';
   let shoeHeight = module?.shoe?.height ?? 0;
   let shoeWeight = module?.shoe?.weight ?? 0;

   let ropeSize = 0.375;
   let ropeQty = 4;
   let ropePitch = 0;
   let ropePitchOverride = false;

   let sheaveModel = '';
   let sheaveLocation = 'Overslung';
   let sheaveQty = carRoping === 1 ? 0 : 1;
   let sheaveChannels = false;

   let plywoodQty = 0;
   let plywoodThickness = 0.25;

   // - Database Information
   let shoes = undefined;
   let safeties = undefined;
   let sheaves = undefined;

   // Reactive Variables
   $: shoe = getShoe(shoeModel, shoeOptions);
   $: safety = getSafety(safetyModel, safetyOptions);
   $: sheave = getSheave(sheaveModel, sheaveOptions);

   $: ropePitchCalc = ropeSize + 0.25;

   // - Controls
   $: shoeOptions = getShoeOptions(shoes, carRailSize);
   $: safetyOptions = getSafetyOptions(safeties, carRailSize);
   $: sheaveOptions = getSheaveOptions(sheaves, ropeQty, ropeSize, ropePitch);

   // NOTE: 4-20-2021 2:03 PM - test of variable ineritance
   // console.log(shared.platformThickness(modules, 'value'));
   // console.log(shared.platformThickness(modules, 'module'));

   // Reactive Rules
   $: if (save) {
      onSave();
   }

   $: if (shoe && shoeModel !== 'Other') {
      shoeHeight = shoe.height;
      shoeWeight = shoe.weight;
   }

   $: if (safety && safetyModel !== 'Other') {
      safetyHeight = safety.height;
      safetyWeight = safety.weight;
   }

   $: if (sheaveLocation === 'Underslung') sheaveQty = 2;

   // $: if (sheaveModel === ' ' && sheaveOptions.length > 0) sheaveModel = sheaveOptions[0].name;

   // Lifecycle
   onMount(() => {
      getEngineeringData(capacity, carSpeed);
   });

   onDestroy(() => {
      onSave();
   });

   // $: console.log(sheaveOptions);
   // $: console.log(sheave);
   // $: console.log(sheaveModel);
</script>

<fieldset>
   <legend>Globals</legend>
   <hr />
   <div class="input-bump link">
      <InputWeight value={capacity} display label="Capacity" {metric} />
      <IconButton on:click={() => dispatch('changePage', 'Requirements')}>
         <Link />
      </IconButton>
   </div>
   <div class="input-bump link">
      <InputSpeed value={carSpeed} display label="Car Speed" {metric} />
      <IconButton on:click={() => dispatch('changePage', 'Requirements')}>
         <Link />
      </IconButton>
   </div>
   <div class="input-bump link">
      <Input value={`${carRoping}:1`} display label="Roping" />
      <IconButton on:click={() => dispatch('changePage', 'Requirements')}>
         <Link />
      </IconButton>
   </div>
</fieldset>

<fieldset>
   <legend>Properties</legend>
   <hr />
   <div class="input-bump">
      <Select bind:value={carRailSize} label="Rail Size">
         {#each tables.railSize as text}
            <Option {text} />
         {/each}
      </Select>
   </div>

   <div class="input-bump">
      <InputLength bind:value={carDBG} label="D.B.G." {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={stilesBackToBack} label="Back to Back of Stiles" {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={underBeamHeight} label="Under Beam Height" {metric} />
   </div>
</fieldset>

{#if carRoping > 1}
   <fieldset>
      <legend>Ropes</legend>
      <hr />
      <div class="input-bump">
         <Input bind:value={ropeQty} label="Quantity" type="number" />
      </div>
      <div class="input-bump">
         <Select bind:value={ropeSize} label="Size">
            {#each options.ropeSize as { text, value }}
               <Option {text} {value} />
            {/each}
         </Select>
      </div>
      <div class="input-bump">
         <InputLength bind:value={ropePitch} bind:override={ropePitchOverride} bind:calc={ropePitchCalc} label="Pitch" reset {metric} />
      </div>
   </fieldset>

   <fieldset>
      <legend>Sheaves</legend>
      <hr />
      <div class="input-bump">
         <Select bind:value={sheaveModel} label="Model">
            {#each sheaveOptions as { value, text, valid }}
               <Option {value} {text} disabled={!valid} selected={sheaveModel === value} />
            {/each}
         </Select>
      </div>

      <div class="input-bump">
         <Select bind:value={sheaveLocation} label="Mounting">
            {#each options.sheaveLocation as { text }}
               <Option {text} />
            {/each}
         </Select>
      </div>
      <div class="input-bump">
         <Input bind:value={sheaveQty} label="Quantity" type="number" />
      </div>
      {#if sheaveQty > 1}
         <div class="input-bump" transition:fade>
            <Checkbox bind:checked={sheaveChannels} label="Use Sheave Channels" />
         </div>
      {/if}
   </fieldset>
{/if}

<fieldset>
   <legend>Steel</legend>
   <hr />
</fieldset>

<fieldset>
   <legend>Shoes</legend>
   <hr />
   <div class="input-bump">
      <Select bind:value={shoeModel} label="Model">
         {#each shoeOptions as { text, valid }}
            <Option {text} disabled={!valid} selected={shoeModel === text} />
         {/each}
      </Select>
   </div>
   {#if shoeModel === 'Other'}
      <div class="input-bump" transition:fade>
         <InputWeight bind:value={shoeWeight} label="Weight per Shoe" {metric} />
      </div>
      <div class="input-bump" transition:fade>
         <InputLength bind:value={shoeHeight} label="Height" {metric} />
      </div>
   {/if}
</fieldset>

<fieldset>
   <legend>Shoe Plates</legend>
   <hr />
   {#if ['12#', '15#'].includes(carRailSize)}
      <div class="input-bump" transition:fade>
         <Checkbox bind:checked={railLock} label="Rail Locks" />
      </div>
   {/if}
</fieldset>

<fieldset>
   <legend>Finished Flooring</legend>
   <hr />
</fieldset>

<fieldset>
   <legend>Plywood</legend>
   <hr />
   <div class="input-bump">
      <Input bind:value={plywoodQty} label="Layers" type="number" />
   </div>

   {#if plywoodQty > 0}
      <div class="input-bump" transition:fade>
         <Select bind:value={plywoodThickness} label="Thickness">
            {#each options.plywoodThickness as { text, value }}
               <Option {text} {value} />
            {/each}
         </Select>
      </div>
   {/if}
</fieldset>

<fieldset>
   <legend>Safety</legend>
   <hr />
   <div class="input-bump">
      <Select bind:value={safetyModel} label="Model">
         {#each safetyOptions as { text, valid }}
            <Option {text} disabled={!valid} selected={safetyModel === text} />
         {/each}
      </Select>
   </div>
   {#if safetyModel === 'Other'}
      <div class="input-bump" transition:fade>
         <InputWeight bind:value={safetyWeight} label="Weight" step={0.01} {metric} />
      </div>
      <div class="input-bump" transition:fade>
         <InputLength bind:value={safetyHeight} label="Height" {metric} />
      </div>
   {/if}
</fieldset>
