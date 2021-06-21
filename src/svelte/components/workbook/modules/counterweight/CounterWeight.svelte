<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { slide } from 'svelte/transition';

   import { inherit } from '../inherit';
   import { ceil, floor, round, roundInc } from '../js/math';
   import { getFromArray } from '../js/functions';

   import * as gTables from '../js/tables';
   import * as tables from './tables';

   // Components
   import { Fieldset, SelectRopes, SelectSafety, SelectShoe } from '../../common';
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
         shoePlates = body.shoePlates;
         sheaves = body.sheaves;
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

   const getSheaveOptions = (sheaves = [], qty, diameter, pitch) => {
      let options = [];
      const requiredWidth = round((qty - 1) * pitch + diameter + 0.625, 4);
      const requiredDiameter = round(diameter * 40, 3);

      if (sheaves) options = [...sheaves];

      options = options.map((sheave) => {
         return {
            value: sheave.name,
            text: `${sheave.name} (Ø${floor(sheave.diameter)}")`,
            valid: sheave.diameter >= requiredDiameter && sheave.rimWidth >= requiredWidth,
         };
      });

      return options;
   };

   const getBlock = (weightWidth, isStriker) => tables.blocks.find((block) => block.striker === isStriker && block.depth <= weightWidth);

   const getShoePlate = (shoePlates, shoe, mounting, railSize) => {
      let output = {
         weight: 5,
         thickness: 0.75,
      };

      if (shoePlates) {
         const plate = [...shoePlates].find((plate) => plate.shoes.includes(shoe));
         const mountsTo = plate?.mountsTo.find((nth) => nth.products.includes(mounting));
         const variant = mountsTo?.variants.find((nth) => nth.railSizes.includes(railSize));

         output = {
            weight: variant?.weight ?? 5,
            thickness: variant?.thickness ?? 0.75,
         };
      }

      return output;
   };

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
   let cwtHeightOverride = false;
   let counterbalance = module?.properties?.counterbalance ?? 40;
   let weightWidth = module?.properties?.weightWidth ?? 8;
   let lead = module?.properties?.lead ?? false;

   let stileChannelName = 'MC8X22.8';

   let sheaveHangerModel = '341';
   let sheaveModel = '';
   let sheaveHeight = 0;

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

   let ropePitch = inherit(modules, 'sling.ropePitch', 'value');
   let ropePitchOverride = inherit(modules, 'sling.ropePitchOverride', 'value');
   let ropeSize = inherit(modules, 'sling.ropeSize', 'value');
   let ropeQty = inherit(modules, 'sling.ropeQty', 'value');

   let ropeSizeLink = inherit(modules, 'sling.ropeSize', 'module');

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
   let bottomEquipWeight = 0;

   let leadStackHeight = 0;
   let steelStackHeight = 0;

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

   $: sheave = getFromArray(sheaveModel, sheaves);
   $: topShoePlate = getShoePlate(shoePlates, shoeModel, cwtModel, cwtRailSize);
   $: bottomShoePlate = getShoePlate(shoePlates, shoeModel, safety ? safetyModel : cwtModel, cwtRailSize);

   $: block = getBlock(weightWidth, isStriker);

   $: stileWeight = model?.stileWeight ?? stileChannel.weight;
   $: stileChannel = getFromArray(stileChannelName, tables.stile235);

   $: plateLength = roundInc(cwtDBG - ((shoe?.railToBack ?? 8) + 0.25), 0.25);
   $: plateWidth = round((model?.stileGap ?? stileChannel.depth) + model?.plank.flangeWidth * 2);
   $: plateWeight = plateLength * plateWidth * 0.2836;

   $: sheaveHanger = getFromArray(sheaveHangerModel, tables.sheaveHangers);
   $: sheaveHangerPlateLength = crossheadHeight + 3.5 - ((sheave?.diameter ?? 1) / 2 + 5);
   $: sheaveHangerPlateWeight = sheaveHanger.plateWeight(sheaveHangerPlateLength);
   $: sheaveHangerChannelWeight = sheaveHanger.channel.find((nth) => nth.stock).weight;
   $: sheaveHangerWeight = round(sheaveHanger.miscWeight + sheaveHangerChannelWeight + sheaveHangerPlateWeight * 2, 2);

   $: sheaveAsmWeight = (cwtModel !== '235' ? sheaveHangerWeight : 0) + (sheave?.weight ?? 0);
   $: hitchPlateWeight = model?.hitchPlateWeight ?? 0;

   $: ropeMountingWeight = cwtRoping === 1 ? hitchPlateWeight : sheaveAsmWeight;

   // - Weight Calculations
   // NOTE: 6-18-2021 9:44 AM - Tie rod weight = 0.0871 lb / 1 in
   $: minGap = cwtModel !== '235' ? model?.minGap ?? 0 : (sheave?.diameter ?? 0) + 17;
   $: startGap = minGap > 24 ? minGap : 24;

   $: staticStyleWeight = (crossheadHeight + plankHeight + (model?.stileOffset ?? 0)) * stileWeight;
   $: staticTieRodWeight = plankHeight + crossheadHeight + (model?.tieRodOffset ?? 0);

   $: staticWeight =
      ropeMountingWeight +
      crossheadWeight +
      shoeWeight * 4 +
      (useShoePlates ? topShoePlate.weight : 0) * 2 +
      (useShoePlates ? bottomShoePlate.weight : 0) * 2 +
      staticStyleWeight +
      plankWeight +
      bottomEquipWeight;

   $: dynamicWeight = round(cwtWeight - staticWeight, 2);
   // $: gapWeight = gapSectionWeight * startGap;
   // $: stackWeight = dynamicWeight - gapSectionWeight * startGap;
   // $: stackHeight = ceil(stackWeight / steelSectionWeight);

   // $: steelStackHeight = lead ? 0 : stackHeight;

   // $: gapSectionWeight = round((stileWeight + 0.0871) * 2, 2);
   // $: steelSectionWeight = steelFillerWeight + gapSectionWeight;
   // $: leadSectionWeight = leadFillerWeight + gapSectionWeight;

   // - Dom
   $: imgSearchString = [
      cwtModel.match(/\d{3}/)[0],
      cwtRoping > 1 && cwtModel !== '235' ? `-${sheaveHangerModel}` : '',
      blockQty > 0 ? '-block' : '',
      bufferPlate ? '-plate' : '',
      safetyModel !== 'None' ? '-safety' : '',
   ].join('');

   $: imgString = getFromArray(imgSearchString, tables.dimensionImages)?.name ?? getFromArray(cwtModel.match(/\d{3}/)[0], tables.dimensionImages)?.name;

   // -- Select Options
   $: modelOptions = getModelOptions(cwtModels, cwtDBG, cwtWeight, compensation);
   $: sheaveOptions = getSheaveOptions(sheaves, ropeQty, ropeSize, ropePitch);

   // - Reactive Rules
   $: if (save) onSave();

   $: cwtWeight = round(carWeight + capacity * (counterbalance / 100), 2);
   $: cwtHeightCalc = roundInc(crossheadHeight + startGap + steelStackHeight + leadStackHeight + plankHeight + bottomEquipHeight);

   $: if (seismicZone >= 2) useShoePlates = true;

   $: if (['235', '236'].includes(cwtModel) && safetyModel === 'None') {
      bufferPlate = true;
      bottomEquipHeightString = 'Plate';
      bottomEquipHeight = 1;
   }

   $: if (safety?.cwt?.spacers) {
      disableSafetySpacers = true;
      safetySpacers = true;
      bottomEquipHeight = safety.cwt.extLength;
   } else {
      disableSafetySpacers = false;
      bottomEquipHeight = round(safetyHeight + (safetySpacers ? 6 : 0));
   }

   $: if (safetyModel !== 'None') {
      blockQty = 0;
      bufferPlate = false;

      bottomEquipWeight = safetyWeight + (safetySpacers ? block.weight * 2 : 0);
      bottomEquipHeightString = 'Extension Height';
   } else if (bufferPlate) {
      bottomEquipHeightString = 'Plate';
      bottomEquipHeight = 1;
      bottomEquipWeight = plateWeight;
   } else if (blockQty > 0) {
      bottomEquipHeightString = 'Block Height';
      bottomEquipHeight = blockQty * block.height;
      bottomEquipWeight = blockQty * block.weight;
   } else {
      bottomEquipHeight = 0;
      bottomEquipWeight = 0;
   }

   // Events
   const onLink = (event) => dispatch(event.detail.cmd, event.detail.location);

   // Lifecycle
   onMount(() => {
      getEngineeringData(capacity, carSpeed, cwtRoping);
      console.log('workbook', workbook);
   });

   onDestroy(() => onSave());

   // Logs
   $: if (model) console.log('model', model);
   // $: if (safety) console.log('safety', safety);
   // $: if (shoe) console.log('shoe', shoe);
   // $: if (shoePlate) console.log('shoe plate', shoePlate);
   // $: if (sheave) console.log('sheave', sheave);
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

