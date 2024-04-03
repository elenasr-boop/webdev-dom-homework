import { comments, setComments } from "./main.js";
import { renderAddForm, renderComments } from "./render.js";

const baseHost = 'https://wedev-api.sky.pro/api/v2/elena-rybakova';
export let token = '';
export let userName = '';

export function getCommentsFromServer() {

    return fetch(baseHost + '/comments', {
        method: 'GET', 
        headers: {
            authorization: `Bearer ${token}`,
        }
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
                let isLike = false;
                if (token === '') {
                    isLike = false;
                } else {
                    isLike = comment.isLiked;
                }

                return {
                    id: comment.id,
                    date: new Date(comment.date),
                    likes: comment.likes,
                    isLiked: isLike,
                    text: comment.text,
                    author: {
                        id: comment.author.id,
                        login: comment.author.login,
                        name: comment.author.name
                    }
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
    return fetch(baseHost + '/comments', {
        method: 'POST',
        headers: {
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            text: safeComm,
            // forceError: true
        })
    }).then((res) => {
        if (res.status === 400) {
            alert('Имя и комментарий должны быть не короче 3 символов');
            throw new Error("error request");
        } else if (res.status === 500) {
            alert('Сервер сломался, попробуй позже');
            throw new Error(res.statusText);
        } else if (res.status === 401) {
            alert('Пожалуйста, авторизуйтесь');
            throw new Error (res.statusText);
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
        } else if (e.message === 'error request') {
            console.log('error');
            renderAddForm(safeName, safeComm);
        }
    })
}

export function deleteComment (id) {
    return fetch(baseHost + '/comments/' + id, {
        method: "DELETE",
        headers: {
            authorization: `Bearer ${token}`,
        }
    }).then((res) => {
        if (res.status === 500) {
            alert ('Ошибка сервера');
            throw new Error (res.statusText);
        } else if (res.status === 401) {
            alert('Пожалуйста, авторизуйтесь');
            throw new Error (res.statusText);
        }

        getCommentsFromServer();
    }).catch((e) => {
        console.log(e);
        if (e.message === 'Failed to fetch') {
            alert('У вас упал интернет, попробуйте позже');
        }
    })
}

export function apiLike (id) {
    return fetch(baseHost + '/comments/' + id + '/toggle-like', {
        method: "POST", 
        headers: {
            authorization: `Bearer ${token}`,
        }
    }).then ((res) => {
        if (res.status === 401) {
            alert('Пожалуйста, авторизуйтесь');
            throw new Error (res.statusText);
        } else if (res.status === 500) {
            alert('Упал сервер, пожалуйста, попробуйте позже');
            throw new Error (res.statusText);
        }

        getCommentsFromServer();
    })
}

export function authorization (login, password) {
    return fetch('https://wedev-api.sky.pro/api/user/login', {
        method: "POST", 
        body: JSON.stringify({
            login: login,
            password: password
        })
    }).then((res) => {
        if (res.status === 400) {
            alert("Неверный логин или пароль");
            throw new Error (res.statusText);
        } else if (res.status === 500) {
            alert('Сервер упал, попробуйте позже');
            throw new Error(res.statusText);
        }
        return res.json();
    }).then ((resData) => {
        token = resData.user.token;
        userName = resData.user.name;
        alert('Успешный вход');
        getCommentsFromServer();
    }).catch((e) => {
        console.log(e);
    })
}

export function registrationApi(name, login, password) {
    return fetch('https://wedev-api.sky.pro/api/user', {
        method: "POST",
        body: JSON.stringify({
            login: login,
            name: name,
            password: password
        })
    }).then((res) => {
        if (res.status === 500) {
            alert('Упал сервер, пожалуйста, подождите');
            throw new Error(res.statusText);
        } else if (res.status === 400) {
            alert('Пользователь с таким логином уже существует');
            throw new Error(res.statusText);
        }

        return res.json();
    }).then ((resData) => {
        token = resData.user.token;
        userName = resData.user.name;
        alert('Успешная регистрация');
        getCommentsFromServer();
    }).catch((e) => {
        console.log(e);
    })
}