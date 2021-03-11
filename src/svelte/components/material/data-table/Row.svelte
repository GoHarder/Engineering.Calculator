<script>
   export let header = false;
   export { className as class };
   let className;

   $: rowClass = [header ? 'mdc-data-table__header-row' : 'mdc-data-table__row', className].join(' ');
</script>

<tr class={rowClass}><slot /></tr>
