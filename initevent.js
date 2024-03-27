import { renderComments } from "./render.js";
import { safeString } from "./utils.js";
import { commentForm, nameForm, addForm, loader } from "./main.js";
import { postComment, getCommentsFromServer } from "./api.js";

const deleteButton = document.getElementById('delete-button');

export function funcLike(arr) { //работа лайков
    let likeButtons = document.querySelectorAll('.like-button');
    for (let likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation();

            let numComm = likeButton.getAttribute('data-numComments');

            if (arr[numComm].isLiked) {
                arr[numComm].isLiked = !arr[numComm].isLiked;
                arr[numComm].likes--;
            } else {
                arr[numComm].isLiked = !arr[numComm].isLiked;
                arr[numComm].likes++;
            }

            renderComments(arr);
        })
    }
}

export function reply(arr) {
    let replyComms = document.querySelectorAll('.comment');

    for (let replyComm of replyComms) {
        replyComm.addEventListener('click', () => {
            let numComm = replyComm.getAttribute('data-numComments');
            commentForm.value = `QUOTE_BEGIN${arr[numComm].name}:
  ${arr[numComm].text} QUOTE_END
  
  `;
        })
    }
}

export function addComment() { //добавление комментария
    let time = new Date();

    nameForm.classList.remove('error');
    commentForm.classList.remove('error');

    if ((nameForm.value.trim() == '') && (commentForm.value.trim() == '')) {
        nameForm.classList.add('error');
        commentForm.classList.add('error');
        return;
    }
    else if (nameForm.value.trim() == '') {
        nameForm.classList.add('error');
        return;
    } else if (commentForm.value.trim() == '') {
        commentForm.classList.add('error');
        return;
    }

    let safeName = safeString(nameForm.value);
    let safeComm = safeString(commentForm.value)
        .replaceAll('QUOTE_BEGIN', "<div class='quote'>")
        .replaceAll('QUOTE_END', '</div>');

    addForm.style.display = 'none';
    loader.textContent = 'Комментарий добавляется...';
    loader.style.display = 'block';

    postComment(safeComm, safeName, time);

    getCommentsFromServer(comments);
    nameForm.value = '';
    commentForm.value = '';
}

export function initEventButtonEdit(arr) { //редактирование комментария
    let buttonsEdit = document.querySelectorAll('.button-edit');

    for (let buttonEdit of buttonsEdit) {
        buttonEdit.addEventListener('click', (event) => {
            event.stopPropagation();
            let numComm = buttonEdit.getAttribute('data-numComments');
            let txtEdit = document.getElementById('textarea');

            arr[numComm].isEdit = !arr[numComm].isEdit;

            if (!arr[numComm].isEdit) {
                arr[numComm].text = txtEdit.value;
            }

            getCommentsFromServer(arr);
        });
    }
}

deleteButton.addEventListener('click', () => { //удаление комментария
    alert('У API нет метода DELETE.');
})