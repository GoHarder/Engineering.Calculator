<!-- TODO: 4-12-2021 11:01 AM - File is depricated -->
<script>
   import * as options from '../options';
   import * as tables from '../tables';

   // Components
   import { Input } from '../../../../material/input';
   import { OptGroup, Option, Select } from '../../../../material/select';
   import { Checkbox } from '../../../../material/checkbox';
   import { floor, round } from '../../round';

   // Properties
   // - Bound
   export let platformFloorPlate = undefined;
   export let platformFrontChannel = undefined;
   export let platformHasSillChannel = false;
   export let platformSplit = false;
   export let platformSteel = 'ASTM A36';
   export let platformStringer = undefined;
   export let platformStringerQty = 0;
   export let platformThickness = 0;
   export let platformWeight = 0;

   // - Read Only
   export let doorQty = 1;
   export let platformDepth = 0;
   export let platformIsolation = false;
   export let platformFrontToRail = 0;
   export let platformWidth = 0;
   export let workbook = {};

   // Methods
   // const getdb = async (stringerSectionModulus, stringerMomentOfIntertia, frontChannelSectionModulus, frontChannelMomentOfIntertia) => {
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
   //       db = await res.json();
   //       // console.log(db);

   //       stringerOptions = db.stringer;
   //       sideChannelOptions = db.sideChannel;
   //       frontChannelOptions = db.frontChannel;

   //       stringerValue = stringerOptions[0].text;
   //       frontChannelValue = frontChannelOptions[0].text;
   //    }
   // };

   // const toFraction = (num) => {
   //    const tens = 10 ** (num.toString().length - 2);

   //    const gcd = (a, b) => {
   //       if (!b) return a;
   //       return gcd(b, a % b);
   //    };

   //    let top = tens * num;

   //    const split = gcd(top, tens);

   //    return `${top / split}/${tens / split}`;
   // };

   // const plateCalcs = (material, thickness, stringerSpacing) => {
   //    return {
   //       name: `${toFraction(thickness)}" ${material}`,
   //       thickness,
   //       varZu: round((thickness ** 2 * stringerSpacing) / 6, 2),
   //       varXx: round((thickness ** 3 * stringerSpacing) / 12, 6),
   //    };
   // };

   // Constants
   const { capacity, loading } = workbook.modules.globals;
   const { freight } = loading;

   // Variables
   let load = 0;
   // let disableSplit = false;
   let db = undefined;
   // let sillChannel = undefined;
   let backChannel = undefined;
   // let sideChannel = undefined;

   // - Steel Options
   // let stringerValue = 'Loading...';
   // let frontChannelValue = 'Loading...';
   // let floorPlateValue = '1/4" Smooth';

   // let stringerOptions = [{ text: 'Loading...', stockStatus: 'Stocked' }];
   // let sideChannelOptions = undefined;
   // let frontChannelOptions = [{ text: 'Loading...', stockStatus: 'Stocked' }];

   // Reactive Variables
   // $: platformBackToRail = round(platformDepth - platformFrontToRail, 4);
   // $: elasticModulus = options.steelType.find((type) => type.text === platformSteel).elasticModulus;

   // - Option Groups
   $: stringerStockOptions = stringerOptions.filter((option) => option.stockStatus === 'Stocked');
   $: stringerAvailableOptions = stringerOptions.filter((option) => option.stockStatus === 'Available');
   $: stringerCheckOptions = stringerOptions.filter((option) => option.stockStatus === 'Check');
   $: frontChannelStockOptions = frontChannelOptions.filter((option) => option.stockStatus === 'Stocked');
   $: frontChannelAvailableOptions = frontChannelOptions.filter((option) => option.stockStatus === 'Available');
   $: frontChannelCheckOptions = frontChannelOptions.filter((option) => option.stockStatus === 'Check');

   // - Stringers
   // $: isolatedStringerSectionModulus = round((load * platformDepth) / 112000, 2);
   // $: unIsolatedStringerSectionModulus = round((Math.max(platformFrontToRail, platformBackToRail) * 13 * load) / (64 * 14000), 2);
   // $: stringerSectionModulus = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerSectionModulus : unIsolatedStringerSectionModulus;
   // $: isolatedStringerMomentOfInertia = round((960 * load * platformDepth ** 2) / (192 * elasticModulus), 1);
   // $: unIsolatedStringerMomentOfInertia = round((load * Math.max(platformFrontToRail, platformBackToRail) ** 3) / (66 * elasticModulus * (platformDepth / 960)), 1);
   // $: stringerMomentOfIntertia = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerMomentOfInertia : unIsolatedStringerMomentOfInertia;

   // $: stringerQtyCalc =
   //    floor((platformWidth / (platformSplit ? 2 : 1) - (sideChannel?.dimensions.flangeWidth ?? 0) * 2) / ((platformStringer?.dimensions.flangeWidth ?? 0) + 14)) *
   //    (platformSplit ? 2 : 1);
   // $: platformStringerQty = stringerQtyCalc;

   // - Side Channel
   // $: sideChannelValue = sideChannel?.text ?? 'Loading...';

   // - Front Channel
   // $: frontChannelSectionModulus = tables.frontChannelFormulas.find((row) => row.category.includes(freight)).sectionModulus(load, platformWidth);
   // $: frontChannelMomentOfInertia = tables.frontChannelFormulas.find((row) => row.category.includes(freight)).momentOfInertia(load, platformWidth, elasticModulus);

   // - Back Channel
   $: backChannelValue = backChannel?.text ?? 'Loading...';

   // - Plate
   $: steelPlateOptions = tables.steelPlate
      .map((row) => plateCalcs(row.type, row.thickness, 12))
      .filter((row) => {
         const sideChannels = (sideChannel?.dimensions.flangeWidth ?? 0) * (platformSplit ? 4 : 2);
         const stringers = (platformStringer?.dimensions.flangeWidth ?? 0) * stringerQty;
         const space = round((platformWidth - (sideChannels + stringers)) / (stringerQty + 1), 4);

         const stressCheck = 14000 > ((load / 2) * space) / (8 * row.varZu);
         const deflectionCheck = round(platformDepth / 1666, 3) > round(((load / 2) * space ** 3) / (192 * row.varXx * elasticModulus), 3);

         return stressCheck && deflectionCheck;
      });

   // - Weight Calcs
   $: frontChannelWeight = platformWidth * (platformFrontChannel?.properties.weight ?? 0);
   $: backChannelWeight = platformWidth * (backChannel?.properties.weight ?? 0);

   $: floorPlateWeight = (platformFloorPlate?.thickness ?? 0) * platformWidth * (platformDepth - (platformHasSillChannel ? 3.5 * doorQty : 0)) * 0.283;

   $: sideChannelLength = platformDepth - (platformFrontChannel?.properties.flangeWidth ?? 0) + (backChannel?.dimensions.flangeWidth ?? 0);
   $: sideChannelWeight = sideChannelLength * (platformSplit ? 4 : 2) * (sideChannel?.properties.weight ?? 0);

   $: sillChannelWeight = (platformWidth - (sideChannel?.dimensions.flangeWidth ?? 0) * 2) * (platformSteel?.sillChannel?.properties.weight ?? 0);

   $: stringerLength =
      platformDepth -
      ((sillChannel?.dimensions.flangeWidth ?? 0) * doorQty +
         (platformHasSillChannel ? 3.375 : platformFrontChannel?.dimensions.flangeWidth ?? 0) +
         (platformHasSillChannel && doorQty === 2 ? 3.375 : backChannel?.dimensions.flangeWidth ?? 0));

   $: stringerWeight = stringerLength * (platformStringer?.properties.weight ?? 0) * stringerQty;

   $: splicePlateWeight = platformSplit ? 48 * (platformFrontChannel?.dimensions.depth - 3) * 2.55 * 2 : 0;

   $: platformWeight = round(
      (frontChannelWeight + backChannelWeight + sideChannelWeight + floorPlateWeight + splicePlateWeight + sillChannelWeight + stringerWeight) * 1.03,
      1
   ); // 3% hardware

   // Reactive Rules
   $: getdb(stringerSectionModulus, stringerMomentOfIntertia, frontChannelSectionModulus, frontChannelMomentOfInertia);

   // - Channel Load
   // $: switch (freight) {
   //    case 'B-Auto':
   //    case 'B-Truck':
   //    case 'C1':
   //    case 'C3':
   //       load = capacity * 0.5;
   //       break;

   //    case 'C2':
   //       load = capacity * 0.5 * 1.6;
   //       break;

   //    default:
   //       // 'None' or 'A'
   //       load = capacity * 0.3;
   //       break;
   // }

   // - Split platforms
   // $: if (platformWidth > 92 && platformDepth > 92) {
   //    platformSplit = true;
   //    disableSplit = true;
   // } else {
   //    disableSplit = false;
   // }

   // - Stringer
   $: if (stringerValue !== 'Loading...') platformStringer = stringerOptions.find((row) => row.text === stringerValue);

   // - Side Channel
   $: if (platformIsolation && platformStringer) {
      sideChannel = sideChannelOptions.find((channel) => channel.dimensions.depth >= platformStringer.dimensions.depth);
   } else {
      sideChannel = platformStringer;
   }

   // - Front Channel
   $: if (frontChannelValue !== 'Loading...') platformFrontChannel = frontChannelOptions.find((row) => row.text === frontChannelValue);

   // - Platform Thickness
   $: if (sideChannel?.dimensions.depth && platformFloorPlate?.thickness) {
      platformThickness = sideChannel.dimensions.depth + platformFloorPlate.thickness;
   }

   // - Sill Channel
   // $: if (platformHasSillChannel && platformStringer) {
   //    sillChannel = platformStringer;
   // } else {
   //    sillChannel = undefined;
   // }

   // - Back Channel
   $: if (platformFrontChannel && sideChannel) {
      if (platformSplit || doorQty === 2) {
         backChannel = platformFrontChannel;
      } else {
         backChannel = sideChannel;
      }
   }

   // - Floor Plate
   $: if (steelPlateOptions) {
      floorPlateValue = steelPlateOptions[0].name;
   }

   $: if (floorPlateValue) {
      platformFloorPlate = steelPlateOptions.find((row) => {
         return row.name === floorPlateValue;
      });
   }
