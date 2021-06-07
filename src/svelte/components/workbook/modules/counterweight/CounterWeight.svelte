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

   const getBlock = (weightWidth, isStriker) => tables.blocks.find((block) => block.striker === isStriker && block.depth <= weightWidth);

   // Constants
   const dispatch = createEventDispatcher();

   const { metric, modules } = workbook;
   const { capacity, cwtRoping, carSpeed, seismic } = modules.globals;
   const { zone: seismicZone } = seismic;
   const { counterweight: module } = modules;

   // Variables
   let cwtModel = module?.properties?.model ?? '230';
   let cwtDBG = module?.properties?.dbg ?? 38.75;
   let cwtRailSize = module?.properties?.railSize ?? '8#';
   let cwtWeight = 0;
   let cwtHeight = 0;
   let counterbalance = module?.properties?.counterbalance ?? 40;
   let weightWidth = module?.properties?.weightWidth ?? 8;
   let lead = module?.properties?.lead ?? false;
   let gap = 24;

   let safetyModel = module?.safety?.model ?? 'None';
   let safetyHeight = module?.safety?.height ?? 0;
   let safetyWeight = module?.safety?.weight ?? 0;
   let safetySpacers = false;

   let useShoePlates = false;
   let shoeModel = module?.shoe?.model ?? '';
   let shoeHeight = module?.shoe?.height ?? 0;
   let shoeWeight = module?.shoe?.weight ?? 0;

   let blockQty = 0;
   let isStriker = false;
   let bufferPlate = false;

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

   // - Dimensions
   let bottomEquipHeight = 0;

   // - Dom
   let disableSafetySpacers = false;
   let bottomEquipHeightString = '';

   // Reactive Variables
   $: model = getFromArray(cwtModel, cwtModels);

   // - Parts
   $: frameChannelLength = roundInc(cwtDBG + (model?.channelOffset ?? 0));

   $: crossheadHeight = model?.crosshead.channel.depth ?? 0;
   $: crossheadWeight = ((model?.crosshead.channel.weight ?? 0) * frameChannelLength + (model?.crosshead?.gusset?.weight ?? 0)) * 2;

   $: plankHeight = model?.plank.depth ?? 0;
   $: plankWeight = (model?.plank.weight ?? 0) * frameChannelLength * 2;

   $: steelFillerWeight = model?.fillerWeight(cwtDBG, weightWidth, 0.284, 8);
   $: leadFillerWeight = model?.fillerWeight(cwtDBG, weightWidth, 0.4096, 8);

   $: block = getBlock(weightWidth, isStriker);

   // - Dom
   $: imgString = [cwtModel.match(/\d{3}/)[0], blockQty > 0 ? '-block' : '', bufferPlate ? '-plate' : '', safetyModel !== 'None' ? '-safety' : '', '.svg'].join('');

   // -- Select Options
   $: modelOptions = getModelOptions(cwtModels, cwtDBG, cwtWeight, compensation);

   // - Reactive Rules
   $: if (save) onSave();

   $: cwtWeight = round(carWeight + capacity * (counterbalance / 100), 2);
   $: cwtHeight = roundInc(crossheadHeight + gap + plankHeight + bottomEquipHeight);

   $: if (seismicZone >= 2) useShoePlates = true;

   $: if (safety?.cwt?.spacers) {
      disableSafetySpacers = true;
      safetySpacers = true;
   } else {
      disableSafetySpacers = false;
   }

   $: switch (true) {
      case safetyModel !== 'None':
         blockQty = 0;
         bufferPlate = false;

         bottomEquipHeightString = 'Extension Height';

         if (safety?.cwt?.extLength) {
            bottomEquipHeight = safety.cwt.extLength;
         } else {
            bottomEquipHeight = round(safetyHeight + (safetySpacers ? 6 : 0));
         }

         break;

      case bufferPlate:
         bottomEquipHeightString = 'Plate';
         bottomEquipHeight = 1;
         break;

      case blockQty > 0:
         bottomEquipHeightString = 'Block Height';
         bottomEquipHeight = blockQty * (block?.height ?? 0);
         break;

      default:
         bottomEquipHeight = 0;
         break;
   }

   // Events
   const onLink = (event) => dispatch(event.detail.cmd, event.detail.location);

   // Lifecycle
   onMount(() => {
      getEngineeringData(capacity, carSpeed, cwtRoping);
      console.log(workbook);
   });

   onDestroy(() => onSave());

   // Logs
   $: if (model) console.log(model);
   // $: if (safety) console.log(safety);
