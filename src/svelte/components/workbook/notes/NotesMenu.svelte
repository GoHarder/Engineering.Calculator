<script>
   import { fade } from 'svelte/transition';

   // Components
   import NotesMenuItem from './NotesMenuItem.svelte';
   import { Button, IconButton, Label } from '../../material/button';
   import { AddCircle, Close } from '../../material/button/icons';
   import { Select, Option } from '../../material/select';
   import { Actions as DialogActions, Content, Dialog, Title as DialogTitle } from '../../material/dialog';

   // Properties
   export let open = false;
   export let firstName = '';
   export let lastName = '';
   export let workbook = undefined;

   // Methods
   const getContextOptions = (workbook) => {
      let selections = [{ text: 'Workbook' }];

      Object.keys(workbook.modules).forEach((module) => {
         if (module !== 'globals') {
            selections = [...selections, { text: module.charAt(0).toUpperCase() + module.slice(1) }];
         }
      });

      return selections;
   };

   const sortNotes = (notes, filter) => {
      let sort = [...notes];

      if (filter !== 'All') {
         sort = sort.filter((note) => note.context === filter);
      }

      sort = sort.sort((note1, note2) => note2.time - note1.time);

      return sort;
   };

   // Variables
   let notesFilter = 'All';
   let notes = [...workbook.notes];
   let openDialog = false;
   let selectedNote = notes?.[0];
   let noteContext = '';
   let noteContent = '';

   // Reactive Variables
   $: noteIndex = notes[notes.length - 1]?._index ?? 0;
   $: rootClass = ['root', open ? 'open' : ''].join(' ').trim();
   $: contextOptions = getContextOptions(workbook);
   $: disableSave = selectedNote?.firstName !== firstName && selectedNote?.lastName !== lastName;
   $: sortedNotes = sortNotes(notes, notesFilter);

   // Events
   const onClose = () => {
      workbook.notes = notes;
      open = false;
   };

   const onAddNote = () => {
      const newNote = {
         _index: noteIndex + 1,
         firstName,
         lastName,
         time: Date.now(),
         context: 'Workbook',
         content: '',
      };

      notes = [...notes, newNote];
      onOpenNote({ detail: noteIndex + 1 });
   };

   const onOpenNote = (event) => {
      selectedNote = notes.find((note) => note._index === event.detail);
      noteContext = selectedNote?.context ?? '';
      noteContent = selectedNote?.content ?? '';
      openDialog = noteContext;
   };

   const onDeleteNote = (event) => {
      const notesUpdate = [...notes].filter((note) => {
         return note._index !== event.detail;
      });

      notes = [...notesUpdate];
   };

   const onCancel = () => {
      noteContext = '';
      noteContent = '';
      openDialog = false;
   };

   const onSave = () => {
      const update = {
         time: Date.now(),
         context: noteContext,
         content: noteContent,
      };

      selectedNote = { ...selectedNote, ...update };

      const copy = [...notes].filter((note) => note._index !== selectedNote._index);

      copy.push(selectedNote);

      notes = copy;

      openDialog = false;
   };
</script>

<Dialog bind:open={openDialog}>
   <DialogTitle>Select user to share workbook</DialogTitle>

   <Content>
      <Select bind:value={noteContext} label="Tag">
         {#each contextOptions as { text }}
            <Option {text} />
         {/each}
      </Select>
      <textarea bind:value={noteContent} />
   </Content>
   <DialogActions>
      <Button on:click={onCancel} class="mdc-dialog__button" color="secondary" variant="outlined">
         <Label>Cancel</Label>
      </Button>
      <Button on:click={onSave} disabled={disableSave} class="mdc-dialog__button" variant="contained">
         <Label>Save</Label>
      </Button>
   </DialogActions>
</Dialog>

<div class={rootClass}>
   <div class="mdc-drawer__header">
      <div class="notes-header__menu">
         <h3 class="mdc-drawer__title">Notes</h3>
         <div class="buttons">
            <IconButton on:click={onAddNote} title="Add Note">
               <AddCircle />
            </IconButton>
            <IconButton on:click={onClose} title="Close">
               <Close />
            </IconButton>
         </div>
      </div>

      {#if notes.length > 0}
         <hr />

         <div class="filter">
            <Select label="Filter" bind:value={notesFilter}>
               <Option text="All" />
               {#each contextOptions as { text }}
                  <Option {text} />
               {/each}
            </Select>
         </div>

         <div class="mdc-list" transition:fade>
            {#each sortedNotes as note (note._index)}
               <NotesMenuItem {...note} on:open={onOpenNote} on:delete={onDeleteNote} />
            {/each}
         </div>
      {/if}
   </div>
</div>

<style lang="scss" global>
   @use './src/scss/vantage-theme';

   .root {
      @include vantage-theme.vantage-paper;
      position: fixed;
      right: 0;
      content: '';
      width: 400px;
      // height: calc(100vh - 90px);
      z-index: 5;
      transform: scale(0) perspective(17px);
      transform-origin: center;
      transition: transform ease 250ms;

      &.open {
         transform: scale(1);
      }
   }

   hr {
      border: 0;
      height: 1px;
      background: rgba($color: #000000, $alpha: 0.3);
   }

   .notes-header__menu {
      display: flex;
      justify-content: space-between;
      height: 56px;
      .buttons {
         display: flex;
         align-items: center;
      }
   }

   textarea {
      margin-top: 10px;
      width: 450px;
      height: 200px;
      resize: none;
      padding: 0.5rem;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
   }
</style>
