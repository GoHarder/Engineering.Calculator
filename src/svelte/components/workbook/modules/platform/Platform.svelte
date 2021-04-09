<script>
   import { onDestroy, onMount } from 'svelte';
   import { fade } from 'svelte/transition';
   import { floor, round } from '../../../material/lib/round';
   import * as tables from './tables';
   import * as options from './options';

   // Components
   import { Input, InputArea, InputLength, InputWeight } from '../../../material/input';
   import { OptGroup, Option, Select } from '../../../material/select';
   import { Checkbox } from '../../../material/checkbox';
   import SteelPlatform from './sections/SteelPlatform.svelte';
   import WoodPlatform from './sections/WoodPlatform.svelte';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // TODO: 4-08-2021 10:40 AM - Save data to Iowa
   // Methods
   const onSave = () => {
      // console.log('Saving...');
      // const saveData = {
      //    properties: platform,
      //    cab,
      //    doors: {
      //       qty: doorQty,
      //       door1,
      //    },
      // };
      // saveData.properties.material = platformMaterial;
      // saveData.doors.door1.weight = door1Weight;
      // saveData.cab.weight = cabWeight;
      // if (doorQty === 2) {
      //    saveData.doors.door2 = door2;
      //    saveData.doors.door2.weight = door2Weight;
      // }
      // workbook.modules.platform = { ...workbook.modules.platform, ...saveData };
      // saveProject();
   };

   // const getWoodData = async (sectionModulus) => {
   //    const res = await fetch(`api/engineering/platform?material=Wood&sectionModulus=${sectionModulus}`, {
   //       headers: { 'Content-Type': 'application/json' },
   //    }).catch((error) => {
   //       console.log(error);
   //       return { ok: false };
   //    });

   //    if (res.ok) {
   //       const body = await res.json();
   //       const { angle } = body;

   //       platformThickness = angle.depth;

   //       const plywoodWidth = platformWidth - angle.thickness * 2;
   //       const plywoodDepth = platformDepth - angle.thickness * 2;
   //       const plywoodQty = angle.depth - 1;
   //       const plywoodWeight = round(plywoodQty * plywoodWidth * plywoodDepth * (2.046875 / 144)); // 3/4" Weight = 2.046875 lb/ft²
   //       const stringerQty = floor(plywoodDepth / 10.875);
   //       const stringerWeight = round(stringerQty * plywoodWidth * (2.7 / 12)); // 2 X 8 Weight = 2.7 lb/ft
   //       const angleWeight = round(plywoodWidth * angle.weight * 2 + platformDepth * angle.weight * 2);
   //       const fireProofWeight = round(plywoodWidth * plywoodDepth * (3.125 / 144)); // 14GA Weight = 3.125 lb/ft²

   //       platformWeight = plywoodWeight + stringerWeight + angleWeight + fireProofWeight;
   //    }
   // };

   // const getSteelData = async (stringerSectionModulus, stringerMomentOfIntertia, frontChannelSectionModulus, frontChannelMomentOfIntertia) => {
   //    let steel = {
   //       material: platformSteel,
   //       stringer: { sectionModulus: stringerSectionModulus, momentOfInertia: stringerMomentOfIntertia },
   //       frontChannel: { sectionModulus: frontChannelSectionModulus, momentOfInertia: frontChannelMomentOfIntertia },
   //    };

   //    const res = await fetch(`api/engineering/platform?material=Steel&steel=${JSON.stringify(steel)}`, {
   //       headers: { 'Content-Type': 'application/json' },
   //    }).catch((error) => {
   //       console.log(error);
   //       return { ok: false };
   //    });

   //    if (res.ok) {
   //       const body = await res.json();

   //       stringerOptions = body.stringer;
   //       sideChannelOptions = body.sideChannel;
   //       frontChannelOptions = body.frontChannel;

   //       platformStringer = module?.platform?.stringer ?? body.stringer[0];
   //       platformFrontChannel = module?.platform?.frontChannel ?? body.frontChannel[0];
   //    }
   // };

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

   // Constants
   const { metric } = workbook;
   const { capacity, loading } = workbook.modules.globals;
   const { type: loadingType, freight } = loading;
   const { platform: module } = workbook.modules;

   // Variables
   let angle = undefined;
   let channel = undefined;

   // - Platform
   let platformDepth = module?.platform?.depth ?? 0;
   let platformIsolation = module?.platform?.isolation ?? false;
   let platformFrontToRail = module?.platform?.frontToRail ?? 0;
   let platformMaterial = module?.platform?.material ?? 'Wood';
   let platformThickness = module?.platform?.thickness ?? 0;
   let platformWeight = module?.platform?.weight ?? 0;
   let platformWidth = module?.platform?.width ?? 0;

   // -- Saved Platform Steel
   let platformSteel = module?.platform?.steel ?? 'ASTM A36';
   let platformFloorPlate = module?.platform?.floorPlate ?? undefined;
   let platformFrontChannel = module?.platform?.frontChannel ?? undefined;
   let platformHasSillChannel = module?.platform?.hasSillChannel ?? false;
   let platformSplit = module?.platform?.split ?? false;
   let platformStringer = module?.platform?.stringer ?? { name: 'Loading...', stockStatus: 'Stocked' };
   let platformStringerQty = module?.platform?.stringerQty ?? 0;

   // -- Calculated Platform Steel
   let load = steelLoad(freight);
   let disableSplit = false;
   // let backChannel = undefined;
   // let sideChannel = undefined;

   // -- Steel Controlls
   let frontChannelValue = 'Loading...';
   let floorPlateValue = '1/4" Smooth';

   let stringerOptions = [{ name: 'Loading...', stockStatus: 'Stocked' }];
   let sideChannelOptions = undefined;
   let frontChannelOptions = [{ name: 'Loading...', stockStatus: 'Stocked' }];

   // - Cab
   let cabDepth = module?.cab?.depth ?? 0;
   let cabHeight = module?.cab?.height ?? 96;
   let cabWidth = module?.cab?.width ?? 0;

   // - Doors
   let doorQty = module?.doors?.qty ?? 1;

   // - Door 1
   let door1Height = module?.doors?.door1?.height ?? 0;
   let door1Type = module?.doors?.door1?.type ?? 'Single Speed';
   let door1Width = module?.doors?.door1?.width ?? 0;

   // -- Door 2
   let door2Height = module?.doors?.door2?.height ?? 0;
   let door2Location = module?.doors?.door2?.location ?? 'Back';
   let door2Type = module?.doors?.door2?.type ?? 'Single Speed';
   let door2Width = module?.doors?.door2?.width ?? 0;

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
   $: cabWeight = cabWeightCalc;

   // - Door Weight with override
   $: door1WeightCalc = door1Width * (86 / 12);
   $: door1Weight = door1WeightCalc;

   $: door2WeightCalc = door2Width * (86 / 12);
   $: door2Weight = door2WeightCalc;

   // - Code Calculations
   $: maxPlatformArea = tables.maxPlatform.reverse().find((row) => row.capacity <= capacity).area;
   $: maxPlatformAreaPlus = maxPlatformArea * 1.05;
   $: minFreightCapacity = round(tables.capacityRating.find((row) => row.class === freight).rating * cabArea);

   // - Error Checking
   $: invalidMaxPlatformArea = cabArea > maxPlatformAreaPlus;
   $: invalidMinFreightCapacity = minFreightCapacity > capacity;

   // - Controlls
   $: disableIsolation = ['None', 'A'].includes(freight) === false || platformSplit;

   $: stringerStockOptions = stringerOptions.filter((option) => option.stockStatus === 'Stocked');
   $: stringerAvailableOptions = stringerOptions.filter((option) => option.stockStatus === 'Available');
   $: stringerCheckOptions = stringerOptions.filter((option) => option.stockStatus === 'Check');

   // - Wood
   $: woodPlatformAngle = angle?.find((row) => {
      const sectionModulus = (platformWidth * capacity) / 300000;
      return row.properties.modulusX >= sectionModulus;
   });

   $: woodPlatformThickness = woodPlatformAngle?.dimensions.depth ?? 0;
   $: plywoodWidth = platformWidth - (woodPlatformAngle?.dimensions.thickness ?? 0) * 2;
   $: plywoodDepth = platformDepth - (woodPlatformAngle?.dimensions.thickness ?? 0) * 2;
   $: plywoodQty = woodPlatformAngle?.dimensions.depth - 1;
   $: plywoodWeight = round(plywoodQty * plywoodWidth * plywoodDepth * (2.046875 / 144)); // 3/4" Weight = 2.046875 lb/ft²
   $: woodStringerQty = floor(plywoodDepth / 10.875);
   $: stringerWeight = round(woodStringerQty * plywoodWidth * (2.7 / 12)); // 2 X 8 Weight = 2.7 lb/ft
   $: angleWeight = round(plywoodWidth * (woodPlatformAngle?.properties.weight ?? 0) * 2 + platformDepth * (woodPlatformAngle?.properties.weight ?? 0) * 2);
   $: fireProofWeight = round(plywoodWidth * plywoodDepth * (3.125 / 144)); // 14GA Weight = 3.125 lb/ft²
   $: woodPlatformWeight = plywoodWeight + stringerWeight + angleWeight + fireProofWeight;

   // - Steel
   $: platformBackToRail = round(platformDepth - platformFrontToRail, 4);
   $: elasticModulus = options.steelType.find((type) => type.text === platformSteel).elasticModulus;

   // -- Stringers
   $: isolatedStringerSectionModulus = round((load * platformDepth) / 112000, 2);
   $: unIsolatedStringerSectionModulus = round((Math.max(platformFrontToRail, platformBackToRail) * 13 * load) / (64 * 14000), 2);
   $: stringerSectionModulus = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerSectionModulus : unIsolatedStringerSectionModulus;
   $: isolatedStringerMomentOfInertia = round((960 * load * platformDepth ** 2) / (192 * elasticModulus), 2);
   $: unIsolatedStringerMomentOfInertia = round((load * Math.max(platformFrontToRail, platformBackToRail) ** 3) / (66 * elasticModulus * (platformDepth / 960)), 2);
   $: stringerMomentOfIntertia = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerMomentOfInertia : unIsolatedStringerMomentOfInertia;

   // -- Sill Channel
   $: platformSillChannel = platformHasSillChannel && platformStringer ? platformStringer : undefined;

   // Reactive Rules
   $: if (save) {
      onSave();
   }

   // - API Calls
   // $: if (platformMaterial === 'Wood' && platformWidth && capacity) getWoodData((platformWidth * capacity) / 300000);

   // $: if (platformMaterial === 'Steel' && platformWidth && platformDepth && platformFrontToRail) {
   //    getSteelData(stringerSectionModulus, stringerMomentOfIntertia, 0, 0);
   // }

   $: if (platformMaterial === 'Wood') {
      platformThickness = woodPlatformThickness;
      platformWeight = woodPlatformWeight;
   } else {
      platformThickness = 0;
      platformWeight = 0;
   }

   // - Steel Platform
   $: if (platformWidth > 92 && platformDepth > 92) {
      platformSplit = true;
      disableSplit = true;
   } else {
      disableSplit = false;
   }

   onMount(async () => {
      // TODO: 4-09-2021 1:19 PM - Add error handling
      const res = await fetch(`api/engineering/platform?material=${platformSteel}`, {
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => {
         console.log(error);
         return { ok: false };
      });

      if (res.ok) {
         const body = await res.json();
         // console.log(body);
         angle = body.angle;
         channel = body.channel;
      }
   });

   // Lifecycle
   onDestroy(() => {
      onSave();
   });
</script>

<fieldset class="globals">
   <legend>Globals</legend>
   <div class="input-bump">
      <InputWeight value={capacity} display label="Capacity" {metric} />
   </div>
   <div class="input-bump">
      <Input value={`${loadingType} - ${freight}`} display label="Loading" />
   </div>
</fieldset>

<fieldset class="properties">
   <legend>Properties</legend>

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
      <InputWeight bind:value={platformWeight} display label="Weight" {metric} />
   </div>

   <div class="input-bump">
      <Checkbox bind:value={platformIsolation} disabled={disableIsolation} label="Isolation" />
   </div>
</fieldset>

<!-- NOTE: Steel Section -->
{#if platformMaterial === 'Steel'}
   <fieldset transition:fade>
      <legend>Steel</legend>

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

      <Select bind:value={platformStringer} label="Stringer">
         <OptGroup label="Stocked">
            {#each stringerStockOptions as channel}
               <Option text={channel.name} value={channel} />
            {/each}
         </OptGroup>
         <OptGroup label="Available">
            {#each stringerAvailableOptions as channel}
               <Option text={channel.name} value={channel} />
            {/each}
         </OptGroup>
         <OptGroup label="Check">
            {#each stringerCheckOptions as channel}
               <Option text={channel.name} value={channel} />
            {/each}
         </OptGroup>
      </Select>

      <!-- <Input bind:value={platformStringerQty} calc={stringerQtyCalc} label="Stringer Quantity" reset type="number" /> -->

      <!-- <Input bind:value={sideChannelValue} display label="Side Channel" /> -->
      {#if platformHasSillChannel}
         <!-- <Input bind:value={sillChannel.text} display label="Sill Channel" /> -->
      {/if}

      <!-- <Select bind:value={frontChannelValue} label="Front Channel">
      <OptGroup label="Stocked">
         {#each frontChannelStockOptions as { text }}
            <Option {text} />
         {/each}
      </OptGroup>
      <OptGroup label="Available">
         {#each frontChannelAvailableOptions as { text }}
            <Option {text} />
         {/each}
      </OptGroup>
      <OptGroup label="Check">
         {#each frontChannelCheckOptions as { text }}
            <Option {text} />
         {/each}
      </OptGroup>
   </Select> -->

      <!-- <Input bind:value={backChannelValue} display label="Back Channel" /> -->

      <!-- <Select bind:value={floorPlateValue} label="Floor Plate">
      {#each steelPlateOptions as { name }}
         <Option text={name} />
      {/each}
   </Select> -->
   </fieldset>
{/if}

<fieldset class="cab">
   <legend>Cab Information</legend>
   <InputLength bind:value={cabHeight} label="Height" {metric} />
   <InputLength bind:value={cabWidth} label="Interior Width" {metric} />
   <InputLength bind:value={cabDepth} label="Interior Depth" {metric} />
   <InputArea value={cabArea} display label="Interior Area" {metric} />
   <InputWeight bind:value={cabWeight} calc={cabWeightCalc} label="Weight" reset {metric} />

   <Select bind:value={doorQty} label="Door Quantity" {metric}>
      {#each options.doorQty as { text }}
         <Option {text} />
      {/each}
   </Select>

   <fieldset>
      <legend>Front Door</legend>
      <Select bind:value={door1Type} label="Door Type" {metric}>
         {#each options.doorType as { text }}
            <Option {text} />
         {/each}
      </Select>
      <InputLength bind:value={door1Width} label="Width" {metric} />
      <InputLength bind:value={door1Height} label="Height" {metric} />
      <InputWeight bind:value={door1Weight} calc={door1WeightCalc} label="Weight" reset {metric} />
   </fieldset>

   {#if doorQty === 2}
      <fieldset transition:fade>
         <legend>{`${door2Location} Door`}</legend>
         <Select bind:value={door2Location} label="Location" {metric}>
            {#each options.doorLocation as { text }}
               <Option {text} />
            {/each}
         </Select>
         <Select bind:value={door2Type} label="Door Type" {metric}>
            {#each options.doorType as { text }}
               <Option {text} />
            {/each}
         </Select>
         <InputLength bind:value={door2Width} label="Width" {metric} />
         <InputLength bind:value={door2Height} label="Height" {metric} />
         <InputWeight bind:value={door2Weight} calc={door2WeightCalc} label="Weight" reset {metric} />
      </fieldset>
   {/if}
</fieldset>

<fieldset class="code-requirements">
   <legend>Code Requirements</legend>

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

<style>
   /* .container {
      display: flex;
      flex-wrap: wrap;
   }

   .globals {
      flex-basis: calc(calc(600px - 100%) * 10000);
      flex-grow: 1;
      max-width: 500px;
      min-width: 300px;
   }

   .dimensions {
      flex-basis: calc(calc(600px - 100%) * 10000);
      flex-grow: 1;
      max-width: 500px;
      min-width: 300px;
   } */
</style>
