<script>
   // Project Components
   import WorkbookTable from './WorkbookTable.svelte';
   import Search from './Search.svelte';

   // Parameters
   export let firstName = '';
   export let lastName = '';

   const workbooks = [
      {
         _id: 1,
         contract: '435180',
         job: 'VMAC Tuskegee, Bldg. 120',
         customer: 'Diversified Elevator Service',
         layout: 'L-8293',
         created: 1602478800000,
         opened: 1611554400000,
         user: 'Gregory Harder',
         car: 'P1',
      },
      {
         _id: 2,
         contract: '423741',
         job: 'Exchange Place Station',
         customer: 'Mid-American Elevator',
         layout: 'L-8143',
         created: 1602565200000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: '55',
      },
      {
         _id: 3,
         contract: '420993',
         job: 'James A. Haley VAMC Tampa Bed Tower',
         customer: 'Skyline Elevator',
         layout: 'L-8110-2',
         created: 1602565200000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: '42',
      },
      {
         _id: 4,
         contract: '418833',
         job: '33-02 Skillman Avenue',
         customer: 'Liberty Elevator',
         layout: 'L-8069',
         created: 1602478800000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: 'A2',
      },
      {
         _id: 5,
         contract: '419777',
         job: 'Space X Cape Canaveral',
         customer: 'Otis Elevator',
         layout: 'L-8089',
         created: 1602478800000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: '1',
      },
      {
         _id: 6,
         contract: '452140',
         job: 'Purdue Gateway',
         customer: 'American Elevator',
         layout: 'L-8527-1',
         created: 1602478800000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: '3',
      },
      {
         _id: 7,
         contract: '451668',
         job: '111 Canal Street',
         customer: 'Anderson Elevator Company',
         layout: 'L-8522',
         created: 1602478800000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: 'S2',
      },
      {
         _id: 8,
         contract: '446104',
         job: 'West Virginia Building 5 Freight',
         customer: 'West Virginia Elevator',
         layout: 'L-8452',
         created: 1602478800000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: '6',
      },
      {
         _id: 9,
         contract: '451008A',
         job: 'WRNMMD P114 Med. Ctr.',
         customer: 'Delaware Elevator',
         layout: 'L-8517-6',
         created: 1602478800000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: 'H1 H2',
      },
      {
         _id: 10,
         contract: '420520',
         job: 'WCK2-A',
         customer: 'Lift Solutions',
         layout: 'L-8098',
         created: 1602478800000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: 'FE-1',
      },
      {
         _id: 11,
         contract: '418879',
         job: 'JW Marriot Tampa West Lot',
         customer: 'Lift Solutions',
         layout: 'L-8071',
         created: 1602478800000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: 'BSE-3',
      },
      {
         _id: 12,
         contract: '445562',
         job: 'Emory HSRB II',
         customer: 'Premier Elevator',
         layout: 'L-8441-3',
         created: 1602478800000,
         opened: 1602738000000,
         user: 'Gregory Harder',
         car: '4',
      },
   ];
</script>

<main>
   <div>
      <div>
         <h5>Hi {`${firstName} ${lastName}`},</h5>
         <h6 class="title-1">
            Welcome to the
            <span>Hollister-Whitney Engineering Calculator</span>
         </h6>
      </div>
      <h6 class="title-2">
         Select an existing
         <strong>Workbook</strong>
         from the list below or click the
         <strong>Create New Workbook</strong>
         button
      </h6>
      <Search />
      <WorkbookTable {workbooks} />
   </div>
</main>

<style lang="scss">
   main {
      margin-bottom: 30px;
      padding: 16px;
      display: flex;
      flex-grow: 1;
      justify-content: center;
   }

   h5 {
      color: #676767;
      font: {
         size: 30px;
         weight: 400;
      }
      line-height: 1.334;
      margin: 0;
   }

   .title-1 {
      color: #343434;
      font: {
         size: 24px;
         weight: 500;
      }
      line-height: 1.6;
      margin: 0;
      span {
         font-weight: 600;
      }
   }

   .title-2 {
      color: #343434;
      font: {
         size: 16px;
         weight: 500;
      }
      line-height: 1.57;
      margin: 0 {
         top: 8px;
      }
   }
</style>
