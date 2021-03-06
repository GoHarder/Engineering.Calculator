<script>
   // Svelte Imports
   import { createEventDispatcher } from 'svelte';

   // Components
   import { Cell, Row } from '../material/data-table';
   import { IconButton } from '../material/button';
   import { MoreVert } from '../material/button/icons';
   import { Anchor, Icon, Item, Menu, Text } from '../material/menu';
   import { Chip } from '../material/chip';

   // Properties
   export let workbook = {};
   export let userId = undefined;

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
   const creator = `${workbook.creator.firstName} ${workbook.creator.lastName}`;
   const initials = creator.replace(/(\b[a-zA-Z])[a-zA-Z]* ?/g, '$1');
   const opened = workbook.opened.find((book) => book.userId === userId)?.time;

   // Variables
   let open = false;

   // Events
   const onSelect = () => dispatch('select', workbook._id);

   const onDelete = () => dispatch('delete', { calcId: workbook._id, user: workbook.creator._id });

   const onShare = () => dispatch('share', workbook._id);
</script>

<Row class="workbook-row">
   <Cell row on:click={onSelect}>{workbook.contract}</Cell>
   <Cell class="workbook-cell job-name" on:click={onSelect}>{workbook.jobName}</Cell>
   <Cell class="workbook-cell car-no" on:click={onSelect}>{workbook.carNo}</Cell>
   <Cell class="workbook-cell customer" on:click={onSelect}>{workbook.customer}</Cell>
   <Cell class="workbook-cell layout" on:click={onSelect}>{workbook.layout}</Cell>
   <Cell class="workbook-cell date" on:click={onSelect}>{getDateString(workbook.created)}</Cell>
   <Cell class="workbook-cell date" on:click={onSelect}>{getDateString(opened)}</Cell>
   <Cell class="workbook-cell owner" on:click={onSelect} title={creator}>
      <Chip>{initials}</Chip>
   </Cell>
   <div class="menu">
      <Anchor>
         <IconButton on:click={() => (open = !open)}>
            <MoreVert />
         </IconButton>
         <Menu bind:open corner="top-right">
            <Item on:click={onShare}>
               <Icon>share</Icon>
               <Text>Share</Text>
            </Item>
            <Item on:click={onDelete}>
               <Icon>delete</Icon>
               <Text>Delete</Text>
            </Item>
         </Menu>
      </Anchor>
   </div>
</Row>

<style lang="scss" global>
   .workbook-row {
      cursor: pointer;
   }
   .menu {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 52px;
      width: 52px;
   }

   .workbook-cell {
      overflow: hidden;

      &.contract {
         column-width: 103px;
      }
      &.job-name {
         column-width: 268px;
      }
      &.car-no {
         column-width: 100px;
      }
      &.customer {
         column-width: 220px;
      }
      &.layout {
         column-width: 100px;
      }
      &.date {
         display: none;
      }
      &.owner {
         display: none;
      }
   }
   @media (min-width: 1100px) {
      .workbook-cell {
         &.date {
            display: table-cell;
         }
      }
   }
   @media (min-width: 1200px) {
      .workbook-cell {
         &.owner {
            display: table-cell;
         }
      }
   }
</style>
