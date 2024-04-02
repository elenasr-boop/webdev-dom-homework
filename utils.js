export function dateRender(time) { // прописывание времени комментария
  let month = time.getMonth() + 1;
  let year = time.getFullYear() - 2000;
  return `${time.getDate() < 10 ? '0' + time.getDate() : time.getDate() }.${month < 10 ? '0' + month : month}.${year < 10 ? '0' + year : year} ${time.getHours() < 10 ? '0' + time.getHours(): time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
  }

export  function safeString(str) {
    return str.replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }