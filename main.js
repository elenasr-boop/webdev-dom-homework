import { getCommentsFromServer } from "./api.js";

let comments = [];

export const container = document.getElementById('container');

export let loader = '';

export const addFormHtml = `<div class="add-form" id="add-form">
<input type="text" class="add-form-name" id="add-form-name" placeholder="Введите ваше имя" />
<textarea type="textarea" class="add-form-text" id="add-form-text" placeholder="Введите ваш коментарий"
  rows="4"></textarea>
<div class="add-form-row">
  <button class="add-form-button" id="add-form-button">Написать</button>
</div>
</div>`;

export let deleteButtonHtml = '<div class="delete"><button class="button" id="delete-button">Удалить последний комментарий</button></div>';

loader = '<div id="bimbo" class="bimbo">Пожалуйста, подождите, коммментарии загружаются...</div>';
container.innerHTML = loader;

getCommentsFromServer(comments);