import { dateRender } from "./utils.js";
import { funcLike, initEventButtonEdit, reply } from "./initevent.js"

const listElement = document.getElementById('comments');

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

    listElement.innerHTML = commentsHTML;
    funcLike(comments);
    initEventButtonEdit(comments);
    reply(comments);
}