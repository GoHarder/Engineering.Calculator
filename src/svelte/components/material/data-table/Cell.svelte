<script>
   export let header = false;
   export let row = false;
   export let title = '';
   export { className as class };

   let className;
   let tdClass = [header ? 'mdc-data-table__header-cell' : 'mdc-data-table__cell', className].join(' ');
   let role = header ? 'columnheader' : undefined;
   let scope = '';

   if (row) {
      scope = 'row';
   } else if (header) {
      scope = 'col';
   }
</script>

{#if scope}
   <th class={tdClass} {role} {scope} {title} on:click><slot /></th>
{:else}
   <td class={tdClass} {role} {title} on:click><slot /></td>
{/if}
