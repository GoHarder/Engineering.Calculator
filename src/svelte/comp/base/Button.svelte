<script>
  // Parameters

  /** @param {('default'|'primary'|'secondary')} variant The variant to use.*/
  export let color = "default";

  /** @param {boolean} disabled If true, the button will be disabled.*/
  export let disabled = false;

  /** @param {boolean} diableElevation If true, no elevation is used.*/
  export let disableElevation = false;

  /** @param {string} endIcon Element placed after the children.*/
  export let endIcon = "";

  /** @param {boolean} fullWidth If true, the button will take up the full width of its container.*/
  export let fullWidth = false;

  /** @param {string} href The URL to link to when the button is clicked. If defined, an a element will be used as the root node.*/
  export let href = "";

  /** @param {('small'|'medium'|'large')} size The size of the button. small is equivalent to the dense button styling.*/
  export let size = "medium";

  /** @param {string} startIcon Element placed before the children.*/
  export let startIcon = "";

  /** @param {('contained'|'outlined'|'text')} variant The variant to use.*/
  export let variant = "text";

  // Methods
  const style = () => {
    let output = ".mdc-button ";

    switch (variant) {
      case "contained":
        output += disableElevation
          ? ".mdc-button--unelevated "
          : ".mdc-button--raised ";
        break;
      case "outlined":
        output += ".mdc-button--outlined ";
        break;
    }

    switch (color) {
      case "default":
        output += ".color--default ";
        break;
      case "secondary":
        output += ".color--secondary ";
        break;
    }

    switch (size) {
      case "small":
        output += ".small ";
        break;
      case "large":
        output += ".large ";
        break;
    }

    if (fullWidth) output += ".full-width ";

    return output.replace(/\./g, "").trim();
  };
</script>

<style lang="scss">
  @use "@material/button";
  @include button.core-styles;

  .mdc-button {
    text-transform: none;
    @include button.density(-3);
    &.color {
      &--default {
        @include button.ink-color(rgba(0, 0, 0, 0.87));
      }
      &--secondary {
        @include button.ink-color(secondary);
      }
    }

    &.mdc-button--outlined {
      &.color {
        &--default {
          @include button.ink-color(rgba(0, 0, 0, 0.87));
          @include button.outline-color(rgba(0, 0, 0, 0.87));
        }
        &--secondary {
          @include button.ink-color(secondary);
          @include button.outline-color(secondary);
        }
      }
    }

    &.mdc-button {
      &--raised,
      &--unelevated {
        &.color {
          &--default {
            @include button.container-fill-color(#e0e0e0);
          }
          &--secondary {
            @include button.ink-color(on-secondary);
            @include button.container-fill-color(secondary);
          }
        }
      }
    }
  }

  .small {
    @include button.height(30px);
  }

  .large {
    @include button.height(42px);
  }

  .full-width {
    width: 100%;
  }
</style>

{#if href}
  <a class={style()} {href} on:click>
    <span class="mdc-button__ripple" />

    {#if startIcon}
      <i class="material-icons mdc-button__icon" aria-hidden="true">
        {startIcon}
      </i>
    {/if}

    <span class="mdc-button__label">
      <slot />
    </span>

    {#if endIcon}
      <i class="material-icons mdc-button__icon" aria-hidden="true">
        {endIcon}
      </i>
    {/if}
  </a>
{:else}
  <button class={style()} {disabled} on:click>
    <span class="mdc-button__ripple" />

    {#if startIcon}
      <i class="material-icons mdc-button__icon" aria-hidden="true">
        {startIcon}
      </i>
    {/if}

    <span class="mdc-button__label">
      <slot />
    </span>

    {#if endIcon}
      <i class="material-icons mdc-button__icon" aria-hidden="true">
        {endIcon}
      </i>
    {/if}
  </button>
{/if}
