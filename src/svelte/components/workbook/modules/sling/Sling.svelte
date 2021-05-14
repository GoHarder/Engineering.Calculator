<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { fade } from 'svelte/transition';
   import { ceil, floor, round, roundInc } from '../round';
   import * as tables from './tables';
   import * as options from './options';
   import { inherit } from '../inherit';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Components
   import { Input, InputLength, InputPressure, InputSpeed, InputWeight } from '../../../material/input';
   import { Option, OptGroup, Select } from '../../../material/select';
   import { Checkbox } from '../../../material/checkbox';
   import { IconButton } from '../../../material/button';
   import { Link } from '../../../material/button/icons';

   // Methods
   const onSave = () => {
      const saveData = {
         properties: {
            underBeamHeight,
            stilesBackToBack,
            stilesBackToBackOverride,
            model: slingModel,
            stile: slingStile,
            topChannel: slingTopChannel,
            bottomChannel: slingBottomChannel,
            compensation,
         },
         car: {
            dbg: carDBG,
            railSize: carRailSize,
         },
         plywood: {
            qty: plywoodQty,
            thickness: plywoodThickness,
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

      const rope = {
         size: ropeSize,
         qty: ropeQty,
         pitch: ropePitch,
         pitchOverride: ropePitchOverride,
      };

      if (safetyModel === 'Other') saveData.safety = { ...saveData.safety, ...safety };
      if (shoeModel === 'Other') saveData.shoe = { ...saveData.shoe, ...shoe };
      if (carRoping > 2) saveData = { ...saveData, rope };

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

         slingModels = [...body.models];
         topChannels = [...body.topChannels];
         bottomChannels = [...body.bottomChannels];

         shoes = [...body.shoes];
         shoePlates = [...body.shoePlates];
         safeties = [...body.safeties];
         sheaves = [...body.sheaves];
      } else {
         console.log(res);
      }
   };

   const getFromArray = (name, data) => data?.find((row) => row.name === name);

   // - Steel

   const getModelOptions = (models, modulusY, inertiaY, comp, topChannel, bottomChannel) => {
      let selections = [];

      if (models) selections = [...models];

      selections = selections.reduce((array, model) => {
         const validComp = model.comp.includes(comp);
         const validModulus = model.stiles.some((stile) => stile.modulusY >= modulusY);
         const validInertia = model.stiles.some((stile) => stile.inertiaY >= inertiaY);
         let validTopChannel = true;
         let validBottomChannel = true;

         if (topChannel && model?.top) validTopChannel = topChannel === model.top;
         if (bottomChannel && model?.bottom) validBottomChannel = bottomChannel === model.bottom;

         array.push({
            text: model.name,
            disabled: ![validComp, validModulus, validInertia, validTopChannel, validBottomChannel].every((test) => test),
         });
         return array;
      }, []);

      return selections;
   };

   const getStileOptions = (channels, modulusY, inertiaY) => {
      let selections = [];

      if (channels) selections = [...channels];

      selections = selections.reduce((array, channel) => {
         const validModulus = channel.modulusY >= modulusY;
         const validInertia = channel.inertiaY >= inertiaY;

         array.push({
            text: channel.name,
            disabled: ![validModulus, validInertia].every((test) => test),
            stockStatus: channel.stockStatus,
         });
         return array;
      }, []);

      selections = selections.reduce(
         (object, channel) => {
            object[channel.stockStatus.toLowerCase()].push(channel);

            return object;
         },
         { stocked: [], available: [], check: [] }
      );

      return selections;
   };

   const getChannelOptions = (channels, sectionModulus) => {
      let selections = [];

      if (channels) selections = [...channels];

      selections = selections.reduce((array, channel) => {
         array.push({
            text: channel.name,
            disabled: channel.modulusX < sectionModulus,
            stockStatus: channel.stockStatus,
         });
         return array;
      }, []);

      selections = selections.reduce(
         (object, channel) => {
            object[channel.stockStatus.toLowerCase()].push(channel);

            return object;
         },
         { stocked: [], available: [], check: [] }
      );

      return selections;
   };

   // - Products

   const getShoeOptions = (shoes, railSize) => {
      const railSizes = options.railSize.map((size) => size.text);

      let selections = [{ name: 'Other', railSizes, height: 0, weight: 0 }];

      if (shoes) selections = [...shoes, ...selections];

      selections = selections.map((shoe) => {
         return {
            text: shoe.name,
            valid: shoe.railSizes.includes(railSize),
         };
      });

      selections = selections.filter((shoe) => (shoe.text === '371-CS' && !shoe.valid) === false);

      return selections;
   };

   const getSafetyOptions = (safeties, railSize) => {
      const railSizes = options.railSize.map((size) => size.text);
      let selections = [{ name: 'Other', railSizes }];

      if (safeties) selections = [...safeties, ...selections];

      selections = selections.map((safety) => {
         return {
            text: safety.name,
            valid: safety.railSizes.includes(railSize),
         };
      });

      return selections;
   };

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

   const getShoePlate = (shoePlates, shoe, mounting, railSize) => {
      let output = {
         weight: 25,
         thickness: 0.75,
      };

      if (shoePlates) {
         const plate = [...shoePlates].find((plate) => plate.shoes.includes(shoe));
         const mountsTo = plate?.mountsTo.find((nth) => nth.products.includes(mounting));
         const variant = mountsTo?.variants.find((nth) => nth.railSizes.includes(railSize));

         output = {
            weight: variant?.weight ?? 25,
            thickness: variant?.thickness ?? 0.75,
         };
      }

      return output;
   };

   const getFinFloorWeight = (area, materialWeight) => {
      const platformArea = platformWidth * platformDepth;
      const cabArea = cabWidth * cabDepth;

      return round((area === 'Inside Cab' ? cabArea : platformArea) * materialWeight);
   };

   // Constants
   const dispatch = createEventDispatcher();
   const { metric, modules } = workbook;
   const { capacity, carRoping, carSpeed, loading } = modules.globals;
   const { freight } = loading;
   const { sling: module } = workbook.modules;
   const modulusOfElasticity = 29000000;
   console.log(workbook.modules);

   // Variables

   let railLock = false; // if true then two shoe plates

   let carRailSize = module?.car?.railSize ?? '15#';
   let carDBG = module?.car?.dbg ?? 3;

   let carTopWeight = 150;
   let miscEquipmentWeight = 200;
   let doorOperatorWeight = 150;

   let slingModel = module?.properties?.model ?? '7T';
   let slingStile = module?.properties?.stile ?? undefined;
   let slingTopChannel = module?.properties?.topChannel ?? undefined;
   let slingBottomChannel = module?.properties?.bottomChannel ?? undefined;
   let cornerPostSteel = undefined;

   let stilesBackToBack = module?.properties?.stilesBackToBack ?? carDBG - 3;
   let stilesBackToBackOverride = module?.properties?.stilesBackToBackOverride ?? false;
   let underBeamHeight = module?.properties?.underBeamHeight ?? 114;
   let compensation = module?.properties?.compensation ?? 'None';
   let strikePlateQty = 1;
   let braceQty = 4;
   let braceQtyOverride = false;

   let safetyModel = module?.safety?.model ?? '';
   let safetyHeight = module?.safety?.height ?? 0;
   let safetyWeight = module?.safety?.weight ?? 0;

   let shoeModel = module?.shoe?.model ?? '';
   let shoeHeight = module?.shoe?.height ?? 0;
   let shoeWeight = module?.shoe?.weight ?? 0;

   let ropeSize = module?.rope?.size ?? 0.375;
   let ropeQty = module?.rope?.qty ?? 4;
   let ropePitch = module?.rope?.pitch ?? 0;
   let ropePitchOverride = module?.rope?.pitchOverride ?? false;

   let sheaveModel = '';
   let sheaveLocation = 'Overslung';
   let sheaveArrangement = 'Parallel';
   let sheaveQty = carRoping === 1 ? 0 : 1;
   let sheaveChannels = undefined;
   let topChannelEndToSheave = 0;

   let plywoodQty = module?.plywood?.qty ?? 0;
   let plywoodThickness = module?.plywood?.thickness ?? 0.25;

   let finFloorArea = module?.finFloor?.area ?? 'Inside Cab';
   let finFloorWeight = module?.finFloor?.weight ?? 0;
   let finFloorWeightOverride = module?.finFloor?.weightOverride ?? false;
   let finFloorMaterialWeight = module?.finFloor?.materialWeight ?? 0;
   let finFloorThickness = module?.finFloor?.thickness ?? 0.25;

   // - Inherited Variables
   let platformDepth = inherit(modules, 'platform.platformDepth', 'value') ?? 0;
   let platformIsolation = inherit(modules, 'platform.platformIsolation', 'value') ?? false;
   let platformIsolationWeight = inherit(modules, 'platform.platformIsolationWeight', 'value') ?? false;
   let platformThickness = inherit(modules, 'platform.platformThickness', 'value') ?? 0;
   let platformWeight = inherit(modules, 'platform.platformWeight', 'value') ?? 0;
   let platformWidth = inherit(modules, 'platform.platformWidth', 'value') ?? 0;

   let cornerPost = inherit(modules, 'platform.cornerPost', 'value');

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
   let slingModels = undefined;
   let shoes = undefined;
   let shoePlates = undefined;
   let safeties = undefined;
   let sheaves = undefined;
   let topChannels = undefined;
   let bottomChannels = undefined;

   // - Updated By Rules
   let turningMoment = 0;
   let braceQtyCalc = 4;

   // Reactive Variables

   $: model = getFromArray(slingModel, slingModels);

   // - Parts
   $: shoe = getFromArray(shoeModel, shoes);
   $: safety = getFromArray(safetyModel, safeties);
   $: sheave = getFromArray(sheaveModel, sheaves);
   $: topShoePlate = getShoePlate(shoePlates, shoeModel, slingModel, carRailSize);
   $: bottomShoePlate = getShoePlate(shoePlates, shoeModel, safetyModel, carRailSize);
   $: strikePlate = model?.strikePlate;
   $: gusset = topChannel?.slingGusset;

   $: plywoodWeight = round(platformWidth * platformDepth * plywoodThickness * plywoodQty * 0.02083, 2); // 1" plywood weight = 3 lbs per square foot

   // - Stiles
   $: stileChannel = getFromArray(slingStile, model?.stiles);
   $: stileSectionModulusY = round((turningMoment * underBeamHeight) / (4 * slingDimH * 14000), 2);
   $: stileMomentOfInertiaY = round((turningMoment * underBeamHeight ** 3) / (18 * modulusOfElasticity * slingDimH), 2);
   $: stileLength =
      (topChannel?.depth ?? 0) +
      underBeamHeight +
      finFloorThickness +
      plywoodThickness * plywoodQty +
      platformThickness +
      (platformIsolation ? 2 : 0) +
      (bottomChannel?.depth ?? 0);
   $: stileWeight = (stileChannel?.weight ?? 0) * stileLength * 2;

   // - Top Channel
   $: topChannel = getFromArray(slingTopChannel, topChannels);
   $: topChannelLength = stilesBackToBack + (stileChannel?.flangeWidth ?? 0) * 2;
   $: topChannelLoadPoints = sheaveQty === 2 && sheaveChannels === false && sheaveLocation === 'Overslung' ? 2 : 1;
   $: topChannelSectionModulus =
      topChannelLoadPoints === 1 ? round((0.5 * overallWeight * topChannelLength) / (4 * 14000), 2) : round((0.5 * ((overallWeight / 2) * topChannelEndToSheave)) / 14000);
   $: topChannelWeight = (topChannel?.weight ?? 0) * topChannelLength * 2;

   // - Bottom Channel
   $: bottomChannel = getFromArray(slingBottomChannel, bottomChannels);
   $: bottomChannelLength = stilesBackToBack + (stileChannel?.flangeWidth ?? 0) * 2;
   $: bottomChannelWeight = (bottomChannel?.weight ?? 0) * bottomChannelLength * 2;

   // - Braces
   $: braceLength = ceil(Math.sqrt((platformDepth / 2 - 10 - (stileChannel?.depth ?? 0) / 2) ** 2 + (underBeamHeight - 39.5) ** 2));
   $: braceWeight = ((stileChannel?.weight ?? 0) >= 1.9 ? 0.5 : 0.375) * 2 * braceLength * braceQty;
   $: cornerPostBraceMember = getFromArray(cornerPostSteel, tables.cornerPostBraceSteel);
   $: cornerPostBraceLength = roundInc(Math.sqrt(platformWidth ** 2 * platformDepth ** 2));
   $: braceAssemblyWeight = (cornerPost ? cornerPostBraceLength * cornerPostBraceMember.weight : 0) + braceWeight;

   // - Overall
   $: slingDimH = roundInc(shoeHeight * 2 + (railLock ? 2.5 : 0) + topShoePlate.thickness + stileLength + safetyHeight + bottomShoePlate.thickness);

   $: slingWeight = round(
      topChannelWeight +
         stileWeight +
         bottomChannelWeight +
         braceAssemblyWeight +
         (gusset?.weight ?? 0) * 4 +
         (strikePlate?.weight ?? 0) * strikePlateQty +
         (carRoping === 1 ? 28 : 0)
   );

   $: carWeight =
      slingWeight +
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
      doorOperatorWeight +
      finFloorWeight +
      plywoodWeight +
      platformIsolationWeight;

   $: overallWeight = carWeight + capacity;

   // - Overrideable
   $: ropePitchCalc = ropeSize + 0.25;
   $: finFloorWeightCalc = getFinFloorWeight(finFloorArea, finFloorMaterialWeight);
   $: stilesBackToBackCalc = carDBG - 3;

   // - Select Options
   $: slingModelOptions = getModelOptions(slingModels, stileSectionModulusY, stileMomentOfInertiaY, compensation, slingTopChannel, slingBottomChannel);
   $: stileOptions = getStileOptions(model?.stiles, stileSectionModulusY, stileMomentOfInertiaY);
   $: topChannelOptions = getChannelOptions(topChannels, topChannelSectionModulus);
   $: bottomChannelOptions = getChannelOptions(bottomChannels, topChannelSectionModulus); // FIXME: 5-10-2021 12:49 PM - update section modulus

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

   $: if (freight) {
      switch (freight) {
         case 'B-Auto':
         case 'B-Truck':
            if ((capacity * cabWidth) / 8 > capacity * (cabWidth / 2 - 48)) {
               turningMoment = (capacity * cabWidth) / 8;
            } else {
               turningMoment = capacity * (cabWidth / 2 - 48);
            }
            break;

         case 'C1':
         case 'C2':
         case 'C3':
            turningMoment = (capacity * cabWidth) / 4;
            break;

         default:
            // 'None' 'A'
            turningMoment = (capacity * cabWidth) / 8;
            break;
      }
   }

   $: if (cornerPost) {
      braceQtyCalc = 2;
   } else if (platformDepth < 121) {
      braceQtyCalc = 4;
   } else if (platformDepth < 228) {
      braceQtyCalc = 8;
   } else {
      braceQtyCalc = 12;
   }

   $: if (slingModel === '6TS-TD-LD') {
      slingTopChannel = 'C10X25';
      slingBottomChannel = 'C10X25';
   }

   $: if (slingModel === '8TS-TD-LD-OH') {
      slingTopChannel = 'MC8X21.4';
      slingBottomChannel = 'MC8X21.4';
   }

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
      <Select bind:value={slingModel} label="Model">
         {#each slingModelOptions as { disabled, text } (text)}
            <Option {disabled} {text} />
         {/each}
      </Select>
   </div>

   <div class="input-bump">
      <Select bind:value={carRailSize} label="Rail Size">
         {#each options.railSize as { text }}
            <Option {text} />
         {/each}
      </Select>
   </div>

   <div class="input-bump">
      <InputLength bind:value={carDBG} label="D.B.G." {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={stilesBackToBack} bind:override={stilesBackToBackOverride} bind:calc={stilesBackToBackCalc} label="Back to Back of Stiles" reset {metric} />
   </div>

   <div class="input-bump">
      <InputLength bind:value={underBeamHeight} label="Under Beam Height" {metric} />
   </div>

   <div class="input-bump">
      <Select bind:value={compensation} label="Compensation">
         {#each options.compensation as { text }}
            <Option {text} />
         {/each}
      </Select>
   </div>

   {#if ['12#', '15#'].includes(carRailSize)}
      <div class="input-bump" transition:fade>
         <Checkbox bind:checked={railLock} label="Rail Locks" />
      </div>
   {/if}

   <div class="input-bump link">
      <InputWeight value={slingWeight} display label="Weight" {metric} />
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
         <Input bind:value={sheaveQty} label="Quantity" type="number" />
      </div>
      <div class="input-bump">
         <Select bind:value={sheaveModel} label="Model">
            {#each sheaveOptions as { value, text, valid }}
               <Option {value} {text} disabled={!valid} selected={sheaveModel === value} />
            {/each}
         </Select>
      </div>
      {#if sheaveQty > 1}
         <div class="input-bump" transition:fade>
            <Select bind:value={sheaveLocation} label="Mounting">
               {#each options.sheaveLocation as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>
         <div class="input-bump" transition:fade>
            <Select bind:value={sheaveArrangement} label="Arrangement">
               {#each options.sheaveArrangement as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>
      {/if}
   </fieldset>
{/if}

<fieldset>
   <legend>Steel</legend>
   <hr />
   <div class="input-bump">
      <Select bind:value={slingTopChannel} label="Top Channels">
         {#if topChannelOptions.stocked.length > 0}
            <OptGroup label="Stocked">
               {#each topChannelOptions.stocked as { disabled, text }}
                  <Option {disabled} {text} selected={slingTopChannel === text} />
               {/each}
            </OptGroup>
         {/if}
         {#if topChannelOptions.available.length > 0}
            <OptGroup label="Available">
               {#each topChannelOptions.available as { disabled, text }}
                  <Option {disabled} {text} selected={slingTopChannel === text} />
               {/each}
            </OptGroup>
         {/if}
         {#if topChannelOptions.check.length > 0}
            <OptGroup label="Check">
               {#each topChannelOptions.check as { disabled, text }}
                  <Option {disabled} {text} selected={slingTopChannel === text} />
               {/each}
            </OptGroup>
         {/if}
      </Select>
   </div>
   <div class="input-bump">
      <Select bind:value={slingStile} label="Stiles">
         {#if stileOptions.stocked.length > 0}
            <OptGroup label="Stocked">
               {#each stileOptions.stocked as { disabled, text }}
                  <Option {disabled} {text} selected={slingStile === text} />
               {/each}
            </OptGroup>
         {/if}
         {#if stileOptions.available.length > 0}
            <OptGroup label="Available">
               {#each stileOptions.available as { disabled, text }}
                  <Option {disabled} {text} selected={slingStile === text} />
               {/each}
            </OptGroup>
         {/if}
         {#if stileOptions.check.length > 0}
            <OptGroup label="Check">
               {#each stileOptions.check as { disabled, text }}
                  <Option {disabled} {text} selected={slingStile === text} />
               {/each}
            </OptGroup>
         {/if}
      </Select>
   </div>
   <div class="input-bump">
      <Select bind:value={slingBottomChannel} label="Bottom Channels">
         {#if bottomChannelOptions.stocked.length > 0}
            <OptGroup label="Stocked">
               {#each bottomChannelOptions.stocked as { disabled, text }}
                  <Option {disabled} {text} selected={slingBottomChannel === text} />
               {/each}
            </OptGroup>
         {/if}
         {#if bottomChannelOptions.available.length > 0}
            <OptGroup label="Available">
               {#each bottomChannelOptions.available as { disabled, text }}
                  <Option {disabled} {text} selected={slingBottomChannel === text} />
               {/each}
            </OptGroup>
         {/if}
         {#if bottomChannelOptions.check.length > 0}
            <OptGroup label="Check">
               {#each bottomChannelOptions.check as { disabled, text }}
                  <Option {disabled} {text} selected={slingBottomChannel === text} />
               {/each}
            </OptGroup>
         {/if}
      </Select>
   </div>
   {#if !cornerPost}
      <div class="input-bump">
         <Input bind:value={braceQty} bind:override={braceQtyOverride} bind:calc={braceQtyCalc} label="Brace Quantity" type="number" reset {metric} />
      </div>
   {:else}
      <Select bind:value={cornerPostSteel} label="Brace Steel">
         {#each tables.cornerPostBraceSteel as { name }}
            <Option text={name} />
         {/each}
      </Select>
   {/if}
</fieldset>

<fieldset>
   <legend>Equipment</legend>
   <hr />
   <div class="input-bump">
      <InputWeight bind:value={carTopWeight} label="Car Top Weight" {metric} />
   </div>
   <div class="input-bump">
      <InputWeight bind:value={doorOperatorWeight} label="Door Operator Weight" {metric} />
   </div>
   <div class="input-bump">
      <InputWeight bind:value={miscEquipmentWeight} label="Misc. Equipment Weight" {metric} />
   </div>

   <div class="input-bump">
      <Select bind:value={shoeModel} label="Shoe Model">
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
         <InputLength bind:value={shoeHeight} label="Shoe Height" {metric} />
      </div>
   {/if}

   <div class="input-bump">
      <Select bind:value={safetyModel} label="Safety Model">
         {#each safetyOptions as { text, valid }}
            <Option {text} disabled={!valid} selected={safetyModel === text} />
         {/each}
      </Select>
   </div>
   {#if safetyModel === 'Other'}
      <div class="input-bump" transition:fade>
         <InputWeight bind:value={safetyWeight} label="Safety Weight" step={0.01} {metric} />
      </div>
      <div class="input-bump" transition:fade>
         <InputLength bind:value={safetyHeight} label="Safety Height" {metric} />
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
      <InputLength bind:value={platformThickness} display={platformThicknessLink} label="Thickness" {metric} />
      {#if platformThicknessLink}
         <IconButton on:click={() => dispatch('changeModule', platformThicknessLink)}>
            <Link />
         </IconButton>
      {/if}
   </div>

   <div class="input-bump link">
      <InputWeight bind:value={platformWeight} display={platformWeightLink} label="Weight" step={0.01} {metric} />
      {#if platformWeightLink}
         <IconButton on:click={() => dispatch('changeModule', platformWeightLink)}>
            <Link />
         </IconButton>
      {/if}
   </div>
</fieldset>