</script>

<div class="container">
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
</div>

<div class="container">
   <Fieldset title="Properties">
      <Select bind:value={cwtModel} label="Model">
         {#each modelOptions as { text, disabled } (text)}
            <Option {text} {disabled} selected={cwtModel === text} />
         {/each}
      </Select>

      <Input bind:value={counterbalance} label="Counterbalance" list="counterbalance" suffix="%" type="number" />
      <datalist id="counterbalance">
         <option value="40">40%</option>
         <option value="50">50%</option>
      </datalist>

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

      <Checkbox bind:checked={useShoePlates} disabled={seismicZone >= 2} label="Shoe Plates" />

      {#if compensation !== 'Rope'}
         {#if safetyModel !== 'None'}
            <div in:slide|local={{ delay: 1000 }} out:slide|local>
               <Checkbox bind:checked={safetySpacers} disabled={disableSafetySpacers} label="Safety Spacers" />
            </div>
         {:else}
            <div in:slide|local={{ delay: 1000 }} out:slide|local>
               {#if !bufferPlate}
                  <div transition:slide|local>
                     <Select bind:value={blockQty} label={`${isStriker ? 'Striker' : 'Knock Off'} Block Quantity`}>
                        <Option text={0} />
                        <Option text={1} />
                        <Option text={2} />
                        <Option text={3} />
                     </Select>
                  </div>
               {/if}

               {#if blockQty === 0}
                  <div in:slide|local={{ delay: 1000 }} out:slide|local>
                     <Checkbox bind:checked={bufferPlate} label="Buffer Plate" />
                  </div>
               {:else}
                  <div in:slide|local={{ delay: 1000 }} out:slide|local>
                     <Select bind:value={isStriker} label="Block Type">
                        <Option text="Knock Off" value={false} />
                        <Option text="Striker" value={true} />
                     </Select>
                  </div>
               {/if}
            </div>
         {/if}
      {/if}
   </Fieldset>
</div>

<fieldset class="dimensions">
   <legend>Dimensions</legend>
   <hr />
   <div class="flex">
      <div class="section-1">
         <InputLength value={crossheadHeight} display label="Top Channel" {metric} />

         <InputLength bind:value={gap} label="Gap" {metric} />

         <!-- TODO: 6-02-2021 1:09 PM - Bind me -->
         <InputLength display label={`${lead ? 'Steel ' : ''}Weight Stack`} />

         {#if lead}
            <div transition:slide|local>
               <!-- TODO: 6-02-2021 1:09 PM - Bind me -->
               <InputLength display label="Lead Weight Stack" />
            </div>
         {/if}

         <InputLength value={plankHeight} display label="Bottom Channel" {metric} />

         {#if safetyModel !== 'None' || bufferPlate || blockQty > 0}
            <InputLength value={bottomEquipHeight} display label={bottomEquipHeightString} {metric} />
         {/if}

         <InputLength value={cwtHeight} display label="Overall Height" {metric} />
      </div>

      <div class="section-2">
         <img src={`/public/img/counterweight/${imgString}`} alt="Counterweight Dimensions" />
      </div>
   </div>
</fieldset>

<style lang="scss">
   @use './src/scss/vantage-theme';
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
   }

   .dimensions {
      @include vantage-theme.vantage-fieldset;
      .flex {
         display: flex;
      }
   }

   // .sub-container {
   //    display: flex;
   //    flex-wrap: wrap;
   //    align-items: flex-start;
   //    flex-basis: calc(calc(800px - 100%) * 10000);
   //    flex-grow: 1;
   //    max-width: 1000px;
   //    min-width: 410px;
   // }
</style>
