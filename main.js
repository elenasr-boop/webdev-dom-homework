import { getCommentsFromServer } from "./api.js";
import { addComment } from "./initevent.js";

let comments = [ /*объявление массива комментариев*/];

export const nameForm = document.getElementById('add-form-name');
export const commentForm = document.getElementById('add-form-text');
export const button = document.getElementById('add-form-button');
export let addForm = document.getElementById('add-form');
export let loader = document.getElementById('bimbo');


loader.style.display = 'block';
loader.textContent = 'Пожалуйста, подождите, загружаю комментарии...';

getCommentsFromServer(comments);

button.addEventListener("click", addComment);

commentForm.addEventListener('keypress', (e) => { //отправление комментария по кнопке enter
  if (e.key === 'Enter') {
    // button.click();
    addComment();
  }
})