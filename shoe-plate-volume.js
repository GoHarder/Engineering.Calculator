const sin = (deg) => Math.sin((deg * Math.PI) / 180);

const round = (value, decimals = 0) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

const frustumVolume = (holeDia) => {
   const smallRadius = (holeDia + 0.0625) / 2;
   const height = ((holeDia - smallRadius) * sin(49)) / sin(41);
   return {
      volume: (Math.PI / 3) * height * (smallRadius ** 2 + smallRadius * holeDia + holeDia ** 2),
      height,
   };
};

const cylinderVolume = (holeDia, height) => Math.PI * height * (holeDia / 2) ** 2;

const railNotchVolume = (railSize, thickness) => {
   const notchAreas = [
      { railSize: '6.25#', area: 1.18373 },
      { railSize: '8#', area: 1.43373 },
      { railSize: '11#', area: 1.68373 },
      { railSize: '12#', area: 1.93373 },
      { railSize: '15#', area: 2.18373 },
      { railSize: '18.5#', area: 2.4571675 },
      { railSize: '22.5#', area: 3.27748 },
      { railSize: '30#', area: 3.9571675 },
   ];

   return notchAreas.find((notch) => notch.railSize === railSize).area * thickness;
};

const thruHoleDiameter = (size) => eval(size.replace(/-\d{2}\sUNC/, ''));
const threadedHoleDiameter = (size) => {
   const sizes = [
      { name: '1/2-13 UNC', diameter: 0.417 },
      { name: '5/8-11 UNC', diameter: 0.528 },
      { name: '3/4-10 UNC', diameter: 0.642 },
   ];

   return sizes.find((nth) => nth.name === size).diameter;
};

// 7.850 g/cm^3 ASTM A36 density
// 0.2835992 lb/in^3

const plate = {
   name: '373-022',
   shoes: ['ELSCO E'],
   railSizes: ['8#'],
   mountsTo: ['540'],
   boltQty: 2,
   cenToShoe: 2.25,
   railToShoe: 2.4375,
   mountToShoe: 0,
   shoeBoltSize: '1/2-13 UNC',
   mountBoltSize: '5/8-11 UNC',
   railToFront: 1.25,
   cenToMount: 3.75,
   railToMount: 2.75,
   mountToMount: 3.5,
   railToBack: 7.75,
   width: 0.625,
   thickness: 0.5,
};

const getVolume = (plate, shoeHoleQty, mountHoleQty, countersink) => {
   const { width, railToFront, railToBack, thickness, railSizes, shoeBoltSize, mountBoltSize } = plate;
   const railSize = railSizes[0];

   const blankVolume = (railToFront + railToBack) * width * thickness;
   const notchVolume = railNotchVolume(railSize, thickness);

   return round(blankVolume - notchVolume, 4);
};

const getWeight = (plate) => {
   const volume = getVolume(plate);

   return round(volume * 0.2835992, 4);
};

console.log(getWeight(plate));
