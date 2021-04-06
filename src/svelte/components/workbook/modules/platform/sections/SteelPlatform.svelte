<!-- TODO: 4-06-2021 3:50 PM - calculate weight -->
<script>
   import * as options from '../options';
   import * as tables from '../tables';

   // Components
   import { Input, InputArea, InputLength, InputWeight } from '../../../../material/input';
   import { Select } from '../../../../material/select';
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
      }
   };

   // Constants
   const { capacity, loading } = workbook.modules.globals;
   const { freight } = loading;
   const channelOptionGroups = {
      groupBy: 'stockStatus',
      objs: [
         { label: 'Stock', value: 'Stocked', options: [] },
         { label: 'Available', value: 'Available', options: [] },
         { label: 'Check', value: 'Check', options: [] },
      ],
   };

   // Variables
   let channelLoad = 0;
   let disableSplit = false;
   let db = undefined;

   // - Steel Options
   let stringerOptions = [{ text: 'Loading...' }];
   let sideChannelOptions = undefined;
   let frontChannelOptions = [{ text: 'Loading...' }];

   // Reactive Variables
   $: platformBackToRail = round(platformDepth - platformFrontToRail, 4);
   $: elasticModulus = options.steelType.find((type) => type.text === platformSteel.type).elasticModulus;

   // - Stringers
   $: isolatedStringerSectionModulus = round((channelLoad * platformDepth) / 112000, 2);
   $: unIsolatedStringerSectionModulus = round((Math.max(platformFrontToRail, platformBackToRail) * 13 * channelLoad) / (64 * 14000), 2);
   $: stringerSectionModulus = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerSectionModulus : unIsolatedStringerSectionModulus;
   $: isolatedStringerMomentOfInertia = round((960 * channelLoad * platformDepth ** 2) / (192 * elasticModulus), 1);
   $: unIsolatedStringerMomentOfInertia = round((channelLoad * Math.max(platformFrontToRail, platformBackToRail) ** 3) / (66 * elasticModulus * (platformDepth / 960)), 1);
   $: stringerMomentOfIntertia = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerMomentOfInertia : unIsolatedStringerMomentOfInertia;

   // - Side Channels
   $: sideChannelValue = platformSteel?.sideChannel?.text ?? 'Loading...';

   // - Front Channel
   $: frontChannelSectionModulus = tables.frontChannelFormulas.find((row) => row.category.includes(freight)).sectionModulus(channelLoad, platformWidth);
   $: frontChannelMomentOfInertia = tables.frontChannelFormulas.find((row) => row.category.includes(freight)).momentOfInertia(channelLoad, platformWidth, elasticModulus);

   $: backChannelvalue = platformSteel?.backChannel?.text ?? 'Loading...';

   // Reactive Rules
   $: getdb(stringerSectionModulus, stringerMomentOfIntertia, frontChannelSectionModulus, frontChannelMomentOfInertia);

   $: if (db) {
      console.log(db);
      stringerOptions = db.stringer;
      platformSteel.stringer = stringerOptions[0];
      sideChannelOptions = db.sideChannel;
      frontChannelOptions = db.frontChannel;
      platformSteel.frontChannel = frontChannelOptions[0];
   }

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

   $: if (platformWidth > 92 && platformDepth > 92) {
      platformSteel.split = true;
      disableSplit = true;
   } else {
      disableSplit = false;
   }

   $: if (platformIsolation) {
      platformSteel.sideChannel = sideChannelOptions.find((channel) => channel.dimensions.depth >= platformSteel.stringer.dimensions.depth);
   } else {
      platformSteel.sideChannel = platformSteel.stringer;
   }

   $: if (platformSteel?.sideChannel?.dimensions?.depth) {
      platformThickness = platformSteel.sideChannel.dimensions.depth;
   }

   $: if (platformSteel.hasSillChannel) {
      platformSteel.sillChannel = platformSteel.stringer;
   } else {
      platformSteel.sillChannel = undefined;
   }

   $: if (platformSteel.split || doorQty === 2) {
      platformSteel.backChannel = platformSteel.frontChannel;
   } else {
      platformSteel.backChannel = platformSteel.sideChannel;
   }
</script>

<fieldset>
   <legend>Steel</legend>
   <Select bind:value={platformSteel.type} label="Type" options={options.steelType} />
   <Checkbox bind:checked={platformSteel.split} disabled={disableSplit} label="Split" />
   <Checkbox bind:checked={platformSteel.hasSillChannel} label="Sill Channel" />
   <Select bind:value={platformSteel.stringer} groups={channelOptionGroups} label="Stringer" options={stringerOptions} />
   <Input value={sideChannelValue} display label="Side Channel" />
   {#if platformSteel.hasSillChannel}
      <Input value={platformSteel.sillChannel.text} display label="Sill Channel" />
   {/if}

   <Select bind:value={platformSteel.frontChannel} groups={channelOptionGroups} label="Front Channel" options={frontChannelOptions} />

   <Input value={backChannelvalue} display label="Back Channel" />
</fieldset>
