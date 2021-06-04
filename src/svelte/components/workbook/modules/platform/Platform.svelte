<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { slide } from 'svelte/transition';
   import { floor, round, toFractionString } from '../js/math';
   import * as tables from './tables';
   // import * as options from './options';

   // Components
   import { Fieldset, SteelOptions } from '../../common';
   import { Input, InputArea, InputLength, InputWeight } from '../../../material/input';
   import { Option, Select } from '../../../material/select';
   import { Checkbox } from '../../../material/checkbox';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Methods
   const onSave = () => {
      const saveData = {
         apta,
         properties: {
            depth: platformDepth,
            isolation: platformIsolation,
            isolationWeight: platformIsolationWeight,
            frontToRail: platformFrontToRail,
            material: platformMaterial,
            thickness: platformThickness,
            weight: platformWeight,
            width: platformWidth,
            cornerPost,
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

   const plateCalcs = (material, thickness, stringerSpacing) => {
      return {
         name: `${toFractionString(thickness)}" ${material}`,
         thickness,
         varZu: round((thickness ** 2 * stringerSpacing) / 6, 2),
         varXx: round((thickness ** 3 * stringerSpacing) / 12, 6),
      };
   };

   const getChannel = (name) => channel.find((row) => row.name === name);

   const invalidChannel = (channel) => (channel?.stockStatus ?? 'Stocked') !== 'Stocked';

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
   let apta = module?.apta ?? false;
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
   let load = 0;
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
   let toeGuard1Weight = module?.doors?.toeGuard1?.weight ?? 0;
   let toeGuard1WeightOverride = module?.doors?.toeGuard1?.override ?? false;

   // -- Door 2
   let door2Height = module?.doors?.door2?.height ?? 84;
   let door2Location = module?.doors?.door2?.location ?? 'Back';
   let door2Type = module?.doors?.door2?.type ?? 'Single Speed';
   let door2Width = module?.doors?.door2?.width ?? 54;
   let door2Weight = module?.doors?.door2?.weight ?? 0;
   let door2WeightOverride = module?.doors?.door2?.weightOverride ?? false;
   let toeGuard2Weight = module?.doors?.toeGuard2?.weight ?? 0;
   let toeGuard2WeightOverride = module?.doors?.toeGuard2?.override ?? false;

   // Reactive Variables
   $: cornerPost = doorQty === 2 && door2Location !== 'Back';

   // - Area
   $: platformArea = platformWidth * platformDepth;
   $: cabArea = cabWidth * cabDepth;

   // - Cab Estimated Weight
   $: cabCeilingWeight = cabArea * (4.64 / 144);
   $: cabWallArea = (cabDepth + cabWidth) * 2 * cabHeight;
   $: doorArea = door1Width * door1Height + (doorQty === 2 ? door2Width * door2Height : 0);
   $: cabWallWeight = (cabWallArea - doorArea) * ((designCapacity <= 3500 ? 7.21 : 8.9) / 144);
   $: handRailWeight = cabWidth + cabDepth * 2 * (2.5 / 144);
   $: coveLightWeight = cabWidth + cabDepth * 2 * (5 / 144);

   // -- Cab Weight with override
   $: cabWeightCalc = round(cabWallWeight + cabCeilingWeight + handRailWeight + coveLightWeight);

   // - Door Weight with override
   $: door1WeightCalc = round(door1Width * 7.167);
   $: door2WeightCalc = round(door2Width * 7.167);

   // - Toe Guard weight
   $: toeGuard1WeightCalc = getToeGuardWeight(door1Width);
   $: toeGuard2WeightCalc = getToeGuardWeight(door2Width);

   // Isolation Weight
   $: platformIsolationWeight = platformIsolation ? round((platformDepth - 3) * 0.55 + platformWidth * 0.34167, 2) : 0;

   // - Code Calculations
   $: maxPlatformArea = tables.maxPlatform(designCapacity);
   $: maxPlatformAreaPlus = maxPlatformArea * 1.05;
   $: minFreightCapacity = round(tables.capacityRating.find((row) => row.class === freight).rating * cabArea);
   $: designCapacity = capacity * (apta ? 1.5 : 1);

   // - Wood Calculations
   $: woodPlatformAngle = angle?.find((row) => {
      const sectionModulus = (platformWidth * designCapacity) / 300000;
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
   $: woodPlatformWeight = round(plywoodWeight + stringerWeight + angleWeight + fireProofWeight, 1);

   // - Steel Calculations
   // NOTE: 4-29-2021 10:07 AM - ASME Table 2.15.10.1 load tables
   // stringers have been updated

   $: platformBackToRail = round(platformDepth - platformFrontToRail, 4);
   $: elasticModulus = tables.steelType.find((type) => type.name === platformSteel).elasticModulus;
   $: tensileStrength = tables.steelType.find((type) => type.name === platformSteel).tensileStrength;
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
      floor((platformWidth / (platformSplit ? 2 : 1) - (sideChannel?.flangeWidth ?? 0) * 2) / ((stringerChannel?.flangeWidth ?? 0) + 14)) * (platformSplit ? 2 : 1);

   // --- Length And Weight
   $: stringerLength =
      platformDepth -
      ((sillChannel?.flangeWidth ?? 0) * doorQty +
         (platformHasSillChannel ? 3.375 : frontChannel?.flangeWidth ?? 0) +
         (platformHasSillChannel && doorQty === 2 ? 3.375 : backChannel?.flangeWidth ?? 0));

   $: stringerWeight = round(stringerLength * (stringerChannel?.weight ?? 0) * platformStringerQty, 2);

   // -- Side Channel
   $: sideChannelOptions = channel?.filter((row) => ['MC4X13.8', 'MC6X12', 'MC8X18.7'].includes(row.name)) ?? [];
   $: sideChannel = platformIsolation ? sideChannelOptions.find((channel) => channel.depth >= stringerChannel?.depth ?? 0) : stringerChannel;
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

   $: switch (freight) {
      case 'B-Auto':
      case 'B-Truck':
      case 'C1':
      case 'C3':
         load = designCapacity * 0.5;

      case 'C2':
         load = designCapacity * 0.5 * 1.6;

      default:
         load = designCapacity * 0.3;
   }

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
            text: row.name,
            disabled: (row.modulusX >= stringerSectionModulus && row.inertiaX >= stringerMomentOfInertia) === false,
            stockStatus: row.stockStatus,
         });
      });

      stringerOptions = container;
   }

   $: if (frontChannelSectionModulus && frontChannelMomentOfInertia && channel) {
      const container = [];

      channel.forEach((row) => {
         container.push({
            text: row.name,
            disabled: (row.modulusX >= frontChannelSectionModulus && row.inertiaX >= frontChannelMomentOfInertia) === false,
            stockStatus: row.stockStatus,
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

   // Events
   const onLink = (event) => dispatch(event.detail.cmd, event.detail.location);

   // Lifecycle
   onMount(() => getSteel(platformSteel));

   onDestroy(() => onSave());
</script>

<div class="container">
   <Fieldset title="Globals">
      <InputWeight value={capacity} on:link={onLink} label="Capacity" link={{ cmd: 'changePage', location: 'Requirements' }} {metric} />

      <Input value={`${loadingType}${freight !== 'None' ? ` ${freight}` : ''}`} on:link={onLink} label="Loading" link={{ cmd: 'changePage', location: 'Requirements' }} />
   </Fieldset>
</div>

<div class="container">
   <Fieldset title="Properties">
      <Select bind:value={platformMaterial} label="Material">
         {#each tables.platformMaterial as { name } (name)}
            <Option text={name} />
         {/each}
      </Select>

      <InputLength bind:value={platformWidth} label="Width" {metric} />

      <InputLength bind:value={platformDepth} label="Depth" {metric} />

      <InputLength bind:value={platformFrontToRail} label="Front of Platform to Rail" {metric} />

      <InputLength bind:value={platformThickness} display label="Thickness" {metric} />

      <div class="input-bump">
         <InputArea value={platformArea} display label="Area" {metric} />
      </div>

      <InputWeight value={platformWeight} display label="Weight" {metric} />

      <Checkbox bind:checked={platformIsolation} disabled={disableIsolation} label="Isolation" />

      <Checkbox bind:checked={apta} label="APTA" />
   </Fieldset>

   {#if platformMaterial === 'Steel'}
      <Fieldset title="Steel">
         <Select bind:value={platformSteel} label="Type">
            {#each tables.steelType as { name } (name)}
               <Option text={name} />
            {/each}
         </Select>

         <Checkbox bind:checked={platformSplit} disabled={disableSplit} label="Split" />

         <Checkbox bind:checked={platformHasSillChannel} label="Sill Channel" />

         <Select
            bind:value={platformStringer}
            disableValidation
            helperText="Channel isn't stocked check with purchasing"
            invalid={invalidChannel(stringerChannel)}
            label="Stringer"
         >
            <SteelOptions options={stringerOptions} selected={platformStringer} />
         </Select>

         <Input bind:value={platformStringerQty} bind:override={platformStringerQtyOverride} calc={stringerQtyCalc} label="Stringer Quantity" reset type="number" />

         <Input bind:value={platformSideChannel} display label="Side Channel" />

         {#if platformHasSillChannel}
            <div transition:slide|local>
               <Input bind:value={platformSillChannel} display label="Sill Channel" />
            </div>
         {/if}

         <Select
            bind:value={platformFrontChannel}
            disableValidation
            helperText="Channel isn't stocked check with purchasing"
            invalid={invalidChannel(frontChannel)}
            label="Front Channel"
         >
            <SteelOptions options={frontChannelOptions} selected={platformFrontChannel} />
         </Select>

         <Input bind:value={platformBackChannel} display label="Back Channel" />

         <Select bind:value={platformFloorPlate} label="Floor Plate">
            {#each floorPlateOptions as plate}
               <Option disabled={plate.disabled} text={plate.name} />
            {/each}
         </Select>
      </Fieldset>
   {/if}
</div>

<div class="container">
   <Fieldset title="Cab">
      <InputLength bind:value={cabHeight} label="Height" {metric} />

      <InputLength bind:value={cabWidth} label="Interior Width" {metric} />

      <InputLength bind:value={cabDepth} label="Interior Depth" {metric} />

      <div class="input-bump">
         <InputArea value={cabArea} display label="Interior Area" {metric} />
      </div>

      <InputWeight bind:value={cabWeight} bind:override={cabWeightOverride} bind:calc={cabWeightCalc} label="Weight" reset {metric} />

      <Select bind:value={doorQty} label="Door Quantity" {metric}>
         {#each tables.doorQty as { name } (name)}
            <Option text={name} />
         {/each}
      </Select>
   </Fieldset>

   <Fieldset title="Front Door">
      <Select bind:value={door1Type} label="Door Type" {metric}>
         {#each tables.doorType as { name } (name)}
            <Option text={name} />
         {/each}
      </Select>

      <InputLength bind:value={door1Width} label="Width" {metric} />

      <InputLength bind:value={door1Height} label="Height" {metric} />

      <InputWeight bind:value={door1Weight} bind:override={door1WeightOverride} calc={door1WeightCalc} label="Weight" reset {metric} />

      <InputWeight bind:value={toeGuard1Weight} bind:override={toeGuard1WeightOverride} calc={toeGuard1WeightCalc} label="Toe Guard Weight" reset step={0.01} {metric} />
   </Fieldset>

   {#if doorQty === 2}
      <Fieldset title={`${door2Location} Door`}>
         <Select bind:value={door2Location} label="Location" {metric}>
            {#each tables.doorLocation as { name } (name)}
               <Option text={name} />
            {/each}
         </Select>

         <Select bind:value={door2Type} label="Door Type" {metric}>
            {#each tables.doorType as { name } (name)}
               <Option text={name} />
            {/each}
         </Select>

         <InputLength bind:value={door2Width} label="Width" {metric} />

         <InputLength bind:value={door2Height} label="Height" {metric} />

         <InputWeight bind:value={door2Weight} bind:override={door2WeightOverride} calc={door2WeightCalc} label="Weight" reset {metric} />

         <InputWeight bind:value={toeGuard2Weight} bind:override={toeGuard2WeightOverride} calc={toeGuard2WeightCalc} label="Toe Guard Weight" reset step={0.01} {metric} />
      </Fieldset>
   {/if}
</div>

<div class="container">
   <Fieldset title="Code Requirements">
      {#if loadingType === 'Passenger'}
         <div class="input-bump">
            <InputArea value={maxPlatformArea} display label="Max Inside Platform Area" {metric} />
         </div>

         <InputArea
            value={maxPlatformAreaPlus}
            disableValidation
            display
            helperText={`Interior area exceeds max area + 5%`}
            invalid={cabArea > maxPlatformAreaPlus}
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
            invalid={minFreightCapacity > designCapacity}
            label="Min. Freight Capacity"
            {metric}
         />
      {/if}
   </Fieldset>
</div>

<style lang="scss">
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
   }
</style>
