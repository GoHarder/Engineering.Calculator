<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { slide } from 'svelte/transition';

   import { inherit } from '../inherit';
   import { round, roundInc } from '../js/math';
   import { getFromArray } from '../js/functions';

   import * as gTables from '../js/tables';
   import * as tables from './tables';

   // Components
   import { Fieldset, SelectSafety, SelectShoe } from '../../common';
   import { Input, InputLength, InputWeight } from '../../../material/input';
   import { Option, Select } from '../../../material/select';
   import { Checkbox } from '../../../material/checkbox';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Methods
   const onSave = () => {
      let saveData = {
         properties: {
            model: cwtModel,
            dbg: cwtDBG,
            counterbalance,
            weightWidth,
            railSize: cwtRailSize,
            lead,
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

      if (safetyModel === 'Other') saveData.safety = { ...saveData.safety, ...safety };
      if (shoeModel === 'Other') saveData.shoe = { ...saveData.shoe, ...shoe };

      workbook.modules.counterweight = { ...workbook.modules.counterweight, ...saveData };

      saveProject();
   };

   const getEngineeringData = async (capacity, carSpeed, roping) => {
      const res = await fetch(`api/engineering/counterweight?capacity=${capacity}&carSpeed=${carSpeed}&roping=${roping}`, {
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => {
         console.log(error);
         return { ok: false };
      });

      if (res.ok) {
         const body = await res.json();

         body.models = body.models.map((model) => {
            const tableData = tables.cwtModels.find((nth) => nth.name === model.name);
            model = { ...model, ...tableData };
            return model;
         });

         cwtModels = body.models;
         safeties = body.safeties;
         shoes = body.shoes;
      } else {
         console.log(res);
      }
   };

   const getModelOptions = (models, dbg, weight, comp) => {
      let selections = [];

      if (models) selections = models;

      return selections.reduce((array, model) => {
         const dbgCheck = model.dbg ? model.dbg !== dbg : false;
         const compCheck = model.comp.includes(comp);
         const modelCheck = model.modelCheck(dbg + model.channelOffset, weight, model.crosshead.channel.modulusX);

         array.push({
            text: model.name,
            disabled: [dbgCheck, !compCheck, !modelCheck].some((test) => test),
         });

         return array;
      }, []);
   };

   // Constants
   const dispatch = createEventDispatcher();

   const { metric, modules } = workbook;
   const { capacity, cwtRoping, carSpeed } = modules.globals;
   const { counterweight: module } = modules;

   // Variables
   let cwtModel = module?.properties?.model ?? '230';
   let cwtDBG = module?.properties?.dbg ?? 38.75;
   let cwtRailSize = module?.properties?.railSize ?? '8#';
   let counterbalance = module?.properties?.counterbalance ?? 40;
   let weightWidth = module?.properties?.weightWidth ?? 8;
   let lead = module?.properties?.lead ?? false;

   let safetyModel = module?.safety?.model ?? 'None';
   let safetyHeight = module?.safety?.height ?? 0;
   let safetyWeight = module?.safety?.weight ?? 0;

   let shoeModel = module?.shoe?.model ?? '';
   let shoeHeight = module?.shoe?.height ?? 0;
   let shoeWeight = module?.shoe?.weight ?? 0;

   // - Inherited Variables
   let carWeight = inherit(modules, 'sling.carWeight', 'value') ?? 0;
   let compensation = inherit(modules, 'sling.compensation', 'value') ?? 'None';

   let carWeightLink = inherit(modules, 'sling.carWeight', 'module');
   let compensationLink = inherit(modules, 'sling.compensation', 'module');

   // - Database Information
   let cwtModels = undefined;
   let shoes = undefined;
   let shoePlates = undefined;
   let safeties = undefined;
   let sheaves = undefined;

   // - Parts
   let shoe;
   let safety;

   // Reactive Variables
   $: model = getFromArray(cwtModel, cwtModels);
   $: cwtWeight = round(carWeight + capacity * (counterbalance / 100), 2);

   $: frameChannelLength = roundInc(cwtDBG + (model?.channelOffset ?? 0));

   $: crossheadHeight = model?.crosshead.channel.depth ?? 0;
   $: crossheadWeight = ((model?.crosshead.channel.weight ?? 0) * frameChannelLength + (model?.crosshead?.gusset?.weight ?? 0)) * 2;

   $: plankHeight = model?.plank.depth ?? 0;
   $: plankWeight = (model?.plank.weight ?? 0) * frameChannelLength * 2;

   $: steelFillerWeight = model?.fillerWeight(cwtDBG, weightWidth, 0.284, 8);
   $: leadFillerWeight = model?.fillerWeight(cwtDBG, weightWidth, 0.4096, 8);

   $: staticWeight = crossheadWeight + plankWeight + shoeWeight + safetyWeight;

   // - Select Options
   $: modelOptions = getModelOptions(cwtModels, cwtDBG, cwtWeight, compensation);

   // - Reactive Rules
   $: if (save) onSave();

   // Events
   const onLink = (event) => dispatch(event.detail.cmd, event.detail.location);

   // Lifecycle
   onMount(() => {
      getEngineeringData(capacity, carSpeed, cwtRoping);
      console.log(workbook);
   });

   onDestroy(() => onSave());

   $: if (model) console.log(model);
</script>

<Fieldset title="Globals">
   <InputWeight value={capacity} on:link={onLink} label="Capacity" link={{ cmd: 'changePage', location: 'Requirements' }} {metric} />

   <Input value={`${cwtRoping}:1`} on:link={onLink} label="Roping" link={{ cmd: 'changePage', location: 'Requirements' }} />
</Fieldset>

<Fieldset title="Sling">
   <InputWeight value={carWeight} on:link={onLink} label="Car Weight" link={{ cmd: 'changeModule', location: carWeightLink }} {metric} step={0.01} />

   <Select bind:value={compensation} on:link={onLink} label="Compensation" link={{ cmd: 'changeModule', location: compensationLink }}>
      {#each gTables.compensation as { name } (name)}
         <Option text={name} />
      {/each}
   </Select>
</Fieldset>

<Fieldset title="Properties">
   <Select bind:value={cwtModel} label="Model">
      {#each modelOptions as { text, disabled } (text)}
         <Option {text} {disabled} selected={cwtModel === text} />
      {/each}
   </Select>

   <Input bind:value={counterbalance} label="Counterbalance" list="counterbalance" suffix="%" type="number" />
   <datalist id="counterbalance"><option value="40" /><option value="50" /></datalist>

   <InputLength bind:value={cwtDBG} label="D.B.G." list="dbg" {metric} />
   <datalist id="dbg">
      <option value="30.125">2' - 6.125"</option>
      <option value="38.75">3' - 2.75"</option>
      <option value="57.25">4' - 9.25"</option>
   </datalist>

   <InputLength bind:value={weightWidth} label="Filler Weight Width" list="weight-width" {metric} />
   <datalist id="weight-width">
      <option value="6">6"</option>
      <option value="8">8"</option>
      <option value="10">10"</option>
   </datalist>

   <!-- TODO: 6-01-2021 10:41 AM - Add a link to this -->
   <Select bind:value={cwtRailSize} label="Rail Size">
      {#each gTables.railSizes as { name } (name)}
         <Option text={name} />
      {/each}
   </Select>

   <Checkbox bind:checked={lead} label="Lead Weights" />

   <InputWeight value={cwtWeight} display label="Total Weight" {metric} />
</Fieldset>

<Fieldset title="Equipment">
   <SelectShoe bind:shoe bind:shoeHeight bind:shoeModel bind:shoeWeight {metric} railSize={cwtRailSize} {shoes} />

   <SelectSafety bind:safety bind:safetyHeight bind:safetyModel bind:safetyWeight {metric} optional railSize={cwtRailSize} {safeties} />
</Fieldset>

<Fieldset title="Dimensions">
   <InputLength value={crossheadHeight} display label="Top Channel" {metric} />

   <InputLength value={plankHeight} display label="Bottom Channel" {metric} />
</Fieldset>
