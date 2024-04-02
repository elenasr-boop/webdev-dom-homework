import { setComments } from "./main.js";
import { renderAddForm, renderComments } from "./render.js";

export function getCommentsFromServer() {

    return fetch('https://wedev-api.sky.pro/api/v1/elena-rybakova/comments', {
        method: 'GET'
    })
        .then((response) => {
            const jsonPromise = response.json();
            if (response.status === 500) {
                alert('Сервер сломался, попробуй позже');
                throw new Error(response.statusText);
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

            setComments(appComments);
            renderComments();
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
    return fetch('https://wedev-api.sky.pro/api/v1/elena-rybakova/comments', {
        method: 'POST',
        body: JSON.stringify({
            text: safeComm,
            name: safeName,
            date: time,
            // forceError: true
        })
    }).then((res) => {
        if (res.status === 400) {
            alert('Имя и комментарий должны быть не короче 3 символов');
            throw new Error("error request");
        } else if (res.status === 500) {
            alert('Сервер сломался, попробуй позже');
            throw new Error(res.statusText);
        }
        
        getCommentsFromServer();
        // renderComments()
    }).catch(e => {
        console.log(e);
        if (e.message === 'Internal Server Error') {
            postComment(safeComm, safeName, time);
        } else if (e.message === 'Failed to fetch') {
            alert('У вас упал интернет, попробуйте позже');
            return;
        } else if(e.message === 'error request') {
            console.log('error');
            renderAddForm(safeName, safeComm);
        }
    })
}