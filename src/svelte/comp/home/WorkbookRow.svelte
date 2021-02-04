<script>
   // SMUI Components
   import Icon from '@smui/textfield/icon/index';
   import { Row, Cell } from '@smui/data-table';
   import Chip from '@smui/chips';
   import IconButton from '@smui/icon-button';
   import Menu from '@smui/menu';
   import { Anchor } from '@smui/menu-surface';
   import List, { Item, Text } from '@smui/list';

   // Properties
   export let _id = '';
   export let contract = '';
   export let job = '';
   export let car = '';
   export let customer = '';
   export let layout = '';
   export let created = 0;
   export let opened = 0;
   export let user = '';

   // Variables
   let menu;

   // Reactive Variables
   $: initials = user.replace(/(\b[a-zA-Z])[a-zA-Z]* ?/g, '$1');

   // Methods
   const getDateString = (number) => {
      return new Date(number).toLocaleDateString(undefined, {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
      });
   };
</script>

<Row on:click>
   <Cell style="text-align: center" title={contract}>{contract}</Cell>
   <Cell style="text-align: center" title={job}>{job}</Cell>
   <Cell style="text-align: center" title={car}>{car}</Cell>
   <Cell style="text-align: center" title={customer}>{customer}</Cell>
   <Cell style="text-align: center" title={layout}>{layout}</Cell>
   <Cell style="text-align: center">{getDateString(created)}</Cell>
   <Cell style="text-align: center">{getDateString(opened)}</Cell>
   <Cell style="text-align: center">
      <Chip title={user}>{initials}</Chip>
   </Cell>

   <div class="dropdown">
      <IconButton class="material-icons" on:click={() => menu.setOpen(true)}>more_vert</IconButton>
      <div class="dropdown-content">
         <Menu anchor={false} bind:this={menu}>
            <List>
               <Item on:SMUI:action={() => console.log('ding')}>
                  <Icon class="material-icons">delete</Icon>
                  <Text>Delete</Text>
               </Item>
               <Item on:SMUI:action={() => console.log('ding')}>
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
