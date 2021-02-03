<script>
  // Svelte Imports
  import { createEventDispatcher } from "svelte";

  // SMUI Components
  import Icon from "@smui/textfield/icon/index";
  import Button, { Label } from "@smui/button";
  import Menu from "@smui/menu";
  import { Anchor } from "@smui/menu-surface";
  import List, { Item, Text } from "@smui/list";
  import LinearProgress from "@smui/linear-progress";

  // Properties
  export let user = undefined;
  export let loading = false;

  // Constants
  const dispatch = createEventDispatcher();

  // Variables
  let menu;
  let anchor;
  let anchorClasses = [];

  // Events
  const logout = () => dispatch("logout");
</script>

<style lang="scss">
  :global {
    @import "@material/linear-progress/mixins";
    @import "@material/theme/color-palette";

    .header-bar {
      @include mdc-linear-progress-bar-color(#ffcb30);
      @include mdc-linear-progress-buffer-color(#ffffff);
    }
  }

  header {
    align-items: center;
    background-color: #333333;
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
      0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
    color: #ffffff;
    display: flex;
    font-size: 20px;
    height: 60px;
    justify-content: space-between;
    left: 0;
    padding: 10px;
    position: relative;
    top: 0;
    z-index: 3;
  }

  .box {
    margin-left: 210px;
  }

  .logo {
    align-items: center;
    background: #ffffff;
    display: flex;
    height: 100%;
    left: 0px;
    margin: 0;
    padding: 20px;
    position: absolute;
    top: 0px;

    & > * {
      z-index: 1;
    }

    &:after {
      background: #ffffff;
      content: "";
      height: 100%;
      position: absolute;
      right: -35px;
      top: 0;
      transform: skewX(-27deg);
      width: 50px;
      z-index: 0;
    }
  }

  img {
    width: 120px;
    border: none;
    display: block;
    max-width: 100%;
  }

  p {
    font-size: 18px;
  }

  .right {
    display: flex;
    align-items: center;
  }
</style>

<header>
  <div class="box">
    <div class="logo">
      <img src="public/img/vantage-logo.png" alt="Vantage Logo" />
    </div>
    <p>Hollister-Whitney Engineering Calculator</p>
  </div>

  {#if user}
    <div class="right">
      <Icon class="material-icons">person</Icon>

      <div
        class={anchorClasses.join(' ')}
        use:Anchor={{ classForward: classes => (anchorClasses = classes) }}
        bind:this={anchor}>
        <Button
          on:click={() => menu.setOpen(true)}
          class="text-transform-none white">
          <Label>{`${user.firstName} ${user.lastName}`}</Label>
          <Icon class="material-icons">arrow_drop_down</Icon>
        </Button>

        <Menu
          bind:this={menu}
          anchor={false}
          bind:anchorElement={anchor}
          anchorCorner="BOTTOM_LEFT">
          <List>

            <Item on:SMUI:action={() => dispatch('changePage', 'MyAccount')}>
              <Icon class="material-icons">account_circle</Icon>
              <Text>My Account</Text>
            </Item>

            {#if user.admin}
              <Item on:SMUI:action={() => console.log('ding')}>
                <Icon class="material-icons">build</Icon>
                <Text>Admin Tools</Text>
              </Item>

              <Item on:SMUI:action={() => console.log('ding')}>
                <Icon class="material-icons">person_add</Icon>
                <Text>Create New User</Text>
              </Item>
            {/if}

            <Item on:SMUI:action={logout}>
              <Icon class="material-icons">close</Icon>
              <Text>Logout</Text>
            </Item>
          </List>
        </Menu>
      </div>
    </div>
  {/if}
</header>

{#if loading}
  <LinearProgress class="header-bar" indeterminate />
{/if}
