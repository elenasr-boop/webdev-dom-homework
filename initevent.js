import { renderAddForm, renderAuthPage, renderComments, renderRegisterForm } from "./render.js";
import { safeString } from "./utils.js";
import { postComment, getCommentsFromServer, authorization } from "./api.js";

export const nameForm = document.getElementById('add-form-name');
export const commentForm = document.getElementById('add-form-text');

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
            let replyingComm = `QUOTE_BEGIN${arr[numComm].name}:
            ${arr[numComm].text} QUOTE_END
            
            `

            renderAddForm('', replyingComm);
        })
    }
}

export function addComment() { //добавление комментария
    const nameForm = document.getElementById('add-form-name');
    const commentForm = document.getElementById('add-form-text');
    const button = document.getElementById('add-form-button');

    button.addEventListener("click", () => {
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

        postComment(safeComm, safeName, time);
    });

    commentForm.addEventListener('keypress', (e) => { //отправление комментария по кнопке enter
        if (e.key === 'Enter') {
            button.click();
        }
    })
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

export function registerButton () {
    let regButton = document.getElementById('button-register');
    regButton.addEventListener('click', () => {
        console.log('войти');
        renderRegisterForm();
    })
}

export function loginButton () {
    let logButton = document.getElementById('button-login');
    let login = document.getElementById('login').value;
    let password = document.getElementById('password').value;

    logButton.addEventListener('click', () => {
        console.log('тык.');
        authorization(login, password);
    })
}

export function registration () {
    let register = document.getElementById('registration');
    let name = document.getElementById('register-name').value;
    let login = document.getElementById('register-login').value;
    let password = document.getElementById('register-password').value;

    register.addEventListener('click', () => {
        console.log('Регистрация');
        login(name, login, password);
    })
}

export function mainLogButton() {
    let log = document.getElementById('log-button');

    log.addEventListener('click', () => {
        renderAuthPage();
    })
}