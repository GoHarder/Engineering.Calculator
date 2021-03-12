<script>
   export let header = false;
   export let row = false;
   export let title = '';
   export let colspan = '';
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
   <th class={tdClass} {role} {scope} {title} {colspan} on:click><slot /></th>
{:else}
   <td class={tdClass} {role} {title} {colspan} on:click><slot /></td>
{/if}
