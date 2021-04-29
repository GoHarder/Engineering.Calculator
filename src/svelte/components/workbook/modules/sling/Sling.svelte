<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { fade } from 'svelte/transition';
   import { floor, round } from '../round';
   import * as tables from './tables';
   import * as options from './options';
   import { inherit } from '../inherit';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Components
   import { Input, InputLength, InputPressure, InputSpeed, InputWeight } from '../../../material/input';
   import { Option, Select } from '../../../material/select';
   import { Checkbox } from '../../../material/checkbox';
   import { IconButton } from '../../../material/button';
   import { Link } from '../../../material/button/icons';

   // Methods
   const onSave = () => {
      const saveData = {
         car: {
            railSize: carRailSize,
         },
         finFloor: {
            area: finFloorArea,
            weight: finFloorWeight,
            weightOverride: finFloorWeightOverride,
            materialWeight: finFloorMaterialWeight,
            thickness: finFloorThickness,
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

   const getShoe = (model, options) => options?.find((shoe) => shoe.name === model);

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

   const getSafety = (model, options) => options?.find((safety) => safety.name === model);

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

   const getSheave = (model, options) => options?.find((sheave) => sheave.name === model);

   const getFinFloorWeight = (area, materialWeight) => {
      const platformArea = platformWidth * platformDepth;
      const cabArea = cabWidth * cabDepth;

      return round((area === 'Inside Cab' ? cabArea : platformArea) * materialWeight);
   };

   // Constants
   const dispatch = createEventDispatcher();
   const { metric, modules } = workbook;
   const { capacity, carRoping, carSpeed } = modules.globals;
   const { sling: module } = workbook.modules;
   console.log(workbook.modules);

   // Variables

   let railLock = false; // if true then two shoe plates
   // rail Lock weight: 108, height: 2.5

   let carRailSize = module?.car?.railSize ?? '15#';
   let carDBG = 0;
   let carTopWeight = 150;
   let miscEquipmentWeight = 200;
   let doorOperator = 150;

   let stilesBackToBack = 0;
   let underBeamHeight = 114;

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

   let finFloorArea = module?.finFloor?.area ?? 'Inside Cab';
   let finFloorWeight = module?.finFloor?.weight ?? 0;
   let finFloorWeightOverride = module?.finFloor?.weightOverride ?? false;
   let finFloorMaterialWeight = module?.finFloor?.materialWeight ?? 0;
   let finFloorThickness = module?.finFloor?.thickness ?? 0.25;

   let platformDepth = inherit(modules, 'platform.platformDepth', 'value') ?? 0;
   let platformIsolation = inherit(modules, 'platform.platformIsolation', 'value') ?? false;
   let platformThickness = inherit(modules, 'platform.platformThickness', 'value') ?? 0;
   let platformWeight = inherit(modules, 'platform.platformWeight', 'value') ?? 0;
   let platformWidth = inherit(modules, 'platform.platformWidth', 'value') ?? 0;

   let platformThicknessLink = inherit(modules, 'platform.platformThickness', 'module');
   let platformWeightLink = inherit(modules, 'platform.platformWeight', 'module');

   let cabDepth = inherit(modules, 'platform.cabDepth', 'value') ?? 0;
   let cabWeight = inherit(modules, 'platform.cabWeight', 'value') ?? 0;
   let cabWidth = inherit(modules, 'platform.cabWidth', 'value') ?? 0;

   let door1Weight = inherit(modules, 'platform.door1Weight', 'value') ?? 0;
   let door2Weight = inherit(modules, 'platform.door2Weight', 'value') ?? 0;

   let toeGuard1Weight = inherit(modules, 'platform.toeGuard1Weight', 'value') ?? 0;
   let toeGuard2Weight = inherit(modules, 'platform.toeGuard2Weight', 'value') ?? 0;

   // - Database Information
   let shoes = undefined;
   let safeties = undefined;
   let sheaves = undefined;

   // Reactive Variables
   $: shoe = getShoe(shoeModel, shoes);
   $: safety = getSafety(safetyModel, safeties);
   $: sheave = getSheave(sheaveModel, sheaves);
   $: plywoodWeight = round(platformWidth * platformDepth * plywoodThickness * plywoodQty * 0.02083, 2); // 1" plywood weight = 3 lbs per square foot
   $: isolationWeight = round((platformDepth - 3) * 0.55 + platformWidth * 0.34167, 2);

   $: slingDimH =
      shoeHeight * 2 +
      (railLock ? 2.5 : 0) +
      underBeamHeight +
      finFloorThickness +
      plywoodThickness * plywoodQty +
      platformThickness +
      (platformIsolation ? 2 : 0) +
      safetyHeight;

   // $: console.table({
   //    shoes: shoeHeight,
   //    railLock: railLock ? 2.5 : 0,
   //    topShoePlate: undefined,
   //    topBeamHeight: undefined,
   //    underBeamHeight,
   //    finFloorThickness,
   //    plywoodThickness: plywoodThickness * plywoodQty,
   //    platformThickness,
   //    platformIsolation: platformIsolation ? 2 : 0,
   //    bottomChannel: undefined,
   //    safetyHeight,
   //    bottomShoePlate: undefined,
   //    total: slingDimH,
   // });

   $: carWeight =
      platformWeight +
      toeGuard1Weight +
      toeGuard2Weight +
      cabWeight +
      shoeWeight * 4 +
      carTopWeight +
      miscEquipmentWeight +
      safetyWeight +
      door1Weight +
      door2Weight +
      doorOperator +
      finFloorWeight +
      plywoodWeight +
      isolationWeight;

   $: console.table({
      platform: platformWeight,
      toeGuards: toeGuard1Weight + toeGuard1Weight,
      cab: cabWeight,
      shoes: shoeWeight,
      shoePlates: undefined,
      railLock: railLock ? 108 : 0,
      carTop: carTopWeight,
      miscEquipment: miscEquipmentWeight,
      safety: safetyWeight,
      doors: door1Weight + door2Weight,
      doorOperator,
      finshedFlooring: finFloorWeight,
      plywood: plywoodWeight,
      isolation: isolationWeight,
      balanceWeights: undefined,
      compChainHitch: undefined,
      sheaves: undefined,
      miscWeight: undefined,
   });

   // - Overrideable
   $: ropePitchCalc = ropeSize + 0.25;
   $: finFloorWeightCalc = getFinFloorWeight(finFloorArea, finFloorMaterialWeight);

   // - Controls
   $: shoeOptions = getShoeOptions(shoes, carRailSize);
   $: safetyOptions = getSafetyOptions(safeties, carRailSize);
   $: sheaveOptions = getSheaveOptions(sheaves, ropeQty, ropeSize, ropePitch);

   // Reactive Rules
   $: if (save) onSave();

   $: if (shoe && shoeModel !== 'Other') {
      shoeHeight = shoe.railContactHeight;
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
   {#if !finFloorWeightOverride}
      <div class="input-bump" transition:fade>
         <InputLength bind:value={finFloorThickness} label="Thickness" {metric} />
      </div>
      <div class="input-bump" transition:fade>
         <InputPressure bind:value={finFloorMaterialWeight} label="Material Weight" {metric} />
      </div>
      <div class="input-bump" transition:fade>
         <Select bind:value={finFloorArea} label="Area">
            {#each options.finFloorArea as { text }}
               <Option {text} />
            {/each}
         </Select>
      </div>
   {/if}
   <div class="input-bump">
      <InputWeight bind:value={finFloorWeight} bind:override={finFloorWeightOverride} calc={finFloorWeightCalc} label="Weight" reset />
   </div>
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
      <div class="input-bump" transition:fade>
         <InputWeight bind:value={plywoodWeight} display label="Weight" step={0.01} {metric} />
      </div>
   {/if}
</fieldset>

<fieldset>
   <legend>Platform</legend>
   <hr />
   <div class="input-bump link">
      <InputLength bind:value={platformThickness} display={!platformThicknessLink} label="Thickness" {metric} />
      {#if platformThicknessLink}
         <IconButton on:click={() => dispatch('changeModule', platformThicknessLink)}>
            <Link />
         </IconButton>
      {/if}
   </div>

   <div class="input-bump link">
      <InputWeight bind:value={platformWeight} display={!platformWeightLink} label="Weight" step={0.01} {metric} />
      {#if platformWeightLink}
         <IconButton on:click={() => dispatch('changeModule', platformWeightLink)}>
            <Link />
         </IconButton>
      {/if}
   </div>
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
