import { loader, addForm, commentForm, nameForm} from "./main.js";
import { renderComments } from "./render.js";
import { addComment } from "./initevent.js";

export function getCommentsFromServer(comments) {

    let fetchPromise = fetch('https://wedev-api.sky.pro/api/v1/elena-rybakova/comments', {
        method: 'GET'
    })
        .then((response) => {
            const jsonPromise = response.json();
            if (response.status === 500) {
                alert('Сервер сломался, попробуй позже');
                throw Error(response.statusText);
            }
            return jsonPromise;
        })
        .then((responseData) => {
            let appComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                    id: comment.id,
                    isEdit: false
                }
            });

            loader.style.display = 'none';
            comments = appComments;
            renderComments(comments);

            if (responseData.status === 500) throw Error(responseData.statusText);
            return comments;
        })
        .catch((e) => {
            console.log(e);
            if (e.message === 'Failed to fetch') {
                alert('У вас упал интернет, попробуйте позже');
                return;
            }
        });
};

export function postComment(safeComm, safeName, time) {
    let enteredName = nameForm.value;
    let enteredComment = commentForm.value;

    return fetch('https://wedev-api.sky.pro/api/v1/elena-rybakova/comments', {
        method: 'POST',
        body: JSON.stringify({
            text: safeComm,
            name: safeName,
            date: time,
            forceError: true
        })
    }).then((res) => {
        addForm.style.display = 'flex';
        loader.style.display = 'none';

        if (res.status === 400) {
            alert('Имя и комментарий должны быть не короче 3 символов');
            throw Error(res.statusText);
        } else if (res.status === 500) {
            alert('Сервер сломался, попробуй позже');
            throw Error(res.statusText);
        }
    }).catch(e => {
        console.log(e);
        commentForm.value = enteredComment;
        nameForm.value = enteredName;
        if (e.message === 'Internal Server Error') {
            addComment();
        } else if (e.message === 'Failed to fetch') {
            alert('У вас упал интернет, попробуйте позже');
            addForm.style.display = 'flex';
            loader.textContent = '';
            loader.style.display = 'none';
            return;
        }
    })
}