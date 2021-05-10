<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { fade } from 'svelte/transition';
   import { ceil, floor, round } from '../round';
   import * as tables from './tables';
   import * as options from './options';

   // Components
   import { Input, InputArea, InputLength, InputWeight } from '../../../material/input';
   import { OptGroup, Option, Select } from '../../../material/select';
   import { Checkbox } from '../../../material/checkbox';
   import { IconButton } from '../../../material/button';
   import { Link } from '../../../material/button/icons';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Methods
   const onSave = () => {
      // console.log('Saving...');

      const saveData = {
         properties: {
            depth: platformDepth,
            isolation: platformIsolation,
            isolationWeight: platformIsolationWeight,
            frontToRail: platformFrontToRail,
            material: platformMaterial,
            thickness: platformThickness,
            weight: platformWeight,
            width: platformWidth,
         },
         cab: {
            depth: cabDepth,
            height: cabHeight,
            width: cabWidth,
            weight: cabWeight,
            weightOverride: cabWeightOverride,
         },
         doors: {
            qty: doorQty,
            door1: {
               height: door1Height,
               type: door1Type,
               width: door1Width,
               weight: door1Weight,
               weightOverride: door1WeightOverride,
            },
            toeGuard1: {
               weight: toeGuard1Weight,
               override: toeGuard1WeightOverride,
            },
         },
      };

      const steel = {
         steel: platformSteel,
         floorPlate: platformFloorPlate,
         frontChannel: platformFrontChannel,
         hasSillChannel: platformHasSillChannel,
         split: platformSplit,
         stringer: platformStringer,
         stringerQty: platformStringerQty,
         stringerQtyOverride: platformStringerQtyOverride,
      };

      const door2 = {
         height: door2Height,
         location: door2Location,
         type: door2Type,
         width: door2Width,
         weight: door2Weight,
         weightOverride: door2WeightOverride,
      };

      const toeGuard2 = {
         weight: toeGuard2Weight,
         override: toeGuard2WeightOverride,
      };

      if (saveData.properties.material === 'Steel') saveData.properties = { ...saveData.properties, ...steel };
      if (saveData.doors.qty === 2) saveData.doors.door2 = door2;
      if (saveData.doors.qty === 2) saveData.doors.toeGuard2 = toeGuard2;

      workbook.modules.platform = { ...workbook.modules.platform, ...saveData };
      saveProject();
   };

   const getSteel = async (steelType) => {
      // TODO: 4-09-2021 1:19 PM - Add error handling
      const res = await fetch(`api/engineering/platform?material=${steelType}`, {
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => {
         console.log(error);
         return { ok: false };
      });

      if (res.ok) {
         const body = await res.json();
         // console.log(body);
         angle = [...body.angle];
         channel = [...body.channel];
      }
   };

   const toFraction = (num) => {
      const tens = 10 ** (num.toString().length - 2);

      const gcd = (a, b) => {
         if (!b) return a;
         return gcd(b, a % b);
      };

      let top = tens * num;

      const split = gcd(top, tens);

      return `${top / split}/${tens / split}`;
   };

   const plateCalcs = (material, thickness, stringerSpacing) => {
      return {
         name: `${toFraction(thickness)}" ${material}`,
         thickness,
         varZu: round((thickness ** 2 * stringerSpacing) / 6, 2),
         varXx: round((thickness ** 3 * stringerSpacing) / 12, 6),
      };
   };

   const steelLoad = (freightClass) => {
      switch (freightClass) {
         case 'B-Auto':
         case 'B-Truck':
         case 'C1':
         case 'C3':
            return capacity * 0.5;

         case 'C2':
            return capacity * 0.5 * 1.6;

         default:
            // 'None' or 'A'
            return capacity * 0.3;
      }
   };

   const getChannel = (name) => channel.find((row) => row.name === name);

   const getToeGuardWeight = (doorWidth) => {
      const toeGuardWidth = doorWidth - 4;
      const toeGuardQty = toeGuardWidth > 78 ? 2 : 1;
      const width = toeGuardWidth / toeGuardQty;
      const braceQty = width <= 56 ? 3 : 4;
      const braceWeight = 19.12 * braceQty * toeGuardQty;
      const mountingweight = 4.41 * braceQty * toeGuardQty;
      const sheetWeight = 0.1617 * toeGuardWidth;

      return round(braceWeight + mountingweight + sheetWeight, 2);
   };

   // Constants
   const dispatch = createEventDispatcher();

   const { metric } = workbook;
   const { capacity, loading } = workbook.modules.globals;
   const { type: loadingType, freight } = loading;
   const { platform: module } = workbook.modules;

   // Variables
   let angle = undefined;
   let channel = undefined;

   // - Platform
   let platformDepth = module?.properties?.depth ?? 0;
   let platformIsolation = module?.properties?.isolation ?? false;
   let platformIsolationWeight = module?.properties?.isolationWeight ?? 0;
   let platformFrontToRail = module?.properties?.frontToRail ?? 0;
   let platformMaterial = module?.properties?.material ?? 'Wood';
   let platformThickness = module?.properties?.thickness ?? 0;
   let platformWeight = module?.properties?.weight ?? 0;
   let platformWidth = module?.properties?.width ?? 0;

   // -- Saved Platform Steel
   let platformSteel = module?.properties?.steel ?? 'ASTM A36';
   let platformFloorPlate = module?.properties?.floorPlate ?? undefined;
   let platformFrontChannel = module?.properties?.frontChannel ?? undefined;
   let platformHasSillChannel = module?.properties?.hasSillChannel ?? false;
   let platformSplit = module?.properties?.split ?? false;
   let platformStringer = module?.properties?.stringer ?? undefined;
   let platformStringerQty = module?.properties?.stringerQty ?? 0;
   let platformStringerQtyOverride = module?.properties?.stringerQtyOverride ?? false;

   // -- Calculated Platform Steel
   let load = steelLoad(freight);
   let disableSplit = false;
   let stringerChannel = undefined;
   let frontChannel = undefined;
   let floorPlate = undefined;
   let stringerOptions = [];
   let frontChannelOptions = [];

   // - Cab
   let cabDepth = module?.cab?.depth ?? 0;
   let cabHeight = module?.cab?.height ?? 96;
   let cabWidth = module?.cab?.width ?? 0;
   let cabWeight = module?.cab?.weight ?? 0;
   let cabWeightOverride = module?.cab?.weightOverride ?? false;

   // - Doors
   let doorQty = module?.doors?.qty ?? 1;

   // -- Door 1
   let door1Height = module?.doors?.door1?.height ?? 84;
   let door1Type = module?.doors?.door1?.type ?? 'Single Speed';
   let door1Width = module?.doors?.door1?.width ?? 54;
   let door1Weight = module?.doors?.door1?.weight ?? 0;
   let door1WeightOverride = module?.doors?.door1?.weightOverride ?? false;
   let toeGuard1Weight = 0;
   let toeGuard1WeightOverride = false;

   // -- Door 2
   let door2Height = module?.doors?.door2?.height ?? 84;
   let door2Location = module?.doors?.door2?.location ?? 'Back';
   let door2Type = module?.doors?.door2?.type ?? 'Single Speed';
   let door2Width = module?.doors?.door2?.width ?? 54;
   let door2Weight = module?.doors?.door2?.weight ?? 0;
   let door2WeightOverride = module?.doors?.door2?.weightOverride ?? false;
   let toeGuard2Weight = 0;
   let toeGuard2WeightOverride = false;

   // Reactive Variables

   // - Area
   $: platformArea = platformWidth * platformDepth;
   $: cabArea = cabWidth * cabDepth;

   // - Cab Estimated Weight
   $: cabCeilingWeight = cabArea * (4.64 / 144);
   $: cabWallArea = (cabDepth + cabWidth) * 2 * cabHeight;
   $: doorArea = door1Width * door1Height + (doorQty === 2 ? door2Width * door2Height : 0);
   $: cabWallWeight = (cabWallArea - doorArea) * ((capacity <= 3500 ? 7.21 : 8.9) / 144);
   $: handRailWeight = cabWidth + cabDepth * 2 * (2.5 / 144);
   $: coveLightWeight = cabWidth + cabDepth * 2 * (5 / 144);

   // -- Cab Weight with override
   $: cabWeightCalc = round(cabWallWeight + cabCeilingWeight + handRailWeight + coveLightWeight);

   // - Door Weight with override
   $: door1WeightCalc = round(door1Width * (86 / 12));
   $: door2WeightCalc = round(door2Width * (86 / 12));

   // - Toe Guard weight
   $: toeGuard1WeightCalc = getToeGuardWeight(door1Width);
   $: toeGuard2WeightCalc = getToeGuardWeight(door2Width);

   // Isolation Weight
   $: platformIsolationWeight = platformIsolation ? round((platformDepth - 3) * 0.55 + platformWidth * 0.34167, 2) : 0;

   // - Code Calculations
   $: maxPlatformArea = tables.maxPlatform(capacity);
   $: maxPlatformAreaPlus = maxPlatformArea * 1.05;
   $: minFreightCapacity = round(tables.capacityRating.find((row) => row.class === freight).rating * cabArea);

   // - Error Checking
   $: invalidMaxPlatformArea = cabArea > maxPlatformAreaPlus;
   $: invalidStringer = (stringerChannel?.stockStatus ?? 'Stocked') !== 'Stocked';
   $: invalidFrontChannel = (frontChannel?.stockStatus ?? 'Stocked') !== 'Stocked';

   $: invalidMinFreightCapacity = minFreightCapacity > capacity;

   // - Wood Calculations
   $: woodPlatformAngle = angle?.find((row) => {
      const sectionModulus = (platformWidth * capacity) / 300000;
      return row.modulusX >= sectionModulus;
   });

   $: woodPlatformThickness = woodPlatformAngle?.depth ?? 0;
   $: plywoodWidth = platformWidth - (woodPlatformAngle?.thickness ?? 0) * 2;
   $: plywoodDepth = platformDepth - (woodPlatformAngle?.thickness ?? 0) * 2;
   $: plywoodQty = woodPlatformAngle?.depth - 1;
   $: plywoodWeight = round(plywoodQty * plywoodWidth * plywoodDepth * (2.046875 / 144)); // 3/4" Weight = 2.046875 lb/ft²
   $: woodStringerQty = floor(plywoodDepth / 10.875);
   $: stringerWeight = round(woodStringerQty * plywoodWidth * (2.7 / 12)); // 2 X 8 Weight = 2.7 lb/ft
   $: angleWeight = round(plywoodWidth * (woodPlatformAngle?.weight ?? 0) * 2 + platformDepth * (woodPlatformAngle?.weight ?? 0) * 2);
   $: fireProofWeight = round(plywoodWidth * plywoodDepth * (3.125 / 144)); // 14GA Weight = 3.125 lb/ft²
   $: woodPlatformWeight = plywoodWeight + stringerWeight + angleWeight + fireProofWeight;

   // - Steel Calculations
   // NOTE: 4-29-2021 10:07 AM - ASME Table 2.15.10.1 load tables

   $: platformBackToRail = round(platformDepth - platformFrontToRail, 4);
   $: elasticModulus = options.steelType.find((type) => type.text === platformSteel).elasticModulus;
   $: tensileStrength = options.steelType.find((type) => type.text === platformSteel).tensileStrength;
   $: tensileStrengthRatio = round(tensileStrength / 58, 3);

   // -- Stringers
   $: isolatedStringerSectionModulus = round((load * platformDepth) / (8 * 17000 * tensileStrengthRatio), 2);
   $: unIsolatedStringerSectionModulus = round((Math.max(platformFrontToRail, platformBackToRail) * 13 * load) / (64 * 17000 * tensileStrengthRatio), 2);
   $: stringerSectionModulus = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerSectionModulus : unIsolatedStringerSectionModulus;
   $: isolatedStringerMomentOfInertia = round((960 * load * platformDepth ** 2) / (192 * elasticModulus), 2);
   $: unIsolatedStringerMomentOfInertia = round((load * Math.max(platformFrontToRail, platformBackToRail) ** 3) / (66 * elasticModulus * (platformDepth / 960)), 2);
   $: stringerMomentOfInertia = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerMomentOfInertia : unIsolatedStringerMomentOfInertia;

   // --- Stringer Quantity and Override
   $: stringerQtyCalc =
      ceil((platformWidth / (platformSplit ? 2 : 1) - (sideChannel?.flangeWidth ?? 0) * 2) / ((stringerChannel?.flangeWidth ?? 0) + 14)) * (platformSplit ? 2 : 1);

   // --- Length And Weight
   $: stringerLength =
      platformDepth -
      ((sillChannel?.flangeWidth ?? 0) * doorQty +
         (platformHasSillChannel ? 3.375 : frontChannel?.flangeWidth ?? 0) +
         (platformHasSillChannel && doorQty === 2 ? 3.375 : backChannel?.flangeWidth ?? 0));

   $: stringerWeight = round(stringerLength * (stringerChannel?.weight ?? 0) * platformStringerQty, 2);

   // -- Side Channel
   $: sideChannelOptions = channel?.filter((row) => ['MC4X13.8', 'MC6X12', 'MC8X18.7'].includes(row.name)) ?? [];
   $: sideChannel = platformIsolation ? sideChannelOptions.find((channel) => channel.depth >= stringerChannel.depth) : stringerChannel;
   $: platformSideChannel = sideChannel?.name ?? ' ';

   // --- Length And Weight
   $: sideChannelLength = platformDepth - (frontChannel?.flangeWidth ?? 0) + (backChannel?.flangeWidth ?? 0);
   $: sideChannelWeight = sideChannelLength * (platformSplit ? 4 : 2) * (sideChannel?.weight ?? 0);

   // -- Sill Channel
   $: sillChannel = platformHasSillChannel && stringerChannel ? stringerChannel : undefined;
   $: platformSillChannel = sillChannel?.name ?? ' ';

   // --- Length And Weight
   $: sillChannelLength = platformWidth - (sideChannel?.flangeWidth ?? 0) * 2;
   $: sillChannelWeight = sillChannelLength * (sillChannel?.weight ?? 0);

   // -- Front Channel
   $: frontChannelSectionModulus = tables.frontChannelFormulas.find((row) => row.category.includes(freight)).sectionModulus(load, platformWidth, tensileStrengthRatio);
   $: frontChannelMomentOfInertia = tables.frontChannelFormulas.find((row) => row.category.includes(freight)).momentOfInertia(load, platformWidth, elasticModulus);

   // --- Length And Weight
   $: frontChannelWeight = platformWidth * (frontChannel?.weight ?? 0);

   // -- Back Channel
   $: backChannel = platformSplit || doorQty === 2 ? frontChannel : sideChannel;
   $: platformBackChannel = backChannel?.name ?? ' ';

   // --- Length And Weight
   $: backChannelWeight = platformWidth * (backChannel?.weight ?? 0);

   // -- Floor Plate
   $: floorPlateSpace = round(
      (platformWidth - ((sideChannel?.flangeWidth ?? 0) * (platformSplit ? 4 : 2) + (stringerChannel?.flangeWidth ?? 0) * platformStringerQty)) / (platformStringerQty + 1),
      4
   );

   // Splice Plate
   $: splicePlateWeight = platformSplit ? 48 * (frontChannel?.depth - 3) * 2.55 * 2 : 0;

   // --- Length And Weight
   $: floorPlateLength = platformDepth - (platformHasSillChannel ? 3.5 * doorQty : 0);
   $: floorPlateWeight = (floorPlate?.thickness ?? 0) * platformWidth * floorPlateLength * 0.283;

   // -- Steel Totals
   $: steelPlatformThickness = (sideChannel?.depth ?? 0) + (floorPlate?.thickness ?? 0);
   $: steelPlatformWeight = round(
      (frontChannelWeight + backChannelWeight + sideChannelWeight + floorPlateWeight + splicePlateWeight + sillChannelWeight + stringerWeight) * 1.03,
      1
   ); // 3% hardware

   // - Controls
   $: disableIsolation = ['None', 'A'].includes(freight) === false || platformSplit;

   // - Steel
   $: stringerStockOptions = stringerOptions.filter((option) => option.stockStatus === 'Stocked');
   $: stringerAvailableOptions = stringerOptions.filter((option) => option.stockStatus === 'Available');
   $: stringerCheckOptions = stringerOptions.filter((option) => option.stockStatus === 'Check');

   $: frontChannelStockOptions = frontChannelOptions.filter((option) => option.stockStatus === 'Stocked');
   $: frontChannelAvailableOptions = frontChannelOptions.filter((option) => option.stockStatus === 'Available');
   $: frontChannelCheckOptions = frontChannelOptions.filter((option) => option.stockStatus === 'Check');

   $: floorPlateOptions = tables.steelPlate
      .map((row) => plateCalcs(row.type, row.thickness, floorPlateSpace))
      .map((row) => {
         const stressCheck = 14000 * tensileStrengthRatio > ((load / 2) * floorPlateSpace) / (8 * row.varZu);
         const deflectionCheck = round(platformDepth / 1666, 3) > round(((load / 2) * floorPlateSpace ** 3) / (192 * row.varXx * elasticModulus), 3);

         row.disabled = !(stressCheck && deflectionCheck);

         return row;
      });

   // Reactive Rules
   $: if (save) onSave();

   $: if (platformMaterial === 'Wood') {
      setTimeout(() => {
         platformThickness = woodPlatformThickness;
         platformWeight = woodPlatformWeight;
      }, 1000);
   } else {
      setTimeout(() => {
         platformThickness = steelPlatformThickness;
         platformWeight = steelPlatformWeight;
      }, 1000);
   }

   // - Steel Platform
   $: if (platformStringer && channel) stringerChannel = getChannel(platformStringer);
   $: if (platformFrontChannel && channel) frontChannel = getChannel(platformFrontChannel);
   $: if (platformFloorPlate) floorPlate = floorPlateOptions.find((row) => row.name === platformFloorPlate);

   $: if (stringerSectionModulus && stringerMomentOfInertia && channel) {
      const container = [];

      channel.forEach((row) => {
         container.push({
            name: row.name,
            stockStatus: row.stockStatus,
            selected: row.name === platformStringer,
            disabled: (row.modulusX >= stringerSectionModulus && row.inertiaX >= stringerMomentOfInertia) === false,
         });
      });

      stringerOptions = container;
   }

   $: if (frontChannelSectionModulus && frontChannelMomentOfInertia && channel) {
      const container = [];

      channel.forEach((row) => {
         container.push({
            name: row.name,
            stockStatus: row.stockStatus,
            selected: row.name === platformFrontChannel,
            disabled: (row.modulusX >= frontChannelSectionModulus && row.inertiaX >= frontChannelMomentOfInertia) === false,
         });
      });

      frontChannelOptions = container;
   }

   $: if (platformWidth > 92 && platformDepth > 92) {
      platformSplit = true;
      disableSplit = true;
   } else {
      disableSplit = false;
   }

   onMount(async () => {
      getSteel(platformSteel);
   });

   // Lifecycle
   onDestroy(() => {
      onSave();
   });
</script>

<div class="container">
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
         <Input value={`${loadingType}${freight !== 'None' ? ` ${freight}` : ''}`} display label="Loading" />
         <IconButton on:click={() => dispatch('changePage', 'Requirements')}>
            <Link />
         </IconButton>
      </div>
   </fieldset>
</div>

<div class="container">
   <fieldset>
      <legend>Properties</legend>
      <hr />
      <div class="input-bump">
         <Select bind:value={platformMaterial} label="Material">
            {#each options.platformMaterial as { text }}
               <Option {text} />
            {/each}
         </Select>
      </div>
      <div class="input-bump">
         <InputLength bind:value={platformWidth} label="Width" {metric} />
      </div>
      <div class="input-bump">
         <InputLength bind:value={platformDepth} label="Depth" {metric} />
      </div>
      <div class="input-bump">
         <InputLength bind:value={platformFrontToRail} label="Front of Platform to Rail" {metric} />
      </div>
      <div class="input-bump">
         <InputLength bind:value={platformThickness} display label="Thickness" {metric} />
      </div>
      <div class="input-bump">
         <InputArea value={platformArea} display label="Area" {metric} />
      </div>
      <div class="input-bump">
         <InputWeight value={platformWeight} display label="Weight" {metric} />
      </div>
      <div class="input-bump">
         <Checkbox bind:value={platformIsolation} disabled={disableIsolation} label="Isolation" />
      </div>
   </fieldset>

   <!-- NOTE: Steel Section -->
   {#if platformMaterial === 'Steel'}
      <fieldset transition:fade>
         <legend>Steel</legend>
         <hr />
         <div class="input-bump">
            <Select bind:value={platformSteel} label="Type">
               {#each options.steelType as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>
         <div class="input-bump">
            <Checkbox bind:checked={platformSplit} disabled={disableSplit} label="Split" />
            <Checkbox bind:checked={platformHasSillChannel} label="Sill Channel" />
         </div>

         <Select bind:value={platformStringer} disableValidation helperText="Channel isn't stocked check with purchasing" invalid={invalidStringer} label="Stringer">
            {#if stringerStockOptions.length > 0}
               <OptGroup label="Stocked">
                  {#each stringerStockOptions as { disabled, selected, name }}
                     <Option {disabled} {selected} text={name} />
                  {/each}
               </OptGroup>
            {/if}
            {#if stringerAvailableOptions.length > 0}
               <OptGroup label="Available">
                  {#each stringerAvailableOptions as { disabled, selected, name }}
                     <Option {disabled} {selected} text={name} />
                  {/each}
               </OptGroup>
            {/if}
            {#if stringerCheckOptions.length > 0}
               <OptGroup label="Check">
                  {#each stringerCheckOptions as { disabled, selected, name }}
                     <Option {disabled} {selected} text={name} />
                  {/each}
               </OptGroup>
            {/if}
         </Select>

         <div class="input-bump">
            <Input bind:value={platformStringerQty} bind:override={platformStringerQtyOverride} calc={stringerQtyCalc} label="Stringer Quantity" reset type="number" />
         </div>
         <div class="input-bump">
            <Input bind:value={platformSideChannel} display label="Side Channel" />
         </div>
         {#if platformHasSillChannel}
            <div class="input-bump" transition:fade>
               <Input bind:value={platformSillChannel} display label="Sill Channel" />
            </div>
         {/if}
         <Select
            bind:value={platformFrontChannel}
            disableValidation
            helperText="Channel isn't stocked check with purchasing"
            invalid={invalidFrontChannel}
            label="Front Channel"
         >
            {#if frontChannelStockOptions.length > 0}
               <OptGroup label="Stocked">
                  {#each frontChannelStockOptions as { disabled, selected, name }}
                     <Option {disabled} {selected} text={name} />
                  {/each}
               </OptGroup>
            {/if}
            {#if frontChannelAvailableOptions.length > 0}
               <OptGroup label="Available">
                  {#each frontChannelAvailableOptions as { disabled, selected, name }}
                     <Option {disabled} {selected} text={name} />
                  {/each}
               </OptGroup>
            {/if}
            {#if frontChannelCheckOptions.length > 0}
               <OptGroup label="Check">
                  {#each frontChannelCheckOptions as { disabled, selected, name }}
                     <Option {disabled} {selected} text={name} />
                  {/each}
               </OptGroup>
            {/if}
         </Select>
         <div class="input-bump">
            <Input bind:value={platformBackChannel} display label="Back Channel" />
         </div>
         <div class="input-bump">
            <Select bind:value={platformFloorPlate} label="Floor Plate">
               {#each floorPlateOptions as plate}
                  <Option disabled={plate.disabled} text={plate.name} />
               {/each}
            </Select>
         </div>
      </fieldset>
   {/if}
</div>

<div class="container">
   <fieldset>
      <legend>Cab</legend>
      <hr />
      <div class="input-bump">
         <InputLength bind:value={cabHeight} label="Height" {metric} />
      </div>
      <div class="input-bump">
         <InputLength bind:value={cabWidth} label="Interior Width" {metric} />
      </div>
      <div class="input-bump">
         <InputLength bind:value={cabDepth} label="Interior Depth" {metric} />
      </div>
      <div class="input-bump">
         <InputArea value={cabArea} display label="Interior Area" {metric} />
      </div>
      <div class="input-bump">
         <InputWeight bind:value={cabWeight} bind:override={cabWeightOverride} bind:calc={cabWeightCalc} label="Weight" reset {metric} />
      </div>
      <div class="input-bump">
         <Select bind:value={doorQty} label="Door Quantity" {metric}>
            {#each options.doorQty as { text }}
               <Option {text} />
            {/each}
         </Select>
      </div>
   </fieldset>

   <fieldset>
      <legend>Front Door</legend>
      <hr />
      <div class="input-bump">
         <Select bind:value={door1Type} label="Door Type" {metric}>
            {#each options.doorType as { text }}
               <Option {text} />
            {/each}
         </Select>
      </div>
      <div class="input-bump">
         <InputLength bind:value={door1Width} label="Width" {metric} />
      </div>
      <div class="input-bump">
         <InputLength bind:value={door1Height} label="Height" {metric} />
      </div>
      <div class="input-bump">
         <InputWeight bind:value={door1Weight} bind:override={door1WeightOverride} calc={door1WeightCalc} label="Weight" reset {metric} />
      </div>
      <div class="input-bump">
         <InputWeight bind:value={toeGuard1Weight} bind:override={toeGuard1WeightOverride} calc={toeGuard1WeightCalc} label="Toe Guard Weight" reset step={0.01} {metric} />
      </div>
   </fieldset>

   {#if doorQty === 2}
      <fieldset transition:fade>
         <legend>{`${door2Location} Door`}</legend>
         <hr />
         <div class="input-bump">
            <Select bind:value={door2Location} label="Location" {metric}>
               {#each options.doorLocation as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>
         <div class="input-bump">
            <Select bind:value={door2Type} label="Door Type" {metric}>
               {#each options.doorType as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>
         <div class="input-bump">
            <InputLength bind:value={door2Width} label="Width" {metric} />
         </div>
         <div class="input-bump">
            <InputLength bind:value={door2Height} label="Height" {metric} />
         </div>
         <div class="input-bump">
            <InputWeight bind:value={door2Weight} bind:override={door2WeightOverride} calc={door2WeightCalc} label="Weight" reset {metric} />
         </div>
         <div class="input-bump">
            <InputWeight bind:value={toeGuard2Weight} bind:override={toeGuard2WeightOverride} calc={toeGuard2WeightCalc} label="Toe Guard Weight" reset step={0.01} {metric} />
         </div>
      </fieldset>
   {/if}
</div>

<div class="container">
   <fieldset>
      <legend>Code Requirements</legend>
      <hr />
      {#if loadingType === 'Passenger'}
         <div class="input-bump">
            <InputArea value={maxPlatformArea} display label="Max Inside Platform Area" {metric} />
         </div>

         <InputArea
            value={maxPlatformAreaPlus}
            disableValidation
            display
            helperText={`Interior area exceeds max area + 5%`}
            invalid={invalidMaxPlatformArea}
            label="Max Inside Platform Area + 5%"
            {metric}
         />
      {/if}

      {#if freight !== 'None'}
         <InputWeight
            value={minFreightCapacity}
            disableValidation
            display
            helperText="Capacity is below minimum freight capacity"
            invalid={invalidMinFreightCapacity}
            label="Min. Freight Capacity"
            {metric}
         />
      {/if}
   </fieldset>
</div>

<style lang="scss">
   @import './src/scss/vantage-theme';
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
   }

   fieldset {
      flex-basis: calc(calc(600px - 100%) * 10000);
      flex-grow: 1;
      max-width: 500px;
      min-width: 400px;
   }
</style>
