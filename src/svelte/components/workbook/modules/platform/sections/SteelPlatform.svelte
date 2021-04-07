<!-- TODO: 4-06-2021 3:50 PM - calculate weight -->
<script>
   import * as options from '../options';
   import * as tables from '../tables';

   // Components
   import { Input } from '../../../../material/input';
   import { OptGroup, Option, Select } from '../../../../material/select';
   import { Checkbox } from '../../../../material/checkbox';
   import { round } from '../../round';

   // Properties
   export let workbook = {};

   export let doorQty = 1;
   export let platformDepth = 0;
   export let platformIsolation = false;
   export let platformFrontToRail = 0;
   export let platformSteel = {};
   export let platformThickness = 0;
   export let platformWeight = 0;
   export let platformWidth = 0;

   // Methods
   const getdb = async (stringerSectionModulus, stringerMomentOfIntertia, frontChannelSectionModulus, frontChannelMomentOfIntertia) => {
      let steel = {
         material: platformSteel.type,
         stringer: { sectionModulus: stringerSectionModulus, momentOfInertia: stringerMomentOfIntertia },
         frontChannel: { sectionModulus: frontChannelSectionModulus, momentOfInertia: frontChannelMomentOfIntertia },
      };

      const res = await fetch(`api/engineering/platform?material=Steel&steel=${JSON.stringify(steel)}`, {
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => {
         console.log(error);
         return { ok: false };
      });

      if (res.ok) {
         db = await res.json();
         console.log(db);

         stringerOptions = db.stringer;
         sideChannelOptions = db.sideChannel;
         frontChannelOptions = db.frontChannel;

         stringerValue = stringerOptions[0].text;
         frontChannelValue = frontChannelOptions[0].text;
      }
   };

   // Constants
   const { capacity, loading } = workbook.modules.globals;
   const { freight } = loading;

   // Variables
   let channelLoad = 0;
   let disableSplit = false;
   let db = undefined;

   // - Steel Options
   let stringerValue = 'Loading...';
   let frontChannelValue = 'Loading...';

   let stringerOptions = [{ text: 'Loading...', stockStatus: 'Stocked' }];
   let sideChannelOptions = undefined;
   let frontChannelOptions = [{ text: 'Loading...', stockStatus: 'Stocked' }];

   // Reactive Variables
   $: platformBackToRail = round(platformDepth - platformFrontToRail, 4);
   $: elasticModulus = options.steelType.find((type) => type.text === platformSteel.type).elasticModulus;

   // - Option Groups
   $: stringerStockOptions = stringerOptions.filter((option) => option.stockStatus === 'Stocked');
   $: stringerAvailableOptions = stringerOptions.filter((option) => option.stockStatus === 'Available');
   $: stringerCheckOptions = stringerOptions.filter((option) => option.stockStatus === 'Check');
   $: frontChannelStockOptions = frontChannelOptions.filter((option) => option.stockStatus === 'Stocked');
   $: frontChannelAvailableOptions = frontChannelOptions.filter((option) => option.stockStatus === 'Available');
   $: frontChannelCheckOptions = frontChannelOptions.filter((option) => option.stockStatus === 'Check');

   // - Stringers
   $: isolatedStringerSectionModulus = round((channelLoad * platformDepth) / 112000, 2);
   $: unIsolatedStringerSectionModulus = round((Math.max(platformFrontToRail, platformBackToRail) * 13 * channelLoad) / (64 * 14000), 2);
   $: stringerSectionModulus = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerSectionModulus : unIsolatedStringerSectionModulus;
   $: isolatedStringerMomentOfInertia = round((960 * channelLoad * platformDepth ** 2) / (192 * elasticModulus), 1);
   $: unIsolatedStringerMomentOfInertia = round((channelLoad * Math.max(platformFrontToRail, platformBackToRail) ** 3) / (66 * elasticModulus * (platformDepth / 960)), 1);
   $: stringerMomentOfIntertia = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerMomentOfInertia : unIsolatedStringerMomentOfInertia;

   // - Side Channel
   $: sideChannelValue = platformSteel?.sideChannel?.text ?? 'Loading...';

   // - Front Channel
   $: frontChannelSectionModulus = tables.frontChannelFormulas.find((row) => row.category.includes(freight)).sectionModulus(channelLoad, platformWidth);
   $: frontChannelMomentOfInertia = tables.frontChannelFormulas.find((row) => row.category.includes(freight)).momentOfInertia(channelLoad, platformWidth, elasticModulus);

   // - Back Channel
   $: backChannelValue = platformSteel?.backChannel?.text ?? 'Loading...';

   // Reactive Rules
   $: getdb(stringerSectionModulus, stringerMomentOfIntertia, frontChannelSectionModulus, frontChannelMomentOfInertia);

   // - Channel Load
   $: switch (freight) {
      case 'B-Auto':
      case 'B-Truck':
      case 'C1':
      case 'C3':
         channelLoad = capacity * 0.5;
         break;

      case 'C2':
         channelLoad = capacity * 0.5 * 1.6;
         break;

      default:
         // 'None' or 'A'
         channelLoad = capacity * 0.3;
         break;
   }

   // - Split platforms
   $: if (platformWidth > 92 && platformDepth > 92) {
      platformSteel.split = true;
      disableSplit = true;
   } else {
      disableSplit = false;
   }

   // - Stringer
   $: if (stringerValue !== 'Loading...') platformSteel.stringer = stringerOptions.find((row) => row.text === stringerValue);

   // - Side Channel
   $: if (platformIsolation && platformSteel.stringer) {
      platformSteel.sideChannel = sideChannelOptions.find((channel) => channel.dimensions.depth >= platformSteel.stringer.dimensions.depth);
   } else {
      platformSteel.sideChannel = platformSteel.stringer;
   }

   // - Front Channel
   $: if (frontChannelValue !== 'Loading...') platformSteel.frontChannel = frontChannelOptions.find((row) => row.text === frontChannelValue);

   // - Platform Thickness
   $: if (platformSteel?.sideChannel?.dimensions.depth) {
      platformThickness = platformSteel.sideChannel.dimensions.depth;
   }

   // - Sill Channel
   $: if (platformSteel.hasSillChannel && platformSteel.stringer) {
      platformSteel.sillChannel = platformSteel.stringer;
   } else {
      platformSteel.sillChannel = undefined;
   }

   // - Back Channel
   $: if ((platformSteel.split || doorQty === 2) && platformSteel.frontChannel && platformSteel.sideChannel) {
      platformSteel.backChannel = platformSteel.frontChannel;
   } else {
      platformSteel.backChannel = platformSteel.sideChannel;
   }
</script>

<fieldset>
   <legend>Steel</legend>
   <Select bind:value={platformSteel.type} label="Type">
      {#each options.steelType as { text }}
         <Option {text} />
      {/each}
   </Select>
   <Checkbox bind:checked={platformSteel.split} disabled={disableSplit} label="Split" />
   <Checkbox bind:checked={platformSteel.hasSillChannel} label="Sill Channel" />
   <Select bind:value={stringerValue} label="Stringer">
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
   </Select>
   <Input bind:value={sideChannelValue} display label="Side Channel" />
   {#if platformSteel.hasSillChannel}
      <Input bind:value={platformSteel.sillChannel.text} display label="Sill Channel" />
   {/if}

   <Select bind:value={frontChannelValue} label="Front Channel">
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
   </Select>

   <Input bind:value={backChannelValue} display label="Back Channel" />
</fieldset>
