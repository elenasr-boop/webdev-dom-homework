import { dateRender } from "./utils.js";
import { funcLike, initEventButtonEdit, reply, addComment, mainLogButton, loginButton, registerButton, registration } from "./initevent.js";
import { container, comments } from "./main.js";


export function renderComments() { //рендер комментариев

  const commentsHTML = comments.map((comment, index) => {
    let liked = '';
    let textEdit = '';
    let btnEdit = '';

    if (comment.isLiked) {
      liked = ' -active-like'
    }

    if (comment.isEdit) {
      textEdit = `<textarea class="textarea" id='textarea'>${comment.text}</textarea>`;
      btnEdit = `Сохранить`;
    } else {
      textEdit = `<div class="comment-text">
          ${comment.text}
        </div>`;
      btnEdit = `Редактировать`;
    }

    return `<li class="comment" data-numComments="${index}">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${dateRender(comment.date)}</div>
      </div>
      <div class="comment-body">` +
      textEdit +
      `</div>
      <div class="comment-footer">
        <button class="button-edit" data-numComments="${index}">` + btnEdit + `</button>
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button` + liked
      + `" data-numComments="${index}"></button>
        </div>
      </div>
    </li>`
  })
    .join('');

  container.innerHTML = `<button id="log-button" class="add-form-button">Войти</button>`+'<ul class="comments" id="comments">' + commentsHTML + '</ul>';

  renderAddForm('', '');
  addComment();
  funcLike(comments);
  initEventButtonEdit(comments);
  reply(comments);
  mainLogButton();
}

export function renderAddForm(name, text) {
  const form = `<div class="add-form" id="add-form">
  <input type="text" class="add-form-name" id="add-form-name" placeholder="Введите ваше имя" value="${name}"/>
  <textarea type="textarea" class="add-form-text" id="add-form-text" placeholder="Введите ваш коментарий"
    rows="4">${text}</textarea>
  <div class="add-form-row">
    <button class="add-form-button" id="add-form-button">Написать</button>
  </div>
  </div>`;

  if (document.querySelector('.form-add-form') !== null) {
    document.querySelector('.form-add-form').remove();
  }

  const formElement = document.createElement('div');
  formElement.classList.add('form-add-form');
  formElement.innerHTML = form;
  container.appendChild(formElement);
}

export function renderAuthPage() {
  container.innerHTML = `<div> 
  <h2 class="">Войдите в свой аккаунт</h2>
  <div class="auth-form">
    <input placeholder="Введите логин" id="login" class="add-form-name">
    <input placeholder="Введите пароль" id="password" class="add-form-name">
    <button id="button-login" class="add-form-button">Войти</button>
  </div>  
  <div class="button-register">
    <button class="button-register add-form-button" id="button-register">Ещё нет аккаунта? Зарегестрируйтесь</button>
  </div>
</div>`;

loginButton();
registerButton();
}

export function renderRegisterForm () {
  container.innerHTML = `
  <h2>Регистрация</h2>
  <div class="register-form">
    <input placeholder="Введите имя" id="register-name" class="add-form-name">
    <input placeholder="Введите логин" id="register-login" class="add-form-name">
    <input placeholder="Введите пароль" id="register-password" class="add-form-name">
  </div>
  <button id="registration" class="add-form-button">Зарегестрироваться</button>
  <div`

  registration();
}