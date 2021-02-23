<script>
   // SMUI Components
   import Paper from '@smui/paper';
   import Checkbox from '@smui/checkbox';

   // Properties
   export let checked = true;
   export let title = 'Title';
   export let description = '';

   // Events
   const onClick = () => (checked = !checked);
</script>

<div class="card" on:click={onClick}>
   <Paper class="project-paper" elevation={3} square>
      <div class="title">
         <p class="title-text">{title}</p>
         {#if description}
            <p class="desc">{description}</p>
         {/if}
      </div>
      <div class="control">
         <span class="control-border">
            <span>Add to workbook</span>
            <Checkbox bind:checked />
         </span>
      </div>
   </Paper>
</div>

<style lang="scss">
   .card {
      cursor: pointer;
      padding: 16px;
      margin: 0;
      box-sizing: border-box;
      width: 260px;
   }
   .title {
      padding: 8px 16px;
      background-color: #f6f6f6;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
   }
   .title-text {
      color: #4d4d4d;
      font: {
         size: 16px;
         weight: bold;
      }
      margin: 0 0 0.35em;
      text-align: center;
   }
   .desc {
      color: #4c4c4c;
      font: {
         size: 12px;
         weight: 400;
      }
      line-height: 1.5;
      margin: 0;
      text-align: center;
   }
   .control {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
   }
   .control-border {
      border: 1px solid #ffcb30;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 165px;

      span {
         font: {
            size: 12px;
            weight: bold;
         }
         padding-left: 16px;
      }
   }
</style>
