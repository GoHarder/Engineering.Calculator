<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { IconButton } from '../../material/button';
   import { Delete } from '../../material/button/icons';
   import { Chip } from '../../material/chip';

   // Properties
   export let _index = 0;
   export let firstName = '';
   export let lastName = '';
   export let time = '';
   export let context = '';

   // Constants
   const dispatch = createEventDispatcher();

   // Reactive Variables
   $: initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

   // Events
   const onOpen = () => dispatch('open', _index);

   const onDelete = () => dispatch('delete', _index);
</script>

<div class="mdc-list-item custom" on:click={onOpen}>
   <Chip title={`${firstName} ${lastName}`}>{initials}</Chip>

   <span class="context">{context}</span>

   <div class="date">
      <i class="material-icons">today</i>
      <span class="date">
         {new Date(time).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
         })}
      </span>
   </div>

   <IconButton title="Delete" on:click={onDelete}><Delete /></IconButton>
</div>

<style lang="scss">
   @use './src/scss/vantage-theme';

   .custom {
      justify-content: space-between;
      &:hover {
         background-color: #e6e6e6;
      }
   }
   .date {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba($color: #000000, $alpha: 0.6);
      font-size: 12px;
   }
   .context {
      flex-grow: 1;
      padding: 0 10px;
   }
</style>
