<script>
   import project from '../../../../package.json';
</script>

<footer>
   <span>{`Hollister Whitney © 2020 | V ${project.version} - ${project.releaseDate}`}</span>
</footer>

<style lang="scss">
   footer {
      align-items: center;
      background-color: #ffffff;
      border-top: 1px solid #cccccc;
      bottom: 0;
      display: flex;
      font-size: 12px;
      justify-content: space-between;
      left: 0;
      padding: 5px 16px;
      position: fixed;
      width: 100%;
      z-index: 20;
   }

   @media print {
      footer {
         display: none;
      }
   }
   span {
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.66;
   }
</style>
