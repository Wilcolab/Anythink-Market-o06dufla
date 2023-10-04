const axios = require("axios");
const { randomUserInfo, randomItemInfo } = require("../../tests/e2e/utils");
const { json } = require("body-parser");

const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

class AnythinkClient {
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:3000",
      timeout: 2000,
    });
  }

  async #apiCall({ method = Method.GET, url, callingUser, data = null }) {
    const headers = callingUser
      ? { Authorization: `Token ${callingUser.token}` }
      : {};

    return this.client.request({
      method,
      url,
      data,
      headers,
    });
  }

  async healthCheck() {
    return await this.#apiCall({ url: "/health" });
  }

  async ping() {
    return await this.#apiCall({ url: "/api/ping" });
  }

  async createUser(user) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: "/api/users",
      data: { user },
    });
    return result.data?.user;
  }

  async loginUser(email, password) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: "/api/users/login",
      data: { user: { email, password } },
    });
    return result.data?.user;
  }

  async getUser(callingUser) {
    const result = await this.#apiCall({ url: "/api/user", callingUser });
    return result.data?.user;
  }

  async getUsers() {
    const result = await this.#apiCall({ url: "/api/users" });
    console.log(result.data?.users.map(x => JSON.stringify(x)))
    return result.data?.users;
  }

  async updateUser(userInfo, callingUser) {
    const result = await this.#apiCall({
      method: Method.PUT,
      url: "/api/user",
      callingUser,
      data: { user: userInfo },
    });
    return result.data?.user;
  }

  async createItem(item, callingUser) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: "/api/items",
      callingUser,
      data: { item },
    });
    return result.data?.item;
  }

  async deleteItem(slug, callingUser) {
    await this.#apiCall({
      method: Method.DELETE,
      url: `/api/items/${slug}`,
      callingUser,
    });
  }

  async updateItem(slug, item, callingUser) {
    const result = await this.#apiCall({
      method: Method.PUT,
      url: `/api/items/${slug}`,
      callingUser,
      data: { item },
    });
    return result.data?.item;
  }

  async getItem(slug, callingUser) {
    const result = await this.#apiCall({
      url: `/api/items/${slug}`,
      callingUser,
    });
    return result.data?.item;
  }

  async favoriteItem(slug, callingUser) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: `/api/items/${slug}/favorite`,
      callingUser,
    });
    return result.data?.item;
  }

  async unfavoriteItem(slug, callingUser) {
    const result = await this.#apiCall({
      method: Method.DELETE,
      url: `/api/items/${slug}/favorite`,
      callingUser,
    });
    return result.data?.item;
  }

  async commentOnItem(slug, commenBody, callingUser) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: `/api/items/${slug}/comments`,
      callingUser,
      data: { comment: { body: commenBody } },
    });
    return result.data?.comment;
  }

  async deleteComment(slug, commentId, callingUser) {
    await this.#apiCall({
      method: Method.DELETE,
      url: `/api/items/${slug}/comments/${commentId}`,
      callingUser,
    });
  }

  async getComments(slug) {
    const result = await this.#apiCall({ url: `/api/items/${slug}/comments` });
    return result.data?.comments;
  }

  async getUserItems(seller, limit, offset, favorited, tag, callingUser) {
    let url = `/api/items?seller=${seller}`;

    if (limit) {
      url += `&limit=${limit}`;
    }

    if (offset) {
      url += `&offset=${offset}`;
    }

    if (favorited) {
      url += `&favorited=${favorited}`;
    }

    if (tag) {
      url += `&tag=${tag}`;
    }

    const result = await this.#apiCall({ url, callingUser });
    return result.data?.items;
  }

  async getFeed(callingUser, limit, offset) {
    let url = "/api/items/feed?";

    if (limit) {
      url += `&limit=${limit}`;
    }

    if (offset) {
      url += `&offset=${offset}`;
    }

    const result = await this.#apiCall({ url, callingUser });
    return result.data?.items;
  }

  async followUser(username, callingUser) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: `/api/profiles/${username}/follow`,
      callingUser,
    });
    return result.data?.profile;
  }

  async unfollowUser(username, callingUser) {
    const result = await this.#apiCall({
      method: Method.DELETE,
      url: `/api/profiles/${username}/follow`,
      callingUser,
    });
    return result.data?.profile;
  }

  async getProfile(username, callingUser) {
    const result = await this.#apiCall({
      url: `/api/profiles/${username}`,
      callingUser,
    });
    return result.data?.profile;
  }

  async getTags() {
    const result = await this.#apiCall({ url: "/api/tags" });
    return result.data?.tags;
  }
}

