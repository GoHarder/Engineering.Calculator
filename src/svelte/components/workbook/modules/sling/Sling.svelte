<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { slide } from 'svelte/transition';

   import { ceil, floor, round, roundInc } from '../js/math';
   import { inherit } from '../inherit';
   import { getFromArray } from '../js/functions';

   import * as gTables from '../js/tables';
   import * as tables from './tables';

   // Components
   import { Fieldset, InputImage, SelectSafety, SelectShoe, SteelOptions } from '../../common';
   import { Input, InputLength, InputPressure, InputSpeed, InputWeight } from '../../../material/input';
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
            underBeamHeight,
            stilesBackToBack,
            stilesBackToBackOverride,
            model: slingModel,
            stile: slingStile,
            topChannel: slingTopChannel,
            bottomChannel: slingBottomChannel,
            sheaveChannel: slingSheaveChannel,
            sheaveChannelLength: slingSheaveChannelLength,
            channelSpacerLength: slingChannelSpacerLength,
            safetyBlockUp: slingSafetyBlockUp,
            safetyBlockUpLength: slingSafetyBlockUpLength,
            bufferBlockUp: slingBufferBlockUp,
            bufferBlockUpLength: slingBufferBlockUpLength,
            cornerPostSteel,
            compensation,
            strikePlateQty,
            strikePlateOffset,
            braceQty,
            braceQtyOverride,
            outerSheaveMounting,
            plateMounting,
            platformFrontToBalance,
         },
         equipment: {
            railLock,
            carTopWeight,
            doorOperatorWeight,
            miscEquipmentWeight,
            balanceWeight,
            balanceWeightOverride,
            safety: {
               model: safetyModel,
            },
            shoe: {
               model: shoeModel,
            },
         },
         car: {
            dbg: carDBG,
            railSize: carRailSize,
            weight: carWeight,
         },
         plywood: {
            qty: plywoodQty,
            thickness: plywoodThickness,
         },
         finFloor: {
            area: finFloorArea,
            weight: finFloorWeight,
            weightOverride: finFloorWeightOverride,
            materialWeight: finFloorMaterialWeight,
            thickness: finFloorThickness,
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

      const rope = {
         size: ropeSize,
         qty: ropeQty,
         pitch: ropePitch,
         pitchOverride: ropePitchOverride,
         sheave: {
            model: sheaveModel,
            location: sheaveLocation,
            arrangement: sheaveArrangement,
            qty: sheaveQty,
            offset: sheaveOffset,
         },
      };

      if (safetyModel === 'Other') saveData.equipment.safety = { ...saveData.equipment.safety, ...safety };
      if (shoeModel === 'Other') saveData.equipment.shoe = { ...saveData.equipment.shoe, ...shoe };
      if (carRoping > 1) saveData = { ...saveData, rope };

      workbook.modules.sling = { ...workbook.modules.sling, ...saveData };

      saveProject();
   };

   const getEngineeringData = async (capacity, carSpeed) => {
      const res = await fetch(`api/engineering/sling?capacity=${capacity}&carSpeed=${carSpeed}`, {
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => {
         console.log(error);
         return { ok: false };
      });

      if (res.ok) {
         const body = await res.json();

         slingModels = [...body.models];
         topChannels = [...body.topChannels];
         bottomChannels = [...body.bottomChannels];
         sheaveChannels = [...body.sheaveChannels];
         otherChannels = [...body.otherChannels];

         shoes = [...body.shoes];
         shoePlates = [...body.shoePlates];
         safeties = [...body.safeties];
         sheaves = [...body.sheaves];
      } else {
         console.log(res);
      }
   };

   const modulusAtCen = (load, dist, maxStress) => round(0.5 * ((load * dist) / (4 * maxStress)), 2);

   const modulusAtEdgeOffset = (load, dist, maxStress) => round(0.5 * (((load / 2) * dist) / maxStress), 2);

   const modulusatCenOffset = (load, dist, maxStress) => round(0.5 * ((load * 2 * dist) / (4 * maxStress)), 2);

   // - Steel
   const getModelOptions = (models, modulusY, inertiaY, comp, topChannel, bottomChannel) => {
      let selections = [];

      if (models) selections = [...models];

      selections = selections.reduce((array, model) => {
         const validComp = model.comp.includes(comp);
         const validModulus = model.stiles.some((stile) => stile.modulusY >= modulusY);
         const validInertia = model.stiles.some((stile) => stile.inertiaY >= inertiaY);
         let validTopChannel = true;
         let validBottomChannel = true;

         if (topChannel && model?.top) validTopChannel = topChannel === model.top;
         if (bottomChannel && model?.bottom) validBottomChannel = bottomChannel === model.bottom;

         array.push({
            text: model.name,
            disabled: ![validComp, validModulus, validInertia, validTopChannel, validBottomChannel].every((test) => test),
         });
         return array;
      }, []);

      return selections;
   };

   const getStileOptions = (channels, modulusY, inertiaY) => {
      let selections = [];

      if (channels) selections = [...channels];

      selections = selections.reduce((array, channel) => {
         const validModulus = channel.modulusY >= modulusY;
         const validInertia = channel.inertiaY >= inertiaY;

         array.push({
            text: channel.name,
            disabled: ![validModulus, validInertia].every((test) => test),
            stockStatus: channel.stockStatus,
         });
         return array;
      }, []);

      return selections;
   };

   const getChannelOptions = (channels, sectionModulus) => {
      let selections = [];

      if (channels) selections = [...channels];

      selections = selections.reduce((array, channel) => {
         array.push({
            text: channel.name,
            disabled: channel.modulusX < sectionModulus,
            stockStatus: channel.stockStatus,
         });
         return array;
      }, []);

      return selections;
   };

   // - Products

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

   const getShoePlate = (shoePlates, shoe, mounting, railSize) => {
      let output = {
         weight: 25,
         thickness: 0.75,
      };

      if (shoePlates) {
         const plate = [...shoePlates].find((plate) => plate.shoes.includes(shoe));
         const mountsTo = plate?.mountsTo.find((nth) => nth.products.includes(mounting));
         const variant = mountsTo?.variants.find((nth) => nth.railSizes.includes(railSize));

         output = {
            weight: variant?.weight ?? 25,
            thickness: variant?.thickness ?? 0.75,
         };
      }

      return output;
   };

   const getFinFloorWeight = (area, materialWeight) => {
      const platformArea = platformWidth * platformDepth;
      const cabArea = cabWidth * cabDepth;

      return round((area === 'Inside Cab' ? cabArea : platformArea) * materialWeight);
   };

   const invalidChannel = (channel) => (channel?.stockStatus ?? 'Stocked') !== 'Stocked';

   // Constants
   const dispatch = createEventDispatcher();
   const { metric, modules } = workbook;
   const { capacity, carRoping, carSpeed, loading } = modules.globals;
   const { freight, type } = loading;
   const { sling: module } = workbook.modules;
   const modulusOfElasticity = 29000000;

   // Variables

   let carRailSize = module?.car?.railSize ?? '15#';
   let carDBG = module?.car?.dbg ?? 0;

   let slingModel = module?.properties?.model ?? '7T';
   let slingStile = module?.properties?.stile ?? undefined;
   let slingTopChannel = module?.properties?.topChannel ?? undefined;
   let slingBottomChannel = module?.properties?.bottomChannel ?? undefined;
   let slingSheaveChannel = module?.properties?.sheaveChannel ?? undefined;
   let slingSheaveChannelLength = module?.properties?.sheaveChannelLength ?? 0;
   let slingChannelSpacerLength = module?.properties?.channelSpacerLength ?? 0;
   let slingSafetyBlockUp = module?.properties?.safetyBlockUp ?? undefined;
   let slingSafetyBlockUpLength = module?.properties?.safetyBlockUpLength ?? 0;
   let slingBufferBlockUp = module?.properties?.bufferBlockUp ?? undefined;
   let slingBufferBlockUpLength = module?.properties?.bufferBlockUpLength ?? 0;
   let cornerPostSteel = module?.properties?.cornerPostSteel ?? undefined;

   let stilesBackToBack = module?.properties?.stilesBackToBack ?? carDBG - 3;
   let stilesBackToBackOverride = module?.properties?.stilesBackToBackOverride ?? false;
   let underBeamHeight = module?.properties?.underBeamHeight ?? 114;
   let compensation = module?.properties?.compensation ?? 'None';
   let strikePlateQty = module?.properties?.strikePlateQty ?? 1;
   let strikePlateOffset = module?.properties?.strikePlateOffset ?? 19;
   let braceQty = module?.properties?.braceQty ?? 4;
   let braceQtyOverride = module?.properties?.braceQtyOverride ?? false;
   let outerSheaveMounting = module?.properties?.outerSheaveMounting ?? 'Support Plate';
   let plateMounting = module?.properties?.plateMounting ?? undefined;

   let railLock = module?.equipment?.railLock ?? false; // if true then two shoe plates
   let carTopWeight = module?.equipment?.carTopWeight ?? 150;
   let miscEquipmentWeight = module?.equipment?.miscEquipmentWeight ?? 200;
   let doorOperatorWeight = module?.equipment?.doorOperatorWeight ?? 150;
   let balanceWeight = module?.equipment?.balanceWeight ?? 0;
   let balanceWeightOverride = module?.equipment?.balanceWeightOverride ?? false;

   let safetyModel = module?.equipment?.safety?.model ?? '';
   let safetyHeight = module?.equipment?.safety?.height ?? 0;
   let safetyWeight = module?.equipment?.safety?.weight ?? 0;

   let shoeModel = module?.equipment?.shoe?.model ?? '';
   let shoeHeight = module?.equipment?.shoe?.height ?? 0;
   let shoeWeight = module?.equipment?.shoe?.weight ?? 0;

   let ropeSize = module?.rope?.size ?? 0.375;
   let ropeQty = module?.rope?.qty ?? 4;
   let ropePitch = module?.rope?.pitch ?? 0;
   let ropePitchOverride = module?.rope?.pitchOverride ?? false;

   let sheaveModel = module?.rope?.sheave?.model ?? undefined;
   let sheaveLocation = module?.rope?.sheave?.location ?? 'Overslung';
   let sheaveArrangement = module?.rope?.sheave?.arrangement ?? 'Parallel';
   let sheaveQty = module?.rope?.sheave?.qty ?? (carRoping === 1 ? 0 : 1);
   let sheaveOffset = module?.rope?.sheave?.offset ?? 0;

   let plywoodQty = module?.plywood?.qty ?? 0;
   let plywoodThickness = module?.plywood?.thickness ?? 0.25;

   let finFloorArea = module?.finFloor?.area ?? 'Inside Cab';
   let finFloorWeight = module?.finFloor?.weight ?? 0;
   let finFloorWeightOverride = module?.finFloor?.weightOverride ?? false;
   let finFloorMaterialWeight = module?.finFloor?.materialWeight ?? 0;
   let finFloorThickness = module?.finFloor?.thickness ?? 0.25;

   let platformFrontToBalance = module?.properties?.platformFrontToBalance ?? 0;

   // - Inherited Variables
   let apta = inherit(modules, 'platform.apta', 'value') ?? false;
   let platformDepth = inherit(modules, 'platform.platformDepth', 'value') ?? 0;
   let platformIsolation = inherit(modules, 'platform.platformIsolation', 'value') ?? false;
   let platformIsolationWeight = inherit(modules, 'platform.platformIsolationWeight', 'value') ?? false;
   let platformThickness = inherit(modules, 'platform.platformThickness', 'value') ?? 0;
   let platformWeight = inherit(modules, 'platform.platformWeight', 'value') ?? 0;
   let platformWidth = inherit(modules, 'platform.platformWidth', 'value') ?? 0;
   let platformFrontToRail = inherit(modules, 'platform.platformFrontToRail', 'value') ?? 0;

   let cornerPost = inherit(modules, 'platform.cornerPost', 'value');

   let platformThicknessLink = inherit(modules, 'platform.platformThickness', 'module');
   let platformWeightLink = inherit(modules, 'platform.platformWeight', 'module');
   let aptaLink = inherit(modules, 'platform.apta', 'module');

   let cabDepth = inherit(modules, 'platform.cabDepth', 'value') ?? 0;
   let cabWeight = inherit(modules, 'platform.cabWeight', 'value') ?? 0;
   let cabWidth = inherit(modules, 'platform.cabWidth', 'value') ?? 0;

   let door1Weight = inherit(modules, 'platform.door1Weight', 'value') ?? 0;
   let door2Weight = inherit(modules, 'platform.door2Weight', 'value') ?? 0;

   let toeGuard1Weight = inherit(modules, 'platform.toeGuard1Weight', 'value') ?? 0;
   let toeGuard2Weight = inherit(modules, 'platform.toeGuard2Weight', 'value') ?? 0;

   // - Database Information
   let slingModels = undefined;
   let shoes = undefined;
   let shoePlates = undefined;
   let safeties = undefined;
   let sheaves = undefined;
   let topChannels = undefined;
   let bottomChannels = undefined;
   let sheaveChannels = undefined;
   let otherChannels = undefined;

   // - Parts
   let shoe;
   let safety;

   // - Updated By Rules
   let turningMoment = 0;
   let braceQtyCalc = 4;

   // -- Channels
   let topChannelSectionModulus = 0;
   let bottomChannelSectionModulus = 0;
   let sheaveChannelSectionModulus = 0;

   let balanceWeightCalc = 0;

   // - Dom
   let strikePlateOffsetFocused = false;
   let sheaveOffsetFocused = false;
   let sheaveOffsetImage = '';
   let sheaveChannelLabel = '';

   // Reactive Variables
   $: model = getFromArray(slingModel, slingModels);
   $: sheaveConfig = `${sheaveArrangement.charAt(0)}-${sheaveLocation.charAt(0)}`;
   $: designCapacity = capacity * (apta ? 1.5 : 1);

   // - Parts

   $: sheave = getFromArray(sheaveModel, sheaves);
   $: topShoePlate = getShoePlate(shoePlates, shoeModel, slingModel, carRailSize);
   $: bottomShoePlate = getShoePlate(shoePlates, shoeModel, safetyModel, carRailSize);
   $: strikePlate = model?.strikePlate;
   $: gusset = topChannel?.slingGusset;

   $: plywoodWeight = round(platformWidth * platformDepth * plywoodThickness * plywoodQty * 0.02083, 2); // 1" plywood weight = 3 lbs per square foot

   // - Stiles
   $: stileChannel = getFromArray(slingStile, model?.stiles);
   $: stileSectionModulusY = round((turningMoment * underBeamHeight) / (4 * slingDimH * 14000), 2);
   $: stileMomentOfInertiaY = round((turningMoment * underBeamHeight ** 3) / (18 * modulusOfElasticity * slingDimH), 2);
   $: stileLength = roundInc(
      (topChannel?.depth ?? 0) +
         underBeamHeight +
         finFloorThickness +
         plywoodThickness * plywoodQty +
         platformThickness +
         (platformIsolation ? 2 : 0) +
         (bottomChannel?.depth ?? 0) +
         (sheaveConfig === 'P-U' ? sheaveChannel?.depth ?? 0 : 0) +
         (sheaveConfig === 'D-U' ? bufferBlockUpChannel?.depth ?? 0 : 0)
   );
   $: stileWeight = (stileChannel?.weight ?? 0) * stileLength * 2;

   // - Top Channel
   $: topChannel = getFromArray(slingTopChannel, topChannels);
   $: topChannelLength = stilesBackToBack + (stileChannel?.flangeWidth ?? 0) * 2;
   $: topChannelWeight = (topChannel?.weight ?? 0) * topChannelLength * 2;

   // - Bottom Channel
   $: bottomChannel = getFromArray(slingBottomChannel, bottomChannels);
   $: bottomChannelLength = stilesBackToBack + (stileChannel?.flangeWidth ?? 0) * 2;
   $: bottomChannelWeight = (bottomChannel?.weight ?? 0) * bottomChannelLength * 2;

   // - Sheave Channel
   $: sheaveChannel = getFromArray(slingSheaveChannel, sheaveChannels);
   $: sheaveChannelWeight = (sheaveChannel?.weight ?? 0) * slingSheaveChannelLength * 2;

   // - Braces
   $: braceLength = ceil(Math.sqrt((platformDepth / 2 - 10 - (stileChannel?.depth ?? 0) / 2) ** 2 + (underBeamHeight - 39.5) ** 2));
   $: braceWeight = ((stileChannel?.weight ?? 0) >= 1.9 ? 0.5 : 0.375) * 2 * braceLength * 0.2833 * braceQty;
   $: cornerPostBraceMember = getFromArray(cornerPostSteel, tables.cornerPostBraceSteel);
   $: cornerPostBraceLength = roundInc(Math.sqrt(platformWidth ** 2 * platformDepth ** 2));
   $: braceAssemblyWeight = (cornerPost ? cornerPostBraceLength * cornerPostBraceMember.weight : 0) + braceWeight;

   // - Outer Sheave Mounting
   $: reinforcementPlate1Weight = (sheaveChannel?.depth ?? 0) * 2 * 2.55;
   $: outerSheaveChannelWeight = bottomChannelWeight / 2;
   $: supoortPlate = bottomChannelLength * (['7T', '7T-SPL'].includes(slingModel) ? 1.025 : 1.167);
   $: reinforcementPlate2Weight = 14;
   $: plateMountingMember = getFromArray(plateMounting, tables.plateMounting);
   $: plateMountingWeight = bottomChannelLength * (plateMountingMember?.weight ?? 0);
   $: outerSheaveMountingWeight =
      outerSheaveMounting === 'Channel' ? outerSheaveChannelWeight : reinforcementPlate1Weight + supoortPlate + reinforcementPlate2Weight + plateMountingWeight;

   // - Diagonal Underslung Steel
   $: channelSpacerWeight = slingChannelSpacerLength * (bottomChannel?.weight ?? 0) * 2;
   $: safetyBlockUpChannel = getFromArray(slingSafetyBlockUp, otherChannels);
   $: safetyBlockUpWeight = slingSafetyBlockUpLength * (safetyBlockUpChannel?.weight ?? 0) * 2;
   $: bufferBlockUpChannel = getFromArray(slingBufferBlockUp, otherChannels);
   $: bufferBlockUpWeight = slingBufferBlockUpLength * (bufferBlockUpChannel?.weight ?? 0) * 2;

   $: diagonalUnderslungSteelWeight = channelSpacerWeight + safetyBlockUpWeight + bufferBlockUpWeight;

   // - Balance Weights
   $: balanceChannelLength = roundInc(platformWidth - (platformIsolation ? 4 : 1));
   $: balanceChannelWeight = round(balanceChannelLength * 0.9, 2);
   $: balanceWeightMountLength = roundInc(balanceChannelLength - 1.9375);
   $: balanceWeightQty = floor(balanceWeightMountLength / 3);
   $: rowBalanceWeight = round(balanceChannelWeight + balanceWeightQty * 9, 2);
   $: slingMomentWeight = slingWeight - (sheaveConfig === 'P-U' ? outerSheaveMountingWeight : 0) + shoeWeight * 4 + safetyWeight;
   $: distributedWeight =
      platformWeight + cabWeight + carTopWeight + miscEquipmentWeight + finFloorWeight + plywoodWeight + platformIsolationWeight + (sheave?.weight ?? 0) * sheaveQty;

   // Σfy = 0 for beam equilibrium in the Y direction
   // R1 = Reaction at front of platform
   // R2 = Reaction at back of the platform

   // Gather each of the moments
   $: distributedMoment = round(distributedWeight * (platformDepth / 2), 2);
   $: slingMoment = round(slingMomentWeight * platformFrontToRail, 2);
   $: sheaveMountingMoment = (sheaveConfig === 'P-U' ? outerSheaveMountingWeight : 0) * ((sheave?.rimWidth ?? 0) / 2 + 1 + platformFrontToBalance);
   $: door1Moment = (doorOperatorWeight / carRoping + door1Weight) * 9;
   $: door2Moment = (doorOperatorWeight / 2 + door2Weight) * (platformDepth - 9);
   // Toe guard 1 is at R1 so weight * 0 = 0
   $: toeGuard2Moment = toeGuard2Weight * platformDepth;
   $: totalMoments = distributedMoment + slingMoment + sheaveMountingMoment + door1Moment + door2Moment + toeGuard2Moment;

   // Assume R1 = 0 Then solve for R2
   // R2 = Σfy / platformDepth
   // R1 = Total weight - R2
   $: R2 = round(totalMoments / platformDepth, 2);
   $: R1 = round(carNoBalanceWeight - R2, 2);
   $: platformBackToBalance = platformDepth - platformFrontToBalance;

   // Calculate for torque for each end weight * length
   $: TM1 = R1 * platformFrontToBalance;
   $: TM2 = R2 * platformBackToBalance;
   // Cancel each moment out (positive number means its leaning forward)
   $: totalTorque = round(TM1 - TM2, 2);
   $: balanceChannelLocation = totalTorque > 0 ? platformBackToBalance - (door2Weight ? 9.625 : 4.125) : platformFrontToBalance - 9.625;
   $: requiredBalanceWeight = round(Math.abs(totalTorque) / balanceChannelLocation);
   $: balanceWeightError = balanceWeight > round(rowBalanceWeight * 2, 2);

   // - Overall
   $: slingDimH = roundInc(shoeHeight * 2 + (railLock ? 2.5 : 0) + topShoePlate.thickness + stileLength + safetyHeight + bottomShoePlate.thickness);

   // - Weights
   $: slingWeight = round(
      (topChannelWeight +
         stileWeight +
         bottomChannelWeight +
         braceAssemblyWeight +
         sheaveChannelWeight +
         (gusset?.weight ?? 0) * 4 +
         (strikePlate?.weight ?? 0) * strikePlateQty +
         (carRoping === 1 ? 28 : 0) +
         (compensation === 'Chain' ? 50 : 0) +
         (sheaveConfig === 'P-U' ? outerSheaveMountingWeight : 0) +
         (sheaveConfig === 'D-U' ? diagonalUnderslungSteelWeight : 0) +
         (slingModel === '6TS-TD-LD' ? 29.11 : 0) +
         (slingModel === '8TS-TD-LD' ? 278.639 : 0)) *
         1.03,
      2
   );

   $: carNoBalanceWeight = round(
      slingWeight +
         platformWeight +
         toeGuard1Weight +
         toeGuard2Weight +
         cabWeight +
         shoeWeight * 4 +
         carTopWeight +
         miscEquipmentWeight +
         safetyWeight +
         door1Weight +
         door2Weight +
         doorOperatorWeight +
         finFloorWeight +
         plywoodWeight +
         platformIsolationWeight +
         (sheave?.weight ?? 0) * sheaveQty,
      2
   );

   $: carWeight = round(carNoBalanceWeight + balanceWeight, 2);

   $: overallWeight = carWeight + designCapacity;

   // - Overrideable
   $: ropePitchCalc = ropeSize + 0.25;
   $: finFloorWeightCalc = getFinFloorWeight(finFloorArea, finFloorMaterialWeight);
   $: stilesBackToBackCalc = carDBG - 1.5;

   // - Select Options
   $: slingModelOptions = getModelOptions(slingModels, stileSectionModulusY, stileMomentOfInertiaY, compensation, slingTopChannel, slingBottomChannel);
   $: stileOptions = getStileOptions(model?.stiles, stileSectionModulusY, stileMomentOfInertiaY);
   $: topChannelOptions = getChannelOptions(topChannels, topChannelSectionModulus);
   $: bottomChannelOptions = getChannelOptions(bottomChannels, bottomChannelSectionModulus);
   $: sheaveChannelOptions = getChannelOptions(sheaveChannels, sheaveChannelSectionModulus);
   $: otherChannelOptions = getChannelOptions(otherChannels, 0);
   $: sheaveOptions = getSheaveOptions(sheaves, ropeQty, ropeSize, ropePitch);

   // Reactive Rules
   $: if (save) onSave();

   $: if (sheaveConfig === 'P-U') {
      slingSheaveChannelLength = bottomChannelLength;
      sheaveChannelLabel = 'Inner Sheave / Safety Channel';
   } else {
      sheaveChannelLabel = 'Sheave Channels';
      platformFrontToBalance = platformFrontToRail;
   }

   $: if (!cornerPost) {
      if (requiredBalanceWeight < rowBalanceWeight) {
         balanceWeightCalc = round(rowBalanceWeight, 2);
      } else if (requiredBalanceWeight < rowBalanceWeight * 2) {
         balanceWeightCalc = round(rowBalanceWeight * 2, 2);
      } else {
         balanceWeightCalc = round(requiredBalanceWeight, 2);
      }
   }

   $: switch (sheaveConfig) {
      case 'P-O':
         sheaveOffsetImage = '/public/img/sheave-offset-1.svg';
         topChannelSectionModulus = sheaveQty > 1 ? modulusAtEdgeOffset(overallWeight, sheaveOffset, 14000) : modulusAtCen(overallWeight, topChannelLength, 14000);
         bottomChannelSectionModulus =
            strikePlateQty === 1 ? modulusAtCen(overallWeight, bottomChannelLength, 13750) : modulusAtEdgeOffset(overallWeight, strikePlateOffset, 13750);
         sheaveChannelSectionModulus = 0;
         break;

      case 'D-O':
         sheaveOffsetImage = '/public/img/sheave-offset-2.svg';
         topChannelSectionModulus = modulusAtCen(overallWeight, topChannelLength, 14000);
         bottomChannelSectionModulus =
            strikePlateQty === 1 ? modulusAtCen(overallWeight, bottomChannelLength, 13750) : modulusAtEdgeOffset(overallWeight, strikePlateOffset, 13750);
         sheaveChannelSectionModulus = modulusatCenOffset(overallWeight, sheaveOffset, 14000);
         break;

      case 'P-U':
         sheaveOffsetImage = '/public/img/sheave-offset-3.svg';
         topChannelSectionModulus = 0;
         bottomChannelSectionModulus =
            strikePlateQty === 1 ? modulusAtCen(overallWeight, bottomChannelLength, 13750) : modulusAtEdgeOffset(overallWeight, strikePlateOffset, 13750);
         sheaveChannelSectionModulus = modulusAtEdgeOffset(overallWeight, sheaveOffset, 14000);
         break;

      case 'D-U':
         sheaveOffsetImage = '/public/img/sheave-offset-2.svg';
         topChannelSectionModulus = 0;
         bottomChannelSectionModulus = modulusAtCen(overallWeight, bottomChannelLength, 13750);
         sheaveChannelSectionModulus = modulusatCenOffset(overallWeight, sheaveOffset, 14000);
         break;
   }

   $: if (freight) {
      switch (freight) {
         case 'B-Auto':
         case 'B-Truck':
            if ((designCapacity * cabWidth) / 8 > designCapacity * (cabWidth / 2 - 48)) {
               turningMoment = (designCapacity * cabWidth) / 8;
            } else {
               turningMoment = designCapacity * (cabWidth / 2 - 48);
            }
            break;

         case 'C1':
         case 'C2':
         case 'C3':
            turningMoment = (designCapacity * cabWidth) / 4;
            break;

         default:
            // 'None' 'A'

            turningMoment = (designCapacity * cabWidth) / 8;
            break;
      }
   }

   $: if (cornerPost) {
      braceQtyCalc = 2;
   } else if (platformDepth < 121) {
      braceQtyCalc = 4;
   } else if (platformDepth < 228) {
      braceQtyCalc = 8;
   } else {
      braceQtyCalc = 12;
   }

   $: if (slingModel === '6TS-TD-LD') {
      slingTopChannel = 'C10X25';
      slingBottomChannel = 'C10X25';
   }

   $: if (slingModel === '8TS-TD-LD-OH') {
      slingTopChannel = 'MC8X21.4';
      slingBottomChannel = 'MC8X21.4';
   }

   // Events
   const onLink = (event) => dispatch(event.detail.cmd, event.detail.location);

   // Lifecycle
   onMount(() => {
      getEngineeringData(capacity, carSpeed);
   });

   onDestroy(() => onSave());
</script>

<div class="container">
   <Fieldset title="Globals">
      <InputWeight value={capacity} on:link={onLink} label="Capacity" link={{ cmd: 'changePage', location: 'Requirements' }} {metric} />

      <InputSpeed value={carSpeed} on:link={onLink} label="Car Speed" link={{ cmd: 'changePage', location: 'Requirements' }} {metric} />

      <Input value={`${type}${freight !== 'None' ? ` ${freight}` : ''}`} on:link={onLink} label="Loading" link={{ cmd: 'changePage', location: 'Requirements' }} />

      <Input value={`${carRoping}:1`} on:link={onLink} label="Roping" link={{ cmd: 'changePage', location: 'Requirements' }} />
   </Fieldset>

   <Fieldset title="Platform">
      <InputLength bind:value={platformThickness} on:link={onLink} label="Thickness" link={{ cmd: 'changeModule', location: platformThicknessLink }} {metric} />

      <InputWeight bind:value={platformWeight} on:link={onLink} label="Weight" link={{ cmd: 'changeModule', location: platformWeightLink }} step={0.01} {metric} />
   </Fieldset>
</div>

{#if carRoping > 1}
   <div class="container">
      <Fieldset title="Ropes">
         <Input bind:value={ropeQty} label="Quantity" type="number" />

         <Select bind:value={ropeSize} label="Size">
            {#each gTables.ropeSizes as { name, value }}
               <Option text={name} {value} />
            {/each}
         </Select>

         <InputLength bind:value={ropePitch} bind:override={ropePitchOverride} bind:calc={ropePitchCalc} label="Pitch" reset {metric} />
      </Fieldset>

      <Fieldset title="Sheaves">
         <Input bind:value={sheaveQty} label="Quantity" type="number" />

         <Select bind:value={sheaveModel} label="Model">
            {#each sheaveOptions as { value, text, valid } (value)}
               <Option {value} {text} disabled={!valid} selected={sheaveModel === value} />
            {/each}
         </Select>

         {#if sheaveQty > 1}
            <div transition:slide|local>
               <Select bind:value={sheaveArrangement} label="Arrangement">
                  {#each tables.sheaveArrangement as { name } (name)}
                     <Option text={name} />
                  {/each}
               </Select>

               <Select bind:value={sheaveLocation} label="Mounting">
                  {#each tables.sheaveLocation as { name } (name)}
                     <Option text={name} />
                  {/each}
               </Select>

               <InputImage src={sheaveOffsetImage} alt="Strike Plate Offset" focused={strikePlateOffsetFocused}>
                  <InputLength bind:value={sheaveOffset} bind:focused={strikePlateOffsetFocused} label="Sheave Offset" {metric} />
               </InputImage>
            </div>
         {/if}
      </Fieldset>
   </div>
{/if}

<div class="container">
   <Fieldset title="Equipment">
      <InputWeight bind:value={carTopWeight} label="Car Top Weight" {metric} />

      <InputWeight bind:value={doorOperatorWeight} label="Door Operator Weight" {metric} />

      <InputWeight bind:value={miscEquipmentWeight} label="Misc. Equipment Weight" {metric} />

      <InputWeight
         bind:invalid={balanceWeightError}
         bind:value={balanceWeight}
         bind:override={balanceWeightOverride}
         calc={balanceWeightCalc}
         helperText={`Max Balance Weights ${round(rowBalanceWeight * 2, 2)}lbs`}
         label="Balance Weight"
         reset
         step={0.01}
         {metric}
      />

      <Input value={floor(balanceWeight / rowBalanceWeight)} display label="Balance Weight Rows" type="number" />

      {#if ['12#', '15#'].includes(carRailSize)}
         <div transition:slide|local>
            <Checkbox bind:checked={railLock} label="Rail Locks" />
         </div>
      {/if}

      <SelectShoe bind:shoe bind:shoeHeight bind:shoeModel bind:shoeWeight {metric} railSize={carRailSize} {shoes} />

      <SelectSafety bind:safety bind:safetyHeight bind:safetyModel bind:safetyWeight {metric} railSize={carRailSize} {safeties} />

      <InputWeight value={carWeight} display label="Car Weight" {metric} />
   </Fieldset>

   <div class="sub-container">
      <Fieldset title="Finished Flooring">
         <InputLength bind:value={finFloorThickness} label="Thickness" {metric} />

         {#if !finFloorWeightOverride}
            <div transition:slide|local>
               <InputPressure bind:value={finFloorMaterialWeight} label="Material Weight" {metric} />

               <Select bind:value={finFloorArea} label="Area">
                  {#each tables.finFloorArea as { name } (name)}
                     <Option text={name} />
                  {/each}
               </Select>
            </div>
         {/if}

         <InputWeight bind:value={finFloorWeight} bind:override={finFloorWeightOverride} calc={finFloorWeightCalc} label="Weight" reset />
      </Fieldset>

      <Fieldset title="Plywood">
         <Input bind:value={plywoodQty} label="Layers" type="number" />

         {#if plywoodQty > 0}
            <div transition:slide|local>
               <Select bind:value={plywoodThickness} label="Thickness">
                  {#each tables.plywoodThickness as { name, value } (name)}
                     <Option text={name} {value} />
                  {/each}
               </Select>

               <InputWeight bind:value={plywoodWeight} display label="Weight" step={0.01} {metric} />
            </div>
         {/if}
      </Fieldset>
   </div>
</div>

<div class="container">
   <Fieldset title="Properties">
      <Select bind:value={slingModel} label="Model">
         {#each slingModelOptions as { disabled, text } (text)}
            <Option {disabled} {text} selected={slingModel === text} />
         {/each}
      </Select>

      <Checkbox bind:checked={apta} on:link={onLink} link={{ cmd: 'changeModule', location: aptaLink }} label="APTA" />

      <Select bind:value={carRailSize} label="Rail Size">
         {#each gTables.railSizes as { name } (name)}
            <Option text={name} />
         {/each}
      </Select>

      <InputLength bind:value={carDBG} label="D.B.G." {metric} />

      <InputLength bind:value={stilesBackToBack} bind:override={stilesBackToBackOverride} bind:calc={stilesBackToBackCalc} label="Back to Back of Stiles" reset {metric} />

      <InputLength bind:value={underBeamHeight} label="Under Beam Height" {metric} />

      {#if sheaveConfig === 'P-U'}
         <div transition:slide|local>
            <InputLength bind:value={platformFrontToBalance} label="Front of Platform To Sheaves" {metric} />
         </div>
      {/if}

      <Select bind:value={compensation} label="Compensation">
         {#each gTables.compensation as { name } (name)}
            <Option text={name} />
         {/each}
      </Select>

      <InputWeight value={slingWeight} display label="Total Weight" {metric} />
   </Fieldset>

   <Fieldset title="Steel">
      <Select
         bind:value={slingTopChannel}
         disableValidation
         helperText="Channel isn't stocked check with purchasing"
         invalid={invalidChannel(topChannel)}
         label="Top Channels"
      >
         <SteelOptions options={topChannelOptions} selected={slingTopChannel} />
      </Select>

      <Select bind:value={slingStile} disableValidation helperText="Channel isn't stocked check with purchasing" invalid={invalidChannel(stileChannel)} label="Stiles">
         <SteelOptions options={stileOptions} selected={slingStile} />
      </Select>

      <Select
         bind:value={slingBottomChannel}
         disableValidation
         helperText="Channel isn't stocked check with purchasing"
         invalid={invalidChannel(bottomChannel)}
         label="Bottom Channels"
      >
         <SteelOptions options={bottomChannelOptions} selected={slingBottomChannel} />
      </Select>

      {#if sheaveChannelSectionModulus > 0}
         <div transition:slide|local>
            <Select
               bind:value={slingSheaveChannel}
               disableValidation
               helperText="Channel isn't stocked check with purchasing"
               invalid={invalidChannel(sheaveChannel)}
               label={sheaveChannelLabel}
            >
               <SteelOptions options={sheaveChannelOptions} selected={slingSheaveChannel} />
            </Select>

            {#if sheaveConfig === 'P-U'}
               <div transition:slide|local>
                  <Select bind:value={outerSheaveMounting} label="Outer Sheave Mounting">
                     <Option text={'Support Plate'} />
                     <Option text={'Channel'} />
                  </Select>

                  {#if outerSheaveMounting !== 'Channel'}
                     <div transition:slide|local>
                        <Select bind:value={plateMounting} label="Plate Mounting">
                           {#each tables.plateMounting as { name }}
                              <Option text={name} />
                           {/each}
                        </Select>
                     </div>
                  {/if}
               </div>
            {:else}
               <div transition:slide|local>
                  <InputLength bind:value={slingSheaveChannelLength} label="Sheave Channel Length" {metric} />
               </div>
            {/if}

            {#if sheaveConfig === 'D-U'}
               <div transition:slide|local>
                  <InputLength bind:value={slingChannelSpacerLength} label="Channel Spacer Length" {metric} />

                  <Select
                     bind:value={slingSafetyBlockUp}
                     disableValidation
                     helperText="Channel isn't stocked check with purchasing"
                     invalid={invalidChannel(safetyBlockUpChannel)}
                     label="Safety Block Up"
                  >
                     <SteelOptions options={otherChannelOptions} selected={slingSafetyBlockUp} />
                  </Select>

                  <InputLength bind:value={slingSafetyBlockUpLength} label="Safety Block Up Length" {metric} />

                  <Select
                     bind:value={slingBufferBlockUp}
                     disableValidation
                     helperText="Channel isn't stocked check with purchasing"
                     invalid={invalidChannel(bufferBlockUpChannel)}
                     label="Buffer Block Up"
                  >
                     <SteelOptions options={otherChannelOptions} selected={slingBufferBlockUp} />
                  </Select>

                  <InputLength bind:value={slingBufferBlockUpLength} label="Buffer Block Up Length" {metric} />
               </div>
            {/if}
         </div>
      {/if}

      {#if !cornerPost}
         <div transition:slide|local>
            <Input bind:value={braceQty} bind:override={braceQtyOverride} bind:calc={braceQtyCalc} label="Brace Quantity" type="number" reset />
         </div>
      {:else}
         <div transition:slide|local>
            <Select bind:value={cornerPostSteel} label="Brace Steel">
               {#each tables.cornerPostBraceSteel as { name }}
                  <Option text={name} />
               {/each}
            </Select>
         </div>
      {/if}

      <Input bind:value={strikePlateQty} label="Strike Plate Quantity" min={1} max={10} type="number" />

      {#if strikePlateQty > 1}
         <div transition:slide|local>
            <InputImage src="/public/img/strike-plate.svg" alt="Strike Plate Offset" focused={sheaveOffsetFocused}>
               <InputLength bind:value={strikePlateOffset} bind:focused={sheaveOffsetFocused} label="Strike Plate Offset" {metric} />
            </InputImage>
         </div>
      {/if}
   </Fieldset>
</div>

<style lang="scss">
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
   }

   .sub-container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      flex-basis: calc(calc(800px - 100%) * 10000);
      flex-grow: 1;
      max-width: 1000px;
      min-width: 410px;
   }
</style>
