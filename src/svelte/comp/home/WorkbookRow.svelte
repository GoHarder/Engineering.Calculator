<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // SMUI Components
   import Icon from '@smui/textfield/icon/index';
   import { Row, Cell } from '@smui/data-table';
   import Chip from '@smui/chips';
   import IconButton from '@smui/icon-button';
   import Menu from '@smui/menu';
   import List, { Item, Text } from '@smui/list';

   // Properties
   export let _id = '';
   export let contract = '';
   export let jobName = '';
   export let carNo = '';
   export let customer = '';
   export let layout = '';
   export let created = 0;
   export let opened = 0;
   export let creator = '';

   // Methods
   const getDateString = (number) => {
      if (number) {
         return new Date(number).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
         });
      } else {
         return 'N/A';
      }
   };

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let menu;

   // Reactive Variables
   $: initials = creator.replace(/(\b[a-zA-Z])[a-zA-Z]* ?/g, '$1');

   // Events
   const select = () => {
      console.log('TODO: 2-09-2021 3:12 PM - hook up select button');
      dispatch('select', _id);
   };

   const remove = () => {
      console.log('TODO: 2-09-2021 3:21 PM - hook up delete button');
      dispatch('delete', _id);
   };

   const share = () => {
      console.log('TODO: 2-09-2021 3:22 PM = hook up share button');
      dispatch('share', _id);
   };
</script>

<Row>
   <Cell on:click={select} style="text-align: center" title={contract}>{contract}</Cell>
   <Cell on:click={select} style="text-align: center" title={jobName}>{jobName}</Cell>
   <Cell on:click={select} style="text-align: center" title={carNo}>{carNo}</Cell>
   <Cell on:click={select} style="text-align: center" title={customer}>{customer}</Cell>
   <Cell on:click={select} style="text-align: center" title={layout}>{layout}</Cell>
   <Cell on:click={select} style="text-align: center">{getDateString(created)}</Cell>
   <Cell on:click={select} style="text-align: center">{getDateString(opened)}</Cell>
   <Cell on:click={select} style="text-align: center">
      <Chip title={creator}>{initials}</Chip>
   </Cell>

   <div class="dropdown">
      <IconButton class="material-icons" on:click={() => menu.setOpen(true)}>more_vert</IconButton>
      <div class="dropdown-content">
         <Menu anchor={false} bind:this={menu}>
            <List>
               <Item on:SMUI:action={remove}>
                  <Icon class="material-icons">delete</Icon>
                  <Text>Delete</Text>
               </Item>
               <Item on:SMUI:action={share}>
                  <Icon class="material-icons">share</Icon>
                  <Text>Share</Text>
               </Item>
            </List>
         </Menu>
      </div>
   </div>
</Row>

<style>
   .dropdown {
      position: relative;
      display: inline-block;
   }
   .dropdown-content {
      display: block;
      position: absolute;

      transform-origin: left top;
      left: -112px;
      top: 0px;
      max-height: 945px;
   }
</style>
