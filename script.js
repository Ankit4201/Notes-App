const inputBox = document.querySelector('.input');
const addBtn = document.querySelector('.add-btn');
const notesListContainer = document.querySelector('.notes-list-container');
let currentEditedNote  = null;
const errorMessageContainer = document.querySelector('.error-message-container');

function createNewNote(getCurrentInput){
  const li = document.createElement('li');
  const p = document.createElement('p');
  p.textContent = getCurrentInput;

  const editBtn = document.createElement('button');
  editBtn.textContent="Edit Note";
  editBtn.classList.add('btn','edit-btn');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "Delete Note";

  li.appendChild(p);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}

function saveToStorage(getInput){
  let notesList;
  let getNotes = localStorage.getItem('notes');
  notesList = getNotes? JSON.parse(getNotes) : [];

  notesList.push(getInput);
  localStorage.setItem('notes',JSON.stringify(notesList));
}

function addNote(){
  let extractInput = inputBox.value.trim();
  if(extractInput.length<=0){
    errorMessageContainer.textContent = `Input cannot be empty. please enter some text to continue.`;

    return false;
  }
  if(addBtn.textContent === 'Edit Note'){
    handleEditNoteInStorage(currentEditedNote.target.previousElementSibling.innerHTML);
    currentEditedNote.target.previousElementSibling.innerHTML = inputBox.value ;
    addBtn.textContent = 'Add Note';
    inputBox.value='';
    errorMessageContainer.textContent='';
  }
  else{
    const newNote = createNewNote(extractInput);
    notesListContainer.appendChild(newNote);
    inputBox.value='';
    errorMessageContainer.textContent='';
    saveToStorage(extractInput);
  }
  
}

function fetchNoteList(){
  let notes;
  let lcGet = localStorage.getItem('notes');
  notes = lcGet ? JSON.parse(lcGet) : [];

  notes.forEach(noteItem => {
    const createLi = createNewNote(noteItem);
    notesListContainer.appendChild(createLi);
  });
}

function handleEditNoteInStorage(getCurrentNote){
  let notes;
  notes = JSON.parse(localStorage.getItem('notes'));
  const index = notes.indexOf(getCurrentNote);
  notes[index]= inputBox.value;
  localStorage.setItem('notes',JSON.stringify(notes));
}

function handleDeleteNote(getLi){
  let notes;
  let lcGet = localStorage.getItem('notes');
  notes = lcGet ? JSON.parse(lcGet):[];

  const getCurrentNote = getLi.children[0].innerHTML;
  const index = notes.indexOf(getCurrentNote);
  notes.splice(index,1);
  localStorage.setItem('notes',JSON.stringify(notes));
}

function handleEditOrDelete(event){
  // console.log(event.target.previousElementSibling.innerHTML, event.target.innerHTML);

  if(event.target.innerHTML === 'Edit Note'){
    inputBox.value = event.target.previousElementSibling.innerHTML;
    inputBox.focus();
    addBtn.textContent = 'Edit Note';
    currentEditedNote = event;
    errorMessageContainer.textContent='';
    inputBox.textContent = '';
  }
  if(event.target.innerHTML === 'Delete Note'){
    handleDeleteNote(event.target.parentElement);
    notesListContainer.removeChild(event.target.parentElement);
  }
}

addBtn.addEventListener('click',addNote);
document.addEventListener('DOMContentLoaded', fetchNoteList);
notesListContainer.addEventListener('click', handleEditOrDelete);