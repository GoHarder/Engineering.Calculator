<script>
   import { createEventDispatcher, onDestroy } from 'svelte';

   // Components
   import A from '../../common/A.svelte';
   import ProjectTab from '../common/ProjectTab.svelte';
   import { Button, Label } from '../../material/button';
   import { ArrowForwardIos } from '../../material/button/icons';
   import { HelperText, Input } from '../../material/input';
   import { Checkbox } from '../../material/checkbox';
   import { Content, Dialog, Actions } from '../../material/dialog';

   // Stores
   import projectStore from '../../../stores/project';

   // Properties
   export let _id = '';

   // Constants
   const activeTab = 1;
   const dispatch = createEventDispatcher();

   // Variables
   let creator = _id;
   let contract = '';
   let jobName = '';
   let carNo = '';
   let customer = '';
   let layout = '';
   let metric = false;
   let created = new Date();
   let opened = [];
   let modules = {};
   let temp = false;

   let invalidLayout;
   let invalidContract;
   let openJobNameDialog = false;
   let openCustomerDialog = false;
   let okJobName = false;
   let okCustomer = false;

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      // console.log('Project Summary', store);

      if (Object.keys(store).length > 1) {
         const project = { ...store };
         carNo = project.carNo;
         contract = project.contract;
         created = project.created;
         creator = project.creator;
         customer = project.customer;
         jobName = project.jobName;
         layout = project.layout;
         metric = project.metric;
         modules = project.modules;
         opened = project.opened;
         temp = project.temp;

         const search = opened.findIndex((user) => creator === user.userId);

         if (search >= 0) {
            opened[search].time = new Date();
         } else {
            opened.push({ userId: creator, time: created });
         }
      }
   });

   // Reactive Variables
   $: validForm = [!invalidLayout, !invalidContract].every((test) => test);
   $: checkJobName = jobName.match(/[a-z]/);
   $: checkCustomer = customer.match(/[a-z]/);

   // Reactive Rules
   $: if (okJobName && okCustomer) {
      dispatch('changePage', 'Requirements');
   }

   // Events
   const onHome = () => dispatch('changePage', 'Home');

   const onNext = () => {
      if (checkJobName && checkCustomer) dispatch('changePage', 'Requirements');

      if (!checkJobName) openJobNameDialog = true;

      if (!checkCustomer) openCustomerDialog = true;
   };

   const onOkJobName = () => {
      okJobName = true;
      openJobNameDialog = false;
   };

   const onOkCustomer = () => {
      okCustomer = true;
      openCustomerDialog = false;
   };

   // Lifecycle
   onDestroy(() => {
      layout = layout.toUpperCase();

      projectStore.save('project', { carNo, contract, created, creator, customer, jobName, layout, metric, modules, opened, temp, notes: [] });

      clearProject();
   });
</script>

<Dialog bind:open={openJobNameDialog}>
   <Content>Are you sure the job name is in all caps?</Content>
   <Actions>
      <Button on:click={() => (openJobNameDialog = false)} class="mdc-dialog__button" color="secondary" variant="outlined">
         <Label>No</Label>
      </Button>
      <Button on:click={onOkJobName} class="mdc-dialog__button" variant="contained">
         <Label>Yes</Label>
      </Button>
   </Actions>
</Dialog>

<Dialog bind:open={openCustomerDialog}>
   <Content>Are you sure the customer name is in all caps?</Content>
   <Actions>
      <Button on:click={() => (openCustomerDialog = false)} class="mdc-dialog__button" color="secondary" variant="outlined">
         <Label>No</Label>
      </Button>
      <Button on:click={onOkCustomer} class="mdc-dialog__button" variant="contained">
         <Label>Yes</Label>
      </Button>
   </Actions>
</Dialog>

<main>
   <div class="head">
      <A on:click={onHome}>Home</A>
      <div class="title">
         <i class="material-icons">engineering</i>
         <h6>Configuration</h6>
      </div>
   </div>

   <div class="paper n1">
      <div class="tabs">
         <ProjectTab label="Project Summary" index={1} {activeTab} />
         <ProjectTab on:click={onNext} label="Requirements" index={2} {activeTab} />
         <ProjectTab label="Calculation Modules" index={3} {activeTab} />
      </div>

      <div class="form">
         <p>Enter the project details and proceed to the next step</p>
         <div class="form-box">
            <div class="box">
               <Input bind:value={contract} bind:invalid={invalidContract} label="Contract" pattern={'\\d{6,}'}>
                  <span slot="helperText">
                     <HelperText validation>Invalid Contract Number</HelperText>
                  </span>
               </Input>
            </div>
            <div class="box">
               <Input bind:value={jobName} label="Job Name" />
            </div>
            <div class="box">
               <Input bind:value={carNo} label="Car Number" />
            </div>
            <div class="box">
               <Input bind:value={customer} label="Customer" />
            </div>
            <div class="box">
               <Input bind:value={layout} bind:invalid={invalidLayout} label="Layout Number" pattern="^(L|l)-[\d-]+$">
                  <span slot="helperText">
                     <HelperText validation>Invalid Layout Number</HelperText>
                  </span>
               </Input>
            </div>
            <div class="box">
               <Checkbox bind:checked={metric} label="Show Metric Units" />
            </div>
            <div class="box">
               <Checkbox bind:checked={temp} label="Temporary Workbook" />
            </div>
         </div>
      </div>
   </div>
   <div class="paper n2">
      <Button on:click={onNext} disabled={!validForm} variant="contained">
         <Label>Next</Label>
         <ArrowForwardIos />
      </Button>
   </div>
</main>

<style lang="scss">
   @import './src/scss/vantage-theme';

   main {
      padding: 16px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
   }
   .head {
      padding-bottom: 16px;
   }
   .title {
      display: flex;
      align-items: center;
      h6 {
         font: {
            weight: 600;
            size: 1.25rem;
         }
         line-height: 1.6;
         margin: 0 0 0 8px;
      }
   }

   .paper {
      @include vantage-paper;
      &.n1 {
         @include vantage-border;
         padding: 0 0 16px;
      }
      &.n2 {
         margin-top: 4px;
         padding: 16px;
         display: flex;
         justify-content: flex-end;
      }
   }

   .tabs {
      background-color: #f5f5f5;
      display: flex;
      padding: 16px 16px 0;
   }
   .form {
      padding: 16px;
      height: calc(100vh - 400px);
      overflow-y: auto;
   }
   p {
      padding: 0 30px;
   }
   .form-box {
      display: flex;
      flex-wrap: wrap;
      padding: 0 48px;
   }

   .box {
      flex-grow: 1;
      max-width: 100%;
      flex-basis: 100%;
      padding: 16px 16px 0;
   }

   @media (min-width: 786px) {
      main {
         padding: 16px;
      }
      .box {
         max-width: 50%;
         flex-basis: 50%;
      }
   }

   @media (min-width: 1600px) {
      main {
         max-width: 1600px;
      }
      .box {
         max-width: calc(100% / 3);
         flex-basis: calc(100% / 3);
      }
   }
</style>
