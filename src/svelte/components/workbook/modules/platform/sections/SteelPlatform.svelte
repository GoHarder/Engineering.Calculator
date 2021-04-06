<script>
   import * as options from '../options';
   import * as tables from '../tables';

   // Components
   //   import { Input, InputArea, InputLength, InputWeight } from '../../../../material/input';
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
   const getdb = async (stringerSectionModulus, stringerMomentOfIntertia) => {
      let steel = {
         material: platformSteel.type,
         stringer: { sectionModulus: stringerSectionModulus, momentOfInertia: stringerMomentOfIntertia },
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

   $: console.log(db);

   // - Steel Options
   let stringerOptions = [{ text: 'Loading...' }];
   let sideChannelOptions = [{ text: 'Loading...' }];

   // Reactive Variables
   $: platformBackToRail = round(platformDepth - platformFrontToRail, 4);
   $: elasticModulus = options.steelType.find((type) => type.text === platformSteel.type).elasticModulus;

   // - Stringers
   $: isolatedStringerSectionModulus = round((channelLoad * platformDepth) / 112000, 2);
   $: unIsolatedStringerSectionModulus = round((Math.max(platformFrontToRail, platformBackToRail) * 13 * channelLoad) / (64 * 14000), 2);
   $: stringerSectionModulus = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerSectionModulus : unIsolatedStringerSectionModulus;
   $: isolatedStringerMomentOfIntertia = round((960 * channelLoad * platformDepth ** 2) / (192 * elasticModulus), 3);
   $: unIsolatedStringerMomentOfIntertia = round((channelLoad * Math.max(platformFrontToRail, platformBackToRail) ** 3) / (66 * elasticModulus * (platformDepth / 960)), 3);
   $: stringerMomentOfIntertia = ['None', 'A'].includes(freight) && platformIsolation ? isolatedStringerMomentOfIntertia : unIsolatedStringerMomentOfIntertia;

   // Reactive Rules
   $: getdb(stringerSectionModulus, stringerMomentOfIntertia);

   $: if (db) {
      stringerOptions = db.stringer;
      platformSteel.stringer = stringerOptions[0];
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

   // $: console.log('Stringer Zx', stringerSectionModulus);
   // $: console.log(isolatedStringerMomentOfIntertia);
   // $: console.log(unIsolatedStringerMomentOfIntertia);
</script>

<fieldset>
   <legend>Steel</legend>
   <Select bind:value={platformSteel.type} label="Type" options={options.steelType} />
   <Checkbox bind:checked={platformSteel.split} disabled={disableSplit} label="Split" />
   <Checkbox bind:checked={platformSteel.sillChannel} label="sillChannel" />
   <Select bind:value={platformSteel.stringer} groups={channelOptionGroups} label="Stringer" options={stringerOptions} />
   <Select bind:value={platformSteel.sideChannel} display label="SideChannels" options={sideChannelOptions} />
</fieldset>
