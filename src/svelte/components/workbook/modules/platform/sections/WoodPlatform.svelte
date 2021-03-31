<script>
   import { round, floor } from '../../round';

   // Properties
   export let workbook = {};
   export let platform = {};

   // Methods
   const getdb = async (sectionModulus) => {
      const res = await fetch(`api/engineering/platform?material=Wood&sectionModulus=${sectionModulus}`, {
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
   const { globals } = workbook.modules;
   const { capacity } = globals;
   const { width } = platform;

   // Variables
   let db = undefined;

   // Reactive Rules
   $: getdb((width * capacity) / 300000);

   // Reactive Rules
   $: if (db && platform) {
      // console.log(db);
      const { angle } = db;
      const { width, depth } = platform;

      platform.thickness = angle.depth;

      // Platform weight calculations
      const plywoodWidth = width - angle.thickness * 2;
      const plywoodDepth = depth - angle.thickness * 2;
      const plywoodQty = angle.depth - 1;
      const plywoodWeight = round(plywoodQty * plywoodWidth * plywoodDepth * (2.046875 / 144)); // 3/4" Weight = 2.046875 lb/ft²
      const stringerQty = floor(plywoodDepth / 10.875);
      const stringerWeight = round(stringerQty * plywoodWidth * (2.7 / 12)); // 2 X 8 Weight = 2.7 lb/ft
      const angleWeight = round(plywoodWidth * angle.weight * 2 + depth * angle.weight * 2);
      const fireProofWeight = round(plywoodWidth * plywoodDepth * (3.125 / 144)); // 14GA Weight = 3.125 lb/ft²

      platform.weight = plywoodWeight + stringerWeight + angleWeight + fireProofWeight;

      // console.groupCollapsed('Platform Debug');
      // console.group('Plywood Information');
      // console.log('Quantity', plywoodQty);
      // console.log('Width', plywoodWidth);
      // console.log('Depth', plywoodDepth);
      // console.log('Total Weight', plywoodWeight);
      // console.groupEnd();
      // console.group('Stringer Information');
      // console.log('Quantity', stringerQty);
      // console.log('Length', plywoodWidth);
      // console.log('Total Weight', stringerWeight);
      // console.groupEnd();
      // console.group('Angle Information');
      // console.log('Total Weight', angleWeight);
      // console.groupEnd();
      // console.group('Fire Proofing Information');
      // console.log('Total Weight', fireProofWeight);
      // console.groupEnd();
      // console.groupEnd();
   }
</script>
