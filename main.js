import { dateRender, safeString } from "./utils.js";

let comments = [ /*объявление массива комментариев*/];

const nameForm = document.getElementById('add-form-name');
const commentForm = document.getElementById('add-form-text');
const button = document.getElementById('add-form-button');
const listElement = document.getElementById('comments');
const addForm = document.getElementById('add-form');
const loader = document.getElementById('bimbo');
const deleteButton = document.getElementById('delete-button');


loader.style.display = 'block';
loader.textContent = 'Пожалуйста, подождите, загружаю комментарии...';

function getCommentsFromServer() {

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
      const appComments = responseData.comments.map((comment) => {
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
      renderComments();

      if (responseData.status === 500) throw Error(responseData.statusText);
    })
    .catch((e) => {
      console.log(e);
      if (e.message === 'Failed to fetch') {
        alert('У вас упал интернет, попробуйте позже');
        return;
      }
    });
};

function renderComments() { //рендер комментариев

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
  funcLike();
  initEventButtonEdit();
  reply();
}

getCommentsFromServer();

function addComment() { //добавление комментария
  let date = new Date();

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

  let unsafeName = nameForm.value; // устранение уязвимости
  let unsafeComm = commentForm.value;

  let safeName = safeString(unsafeName);
  let safeComm = safeString(unsafeComm)
    .replaceAll('QUOTE_BEGIN', "<div class='quote'>")
    .replaceAll('QUOTE_END', '</div>');

  addForm.style.display = 'none';
  loader.textContent = 'Комментарий добавляется...';
  loader.style.display = 'block';
  let enteredName = nameForm.value;
  let enteredComment = commentForm.value;

  let fetchPromise = fetch('https://wedev-api.sky.pro/api/v1/elena-rybakova/comments', {
    method: 'POST',
    body: JSON.stringify({
      text: safeComm,
      name: safeName,
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

  getCommentsFromServer();
  nameForm.value = '';
  commentForm.value = '';
}

button.disabled = true; //проверка заполненности полей

nameForm.addEventListener('input', () => {
  commentForm.addEventListener('input', () => {
    button.disabled = false;
  })
})

commentForm.addEventListener('input', () => {
  nameForm.addEventListener('input', () => {
    button.disabled = false;
  })
})

button.addEventListener("click", addComment);

commentForm.addEventListener('keypress', (e) => { //отправление комментария по кнопке enter
  if (e.key === 'Enter') {
    // button.click();
    addComment();
  }
})

deleteButton.addEventListener('click', () => { //удаление комментария

  if (comments == []) {
    alert('Удалять нечего');
    return;
  }

  let result = comments.pop();
  getCommentsFromServer();
})

function funcLike() { //работа лайков
  let likeButtons = document.querySelectorAll('.like-button');
  for (let likeButton of likeButtons) {
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation();

      let numComm = likeButton.getAttribute('data-numComments');

      if (comments[numComm].isLiked) {
        comments[numComm].isLiked = !comments[numComm].isLiked;
        comments[numComm].likes--;
      } else {
        comments[numComm].isLiked = !comments[numComm].isLiked;
        comments[numComm].likes++;
      }

      console.log('лайк сработал', comments[numComm].isLiked);

      renderComments();
    })
  }
}

function initEventButtonEdit() { //редактирование комментария
  let buttonsEdit = document.querySelectorAll('.button-edit');

  for (let buttonEdit of buttonsEdit) {
    buttonEdit.addEventListener('click', (event) => {
      event.stopPropagation();
      let numComm = buttonEdit.getAttribute('data-numComments');
      let txtEdit = document.getElementById('textarea');

      comments[numComm].isEdit = !comments[numComm].isEdit;

      if (!comments[numComm].isEdit) {
        comments[numComm].text = txtEdit.value;
      }

      getCommentsFromServer();
    });
  }
}

function reply() {
  let replyComms = document.querySelectorAll('.comment');

  for (let replyComm of replyComms) {
    replyComm.addEventListener('click', () => {
      let numComm = replyComm.getAttribute('data-numComments');
      commentForm.value = `QUOTE_BEGIN${comments[numComm].name}:
${comments[numComm].text} QUOTE_END

`;
    })
  }
}