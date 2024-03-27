import { dateRender } from "./utils.js";
import { funcLike, initEventButtonEdit, reply, addComment } from "./initevent.js";
import { container, addFormHtml, deleteButtonHtml } from "./main.js";


export function renderComments(comments) { //рендер комментариев

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

    container.innerHTML = '<ul class="comments" id="comments">' + commentsHTML + '</ul>' + addFormHtml + deleteButtonHtml;
    const list = '<ul class="comments" id="comments">' + commentsHTML + '</ul>';
    const nameForm = document.getElementById('add-form-name');
    const commentForm = document.getElementById('add-form-text');
    const button = document.getElementById('add-form-button');
    
    addComment(button, list, nameForm, commentForm);
    funcLike(comments);
    initEventButtonEdit(comments, nameForm, commentForm);
    reply(comments, commentForm);
}