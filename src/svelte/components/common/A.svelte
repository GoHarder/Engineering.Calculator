<span on:click>
   <slot />
</span>

<style lang="scss">
   span {
      color: #0d47a1;
      font-size: 14px;
      cursor: pointer;
      position: relative;
      &::after {
         content: '';
         position: absolute;
         left: 0;
         bottom: 0;
         background-color: #0d47a1;
         width: 100%;
         height: 1px;
         transform: scaleX(0);
         transform-origin: right;
         transition: transform ease 250ms;
      }
      &:hover::after {
         transform: scaleX(1);
         transform-origin: left;
      }
   }
</style>
