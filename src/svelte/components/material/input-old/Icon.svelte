<script>
   export let leading = false;
   export let trailing = false;
   export let button = false;
   export let tabindex = 0;
</script>

<i
   on:click
   class="material-icons mdc-text-field__icon"
   class:mdc-text-field__icon--leading={leading}
   class:mdc-text-field__icon--trailing={trailing}
   {tabindex}
   role={button ? 'button' : ''}
>
   <slot />
</i>
