import { renderAddForm, renderAuthPage, renderRegisterForm } from "./render.js";
import { safeString } from "./utils.js";
import { postComment, authorization, registrationApi, apiLike, userName, deleteComment } from "./api.js";

export function funcLike() { //работа лайков
    let likeButtons = document.querySelectorAll('.like-button');
    for (let likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {

            event.stopPropagation();

            let id = likeButton.getAttribute('data-commId');

            apiLike(id);
        })
    }
}

export function reply() {
    let replyComms = document.querySelectorAll('.comment');

    for (let replyComm of replyComms) {
        replyComm.addEventListener('click', () => {
            let textToReply = replyComm.getAttribute('data-commId');

            renderAddForm(userName, textToReply)
        })
    }
}

export function addComment() { //добавление комментария
    const nameForm = document.getElementById('add-form-name');
    const commentForm = document.getElementById('add-form-text');
    const button = document.getElementById('add-form-button');

    button.addEventListener("click", () => {
        let time = new Date();

        commentForm.classList.remove('error');

        if (commentForm.value.trim() == '') {
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

// export function initEventButtonEdit(arr) { //редактирование комментария
//     let buttonsEdit = document.querySelectorAll('.button-edit');

//     for (let buttonEdit of buttonsEdit) {
//         buttonEdit.addEventListener('click', (event) => {
//             event.stopPropagation();
//             let numComm = buttonEdit.getAttribute('data-commId');
//             let txtEdit = document.getElementById('textarea');

//             arr[numComm].isEdit = !arr[numComm].isEdit;

//             if (!arr[numComm].isEdit) {
//                 arr[numComm].text = txtEdit.value;
//             }

//             getCommentsFromServer(arr);
//         });
//     }
// }

export function registerButton () {
    let regButton = document.getElementById('button-register');
    regButton.addEventListener('click', () => {
        console.log('войти');
        renderRegisterForm();
    })
}

export function loginButton () {
    let logButton = document.getElementById('button-login');
  
    logButton.addEventListener('click', () => {
        let login = document.getElementById('login').value;
        let password = document.getElementById('password').value;
    
        authorization(login, password);
    })
}

export function registration () {
    let register = document.getElementById('registration');

    register.addEventListener('click', () => {
        
    let nameForm = document.getElementById('register-name');
    let loginForm = document.getElementById('register-login');
    let passwordForm = document.getElementById('register-password');
    let name = nameForm.value;
    let login = loginForm.value;
    let password = passwordForm.value;
        registrationApi(name, login, password);
    })
}

export function mainLogButton() {
    let log = document.getElementById('log-button');

    log.addEventListener('click', () => {
        renderAuthPage();
    })
}

export function deleteButton() {
    const buttonsDelete = document.querySelectorAll('.button-delete');
    for (let buttonDelete of buttonsDelete) {
        buttonDelete.addEventListener('click', () => {
            let id = buttonDelete.getAttribute('data-commId');
            deleteComment(id);
        });
    }
}