{#if cwtRoping > 1}
   <div class="container">
      <SelectRopes bind:ropePitch bind:ropePitchOverride bind:ropeSize bind:ropeQty on:link={onLink} link={ropeSizeLink} {metric} />

      <Fieldset title="Sheave">
         <Select bind:value={sheaveModel} label="Model">
            {#each sheaveOptions as { value, text, valid } (value)}
               <Option {value} {text} disabled={!valid} selected={sheaveModel === value} />
            {/each}
         </Select>

         {#if cwtModel !== '235'}
            <div transition:slide|local>
               <Select bind:value={sheaveHangerModel} label="Hanger Model">
                  <Option text="341" />
                  <Option text="342" />
               </Select>
            </div>
         {/if}
      </Fieldset>
   </div>
{/if}

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

      {#if ['235', '236'].includes(cwtModel)}
         <div transition:slide|local>
            <Select bind:value={stileChannelName} label="Stile Channel">
               {#each tables.stile235 as { name } (name)}
                  <Option text={name} />
               {/each}
            </Select>
         </div>
      {/if}

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
                     <Checkbox bind:checked={bufferPlate} disabled={['235', '236'].includes(cwtModel)} label="Buffer Plate" />
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
         {#if cwtRoping > 1 && cwtModel !== '235'}
            <div transition:slide|local>
               <InputLength bind:value={sheaveHeight} label="Sheave" />
            </div>
         {/if}

         <InputLength value={crossheadHeight} display label="Top Channel" {metric} />

         <!-- <InputLength value={startGap} display label="Gap" {metric} /> -->

         <InputLength value={steelStackHeight} display label={`${lead ? 'Steel ' : ''}Weight Stack`} {metric} />

         {#if lead}
            <div transition:slide|local>
               <InputLength value={leadStackHeight} display label="Lead Weight Stack" {metric} />
            </div>
         {/if}

         <InputLength value={plankHeight} display label="Bottom Channel" {metric} />

         {#if safetyModel !== 'None' || bufferPlate || blockQty > 0}
            <InputLength value={bottomEquipHeight} display label={bottomEquipHeightString} {metric} />
         {/if}

         <InputLength bind:value={cwtHeight} bind:override={cwtHeightOverride} calc={cwtHeightCalc} label="Overall Height" reset {metric} />
      </div>

      <div class="section-2">
         <img src={`/public/img/counterweight/${imgString}.svg`} alt="Counterweight Dimensions" />
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