module.exports = { AnythinkClient };


const client = new AnythinkClient();

async function createUsers() {
    for (let i = 0; i < 100; i++) {
        const user = await client.createUser(randomUserInfo());
        const item = await client.createItem(randomItemInfo(), user);
        const comment = await client.commentOnItem(item.slug, "comment1", user)
    }

    
}

createUsers()
// client.getUsers()



// const superagentPromise = require("superagent-promise");
// const _superagent = require("superagent");

// const superagent = superagentPromise(_superagent, global.Promise);

// const BACKEND_URL =
//   process.env.NODE_ENV !== "production"
//     ? process.env.REACT_APP_BACKEND_URL
//     : "https://api.anythink.market";

// const API_ROOT = `${BACKEND_URL}/api`;

// const encode = encodeURIComponent;
// const responseBody = (res) => res.body;

// let token = null;
// const tokenPlugin = (req) => {
//   if (token) {
//     req.set("authorization", `Token ${token}`);
//   }
// };

// const requests = {
//   del: (url) =>
//     superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
//   get: (url) =>
//     superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
//   put: (url, body) =>
//     superagent
//       .put(`${API_ROOT}${url}`, body)
//       .use(tokenPlugin)
//       .then(responseBody),
//   post: (url, body) =>
//     superagent
//       .post(`${API_ROOT}${url}`, body)
//       .use(tokenPlugin)
//       .then(responseBody),
// };

// const Auth = {
//   current: () => requests.get("/user"),
//   login: (email, password) =>
//     requests.post("/users/login", { user: { email, password } }),
//   register: (username, email, password) =>
//     requests.post("/users", { user: { username, email, password } }),
//   save: (user) => requests.put("/user", { user }),
// };

// const Tags = {
//   getAll: () => requests.get("/tags"),
// };

// const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
// const omitSlug = (item) => Object.assign({}, item, { slug: undefined });
// const Items = {
//   all: (page) => requests.get(`/items?${limit(1000, page)}`),
//   bySeller: (seller, page) =>
//     requests.get(`/items?seller=${encode(seller)}&${limit(500, page)}`),
//   byTag: (tag, page) =>
//     requests.get(`/items?tag=${encode(tag)}&${limit(1000, page)}`),
//   del: (slug) => requests.del(`/items/${slug}`),
//   favorite: (slug) => requests.post(`/items/${slug}/favorite`),
//   favoritedBy: (seller, page) =>
//     requests.get(`/items?favorited=${encode(seller)}&${limit(500, page)}`),
//   feed: () => requests.get("/items/feed?limit=10&offset=0"),
//   get: (slug) => requests.get(`/items/${slug}`),
//   unfavorite: (slug) => requests.del(`/items/${slug}/favorite`),
//   update: (item) =>
//     requests.put(`/items/${item.slug}`, { item: omitSlug(item) }),
//   create: (item) => requests.post("/items", { item }),
// };

// const Comments = {
//   create: (slug, comment) =>
//     requests.post(`/items/${slug}/comments`, { comment }),
//   delete: (slug, commentId) =>
//     requests.del(`/items/${slug}/comments/${commentId}`),
//   forItem: (slug) => requests.get(`/items/${slug}/comments`),
// };
// // const agent =  require("../../frontend/src/agent");

// async function createUsers() {
//     for (let i = 0; i < 100; i++) {
//         const { username, password, email } = randomUserInfo();
//         const user = Auth.register(username, email, password);

//         const item = randomItemInfo();
//         const itemRes = Items.create();
//         const comment = Comments.create(item.slug, "comment1")
//     }
// }

// createUsers()
