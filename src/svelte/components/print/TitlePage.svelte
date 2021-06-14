<script>
   // Components
   import Page from './Page.svelte';
   import { floor, roundInc } from '../../../js/math';

   // Properties
   export let firstName = '';
   export let lastName = '';
   export let workbook = {};

   // Constants
   const globals = workbook.modules.globals;
   const date = Date.now();
   const overallTravelFt = floor(globals.overallTravel / 12);
   const overallTravelIn = roundInc(globals.overallTravel % 12);
</script>

<Page>
   <img src="/public/img/vantage-logo.svg" alt="Vantage" class="logo" />

   <div class="title">
      <h2>{workbook.jobName}</h2>
      <h2>{`Car ${workbook.carNo}`}</h2>
      <h2>{`for ${workbook.customer}`}</h2>
      <h3>
         {workbook.contract ? `Contract: ${workbook.contract}` : ''}
         {workbook.contract && workbook.layout ? ' - ' : ''}
         {workbook.layout ? `Layout: ${workbook.layout}` : ''}
      </h3>
   </div>

   <div class="sub-title">
      <h3 class="name">{`${firstName} ${lastName}`}</h3>
      <h3>{new Date(date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
   </div>

   <table>
      <thead>
         <tr>
            <th colspan="2">Job Summary</th>
         </tr>
      </thead>
      <tbody>
         <tr>
            <td>Governing Code:</td>
            <td>{globals.code}</td>
         </tr>
         <tr>
            <td>Loading:</td>
            <td>{`${globals.loading.type}${globals.loading.freight !== 'None' ? ` ${globals.loading.freight}` : ''}`}</td>
         </tr>
         <tr>
            <td>Capacity:</td>
            <td>{`${globals.capacity} lbs`}</td>
         </tr>
         <tr>
            <td>Speed:</td>
            <td>{`${globals.carSpeed} ft/min`}</td>
         </tr>
         <tr>
            <td>Overall Travel:</td>
            <td>{`${overallTravelFt}' - ${overallTravelIn}"`}</td>
         </tr>
         <tr>
            <td>Seismic Zone:</td>
            <td>{globals.seismic.zone}</td>
         </tr>
      </tbody>
   </table>

   <img src="/public/img/triangle.png" alt="A yellow triangle" class="triangle" />
</Page>

<style lang="scss">
   .logo {
      width: 2in;
      margin: 0.25in 0.25in;
   }

   .triangle {
      position: absolute;
      bottom: 0;
      right: 0.25in;
   }

   .title {
      text-align: center;
      margin: 1.125in 0.25in 0;
      border: 2.5px solid black;
   }

   .sub-title {
      margin-top: 0.5in;
      text-align: center;
      & h3 {
         margin: 0;
      }
   }

   table {
      margin: 1in auto;
      border-spacing: 1.5rem 0.25rem;
      border-collapse: collapse;
   }

   thead {
      border-bottom: 2px solid black;
   }
   tbody {
      tr {
         td {
            padding: 5px 1rem;
         }
      }
   }
</style>
