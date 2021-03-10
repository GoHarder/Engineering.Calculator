<script>
   export let header = false;

   $: rowClass = header ? 'mdc-data-table__header-row' : 'mdc-data-table__row';
</script>

<tr class={rowClass}><slot /></tr>
