<script>
  // Properties
  export let password = "";

  // Reactive Variables
  $: tests = [
    { text: "Between 8 and 16 Characters", test: password.match(/\S{8,15}/g) },
    {
      text: "At least one lower case letter [a-z]",
      test: password.match(/[a-z]/g)
    },
    {
      text: "At least one upper case letter [a-z]",
      test: password.match(/[A-Z]/g)
    },
    { text: "At least one numeral [0-9]", test: password.match(/[0-9]/g) },
    {
      text: "At least one symbol [~!@#$%^&*()_+-=]",
      test: password.match(/[~!@#$%^&*()_\+\-\=]/g)
    }
  ];
</script>

<style lang="scss">
  ul {
    list-style: none;
    margin-left: 0;
    padding-left: 0;
  }

  li {
    color: #b00020;
    padding-left: 1em;
    text-indent: -1em;
  }

  li:before {
    content: "•";
    padding-right: 6px;
  }

  li.good {
    color: green;
    &:before {
      content: "✓";
      padding-right: 5px;
    }
  }
</style>

<ul>
  {#each tests as { text, test }}
    <li class={test ? 'good' : ''}>{text}</li>
  {/each}
</ul>
