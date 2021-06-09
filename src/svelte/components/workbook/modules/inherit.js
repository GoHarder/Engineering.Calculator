/**
 * Handles inheritance between modules
 * @param {object} modules The calculator modules
 * @param {string} search The variable to search for
 * @param {string} data The data that is requested
 */
export const inherit = (modules, search, data) => {
   search = search.split('.');
   const variable = [...lib[search[0]][search[1]]];
   const order = [];

   variable.forEach((branch) => {
      const obj = {
         module: branch.module,
         value: eval(branch.value),
      };
      order.push(obj);
   });

   let output = order.find((branch) => branch.module in modules)?.[data];

   if (data === 'module' && output) output = output.replace(/([a-z]+)/, (match) => `${match.charAt(0).toUpperCase()}${match.slice(1)}`);

   return output;
};

const lib = {
   platform: {
      apta: [{ module: 'platform', value: 'modules?.platform?.apta' }],
      cabDepth: [{ module: 'platform', value: 'modules?.platform?.cab?.depth' }],
      cabWeight: [{ module: 'platform', value: 'modules?.platform?.cab?.weight' }],
      cabWidth: [{ module: 'platform', value: 'modules?.platform?.cab?.width' }],
      cornerPost: [{ module: 'platform', value: 'modules?.platform?.properties?.cornerPost' }],
      door1Weight: [{ module: 'platform', value: 'modules?.platform?.doors?.door1?.weight' }],
      door2Weight: [{ module: 'platform', value: 'modules?.platform?.doors?.door2?.weight' }],
      platformDepth: [{ module: 'platform', value: 'modules?.platform?.properties?.depth' }],
      platformFrontToRail: [{ module: 'platform', value: 'modules?.platform?.properties?.frontToRail' }],
      platformIsolation: [{ module: 'platform', value: 'modules?.platform?.properties?.isolation' }],
      platformIsolationWeight: [{ module: 'platform', value: 'modules?.platform?.properties?.isolationWeight' }],
      platformThickness: [{ module: 'platform', value: 'modules?.platform?.properties?.thickness' }],
      platformWeight: [{ module: 'platform', value: 'modules?.platform?.properties?.weight' }],
      platformWidth: [{ module: 'platform', value: 'modules?.platform?.properties?.width' }],
      toeGuard1Weight: [{ module: 'platform', value: 'modules?.platform?.doors?.toeGuard1?.weight' }],
      toeGuard2Weight: [{ module: 'platform', value: 'modules?.platform?.doors?.toeGuard2?.weight' }],
   },
   sling: {
      carWeight: [{ module: 'sling', value: 'modules?.sling?.car?.weight' }],
      compensation: [{ module: 'sling', value: 'modules?.sling?.properties?.compensation' }],
      ropePitch: [{ module: 'sling', value: 'modules?.sling?.rope?.pitch' }],
      ropePitchOverride: [{ module: 'sling', value: 'modules?.sling?.rope?.pitchOverride' }],
      ropeQty: [{ module: 'sling', value: 'modules?.sling?.rope?.qty' }],
      ropeSize: [{ module: 'sling', value: 'modules?.sling?.rope?.size' }],
   },
};
