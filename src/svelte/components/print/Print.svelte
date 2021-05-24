<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { floor, roundInc } from '../../../js/math';

   // Properties
   export let firstName = '';
   export let lastName = '';

   // Stores
   import projectStore from '../../stores/project';

   // Constants
   const dispatch = createEventDispatcher();
   const date = Date.now();

   // Variables
   let workbook = undefined;
   let title = 'Engineering Calculator';

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => (workbook = store));

   // Reactive Variables
   $: globals = workbook?.modules?.globals;
   $: overallTravelFt = floor(globals.overallTravel / 12);
   $: overallTravelIn = roundInc(globals.overallTravel % 12);

   // Reactive Rules
   if (workbook.contract) {
      title = [
         `${workbook.customer}${workbook.customer ? ' -' : ''}`,
         `${workbook.contract ? '#' : ''}${workbook.contract}${workbook.contract ? ' -' : ''}`,
         `${workbook.layout ? '#' : ''}${workbook.layout}${workbook.layout ? ' -' : ''}`,
         `${firstName.charAt(0)}${lastName.charAt(0)}`,
      ].join(' ');
   }

   // Events
   const onAfterPrint = () => dispatch('changePage', 'Workbook');
   const noScroll = () => window.scrollTo(0, 0);

   // Lifecycle
   onMount(() => {
      console.log(workbook);
      window.addEventListener('afterprint', onAfterPrint);
      window.addEventListener('scroll', noScroll);
      setTimeout(() => {
         window.print();
      }, 3000);
   });

   onDestroy(() => {
      window.removeEventListener('scroll', noScroll);
      clearProject();
   });
</script>

<svelte:head>
   <title>{title}</title>
</svelte:head>

<div class="scrim">
   <div class="scrim-frame">
      <img src="public/img/loading.gif" alt="Loading" />
   </div>
</div>

<div class="page page-1">
   <div class="title">
      <img class="logo-img" src="public/img/vantage-logo.png" alt="Vantage Logo" />
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
</div>

<div class="page">
   <p>Nice title page isn't it!</p>
   <p>You think if a title page exists that there would be more pages.</p>
   <p>Unfortunately, for you, this is not the case.</p>
   <hr />
   <p>Here is another random picture for you.</p>

   <img src="https://source.unsplash.com/random/500x500" alt="Something random" />
</div>

<style lang="scss" global>
   .scrim {
      height: 100vh;
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      img {
         margin: 0 auto;
      }
   }

   @media print {
      .scrim {
         display: none;
      }
      .page {
         page-break-after: always;

         &-1 {
            border: 5px double black;
            height: 99vh;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            .title {
               text-align: center;
               border-bottom: 2.5px solid black;
               padding-bottom: 0.5rem;
               & h2,
               h3 {
                  margin: 1rem 0 0;
               }
            }
            .sub-title {
               margin-top: 1rem;
               text-align: center;
               & h3 {
                  margin: 0;
               }
            }

            .logo-img {
               width: 250px;
               border: none;
               display: block;
               max-width: 100%;
               margin: 0 auto 4rem;
            }
            table {
               margin-top: 3rem;
               border-spacing: 1.5rem 0.25rem;
            }
         }
      }
   }
</style>
