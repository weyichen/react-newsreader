var login_post = (username, password) => {
  return new Promise((resolve, reject) => {
    $.post("/api/auth/login", { username: username, password: password })
    .then(res => {
      if (res.ok)
        return resolve(res.data);
      else
        return reject(res.error);
    });
  });
}

var logout_get = () => {
  return new Promise((resolve, reject) => {
    $.get("/api/auth/logout")
    .then(res => {
      if (res.ok)
        return resolve(res.data);
      else
        return reject(res.error);
    });
  });
}

var subs_get = () => {
  return new Promise((resolve, reject) => {
    $.get("/api/subs")
    .then(res => {
      if (res.ok)
        return resolve(res.data);
      else
        return reject(res.error);
    });
  });
}

var subs_post = (subs) => {
  return new Promise((resolve, reject) => {
    $.post("/api/subs", {subs})
    .then(res => {
      if (res.ok)
        return resolve();
      else
        return reject(res.error);
    });
  });
}

var source_list = () => {
  return new Promise((resolve, reject) => {
    $.get("/api/feed/list")
    .then(res => {
      if (res.ok)
        return resolve(res.data);
      else
        return reject(res.error);
    });
  });
}

var source_get = (rss) => {
  return new Promise((resolve, reject) => {
    $.get("/api/feed/?rss=" + rss)
    .then(res => {
      if (res.ok)
        return resolve(res.data);
      else
        return reject(res.error);
    });
  });
}

var source_post = (source) => {
  return new Promise((resolve, reject) => {
    $.post("/api/feed/", source)
    .then(res => {
      if (res.ok)
        return resolve(res.data);
      else
        return reject(res.error);
    });
  });
}

var parseFeed_get = (feedUrl) => {
  return new Promise((resolve, reject) => {
    $.get("/parsefeed/?feedUrl=" + feedUrl)
    .done((res) => {
      if (res.ok)
        return resolve(res.data);
      else
        return reject(res.error);
    });
  });
}

var feedMeta_get = (feedUrl) => {
  return new Promise((resolve, reject) => {
    $.get("/get-meta/?feedUrl=" + feedUrl)
    .done((res) => {
      if (res.ok)
        return resolve(res.data);
      else
        return reject(res.error);
    });
  });
}

var loggedInUser_get = () => {
  return new Promise((resolve, reject) => {
    $.get("/api/auth/logged-in-user")
    .done((res) => {
      if (res.ok)
        return resolve(res.data);
      else
        return reject(res.error);
    });
  }); 
}

module.exports = {
  login_post: login_post,
  logout_get: logout_get,

  subs_get: subs_get,
  subs_post: subs_post,

  source_list: source_list,
  source_get: source_get,
  source_post: source_post,

  parseFeed_get: parseFeed_get,
  feedMeta_get: feedMeta_get,
  
  loggedInUser_get: loggedInUser_get
}