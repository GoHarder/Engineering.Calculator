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

const getVolume = (plate, shoeHoleQty, mountHoleQty, countersink) => {
   const { width, railToFront, railToBack, thickness, railSizes, shoeBoltSize, mountBoltSize } = plate;
   const railSize = railSizes[0];

   const blankVolume = (railToFront + railToBack) * width * thickness;
   const notchVolume = railNotchVolume(railSize, thickness);

   return round(blankVolume - notchVolume, 4);
};

const getWeight = (plate) => {
   const volume = getVolume(plate);

   return round(volume * 0.2835992, 3);
};

// console.log(getWeight(plate));

const railData = [
   { railSize: '6.25#', width: 1, length: 1.1875, area: 1.18373 },
   { railSize: '8#', width: 1, length: 1.4375, area: 1.43373 },
   { railSize: '11#', width: 1, length: 1.6875, area: 1.68373 },
   { railSize: '12#', width: 1, length: 1.9375, area: 1.93373 },
   { railSize: '15#', width: 1, length: 2.1875, area: 2.18373 },
   { railSize: '18.5#', width: 1.125, length: 2.1875, area: 2.4571675 },
   { railSize: '22.5#', width: 1.5, length: 2.1875, area: 3.27748 },
   { railSize: '30#', width: 1.625, length: 2.4375, area: 3.9571675 },
];

const shoe = {
   name: '377',
   width: 7.1875,
   baseWidth: 5.1875,
   height: 6.97,
   railToBack: 5.625,
   boltQty: 4,
   cenToMount: 1.625,
   railToMount: 2.625,
   mountToMount: 2,
   boltSize: '5/8-11 UNC',
   weight: 11.86,
   maxCapacity: 2000,
   maxSpeed: 300,
   manufacturer: 'Hollister-Whitney',
   railSizes: ['8#', '11#', '12#', '15#', '18.5#'],
   railContactHeight: 5.344,
};

var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0) - now;
if (millisTill10 < 0) {
   millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}
setTimeout(function () {
   alert("It's 10am!");
}, millisTill10);

const toNextTime = (hour = 0, min = 0, sec = 0, callback) => {
   const now = new Date();
   let toNextPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min, sec, 0) - now;
   if (toNextPeriod < 0) toNextPeriod += 86400000;

   setTimeout(function () {
      setInterval(() => {
         callback();
      }, 1000);
   }, toNextPeriod);
};

toNextTime(13, 25, 0, () => {
   console.log('Ding!');
});