</script>

<fieldset>
   <legend>Steel</legend>
   <Select bind:value={platformSteel} label="Type">
      {#each options.steelType as { text }}
         <Option {text} />
      {/each}
   </Select>
   <!-- <Checkbox bind:checked={platformSplit} disabled={disableSplit} label="Split" /> -->
   <Checkbox bind:checked={platformHasSillChannel} label="Sill Channel" />
   <!-- <Select bind:value={stringerValue} label="Stringer"> -->
   <OptGroup label="Stocked">
      {#each stringerStockOptions as { text }}
         <Option {text} />
      {/each}
   </OptGroup>
   <OptGroup label="Available">
      {#each stringerAvailableOptions as { text }}
         <Option {text} />
      {/each}
   </OptGroup>
   <OptGroup label="Check">
      {#each stringerCheckOptions as { text }}
         <Option {text} />
      {/each}
   </OptGroup>
   <!-- </Select> -->

   <Input bind:value={platformStringerQty} calc={stringerQtyCalc} label="Stringer Quantity" reset type="number" />

   <!-- <Input bind:value={sideChannelValue} display label="Side Channel" /> -->
   <!-- {#if platformHasSillChannel} -->
   <!-- <Input bind:value={sillChannel.text} display label="Sill Channel" /> -->
   <!-- {/if} -->

   <!-- <Select bind:value={frontChannelValue} label="Front Channel"> -->
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
   <!-- </Select> -->

   <Input bind:value={backChannelValue} display label="Back Channel" />

   <!-- <Select bind:value={floorPlateValue} label="Floor Plate"> -->
   {#each steelPlateOptions as { name }}
      <Option text={name} />
   {/each}
   <!-- </Select> -->
</fieldset>
