import { Object } from "core-js";

export const state = () => ({
  posts: [],
  addedPosts: [],
  firstLoadingFlag: true,
  lines: [],
  drawing: false
});

export const mutations = {
  setState(state, payload) {
    Object.keys(payload).forEach(key => {
      if (key in state) {
        state[key] = payload[key];
      }
    });
  },
  setInLocalStorage(state) {
    let t = state.posts.find(
      item => !state.addedPosts.some(subitem => item.id === subitem.id)
    );
    state.addedPosts.push(t);
  },
  updateLocaletorage(state, firstLoading = false) {
    if (firstLoading) {
      let t = JSON.parse(localStorage.getItem("cardsStorage"));
      if (t) {
        state.addedPosts = t;
      }
      state.firstLoadingFlag = false;
      return;
    }
    localStorage.setItem("cardsStorage", JSON.stringify(state.addedPosts));
  },
  deleteCard(state, id) {
    const f = state.addedPosts.findIndex(item => item.id == id);
    if (f != -1) {
      state.addedPosts.splice(f, 1);
      state.lines = state.lines.filter(
        item => !item.some(subitem => subitem.id === id)
      );
      localStorage.lines = JSON.stringify(state.lines);
    }
  },
  setСoordinates(state, { id, params, points }) {
    const f = state.addedPosts.findIndex(item => item.id == id);
    if (f != -1) {
      Object.keys(params).forEach(key => {
        state.addedPosts[f][key] = params[key];
        state.addedPosts[f].points = points;
      });
      // console.log("work in vuex", state.addedPosts[f]);
    }
  },
  lineDrawingVuex(state, { id, side }) {
    let card = state.addedPosts.find(item => item.id === id),
      coor = side === "right" ? card.points[0] : card.points[1];

    if (
      state.lines.length &&
      Object.keys(state.lines[state.lines.length - 1])?.length == 1
    ) {
      state.lines[state.lines.length - 1].push({
        id: card.id,
        [side]: coor
      });
      if (
        state.lines[state.lines.length - 1][0].id ===
        state.lines[state.lines.length - 1][1].id
      ) {
        state.lines[state.lines.length - 1].splice(0, 1);
      }

      let similarItems = state.lines.filter(
        linesItem =>
          linesItem.some(
            subitem => subitem.id === state.lines[state.lines.length - 1][0].id
          ) &&
          linesItem.some(
            subitem => subitem.id === state.lines[state.lines.length - 1][1]?.id
          )
      );
      if (similarItems.length === 2) {
        let index = state.lines.findIndex(item => item === similarItems[0]);
        if (index != -1) {
          state.lines.splice(index, 1);
        }
      }
      console.log(similarItems);
    } else {
      state.lines.push([
        {
          id: card.id,
          [side]: coor
        }
      ]);
    }
    localStorage.setItem("lines", JSON.stringify(state.lines));
    // console.log("drawing", t);
  },
  syncCoordinates(state, { id, points }) {
    if (state.lines.length) {
      let t = state.lines.filter(item =>
        item.some(subitem => subitem.id === id)
      );
      t.forEach(item => {
        let f = item.find(subitem => subitem.id === id);
        if (f.right) {
          f.right = points.right;
        } else {
          f.left = points.left;
        }
      });
      // console.log(t);
      localStorage.lines = JSON.stringify(state.lines);
    }
  },
  deleteCards(state) {
    localStorage.removeItem("cardsStorage");
    state.addedPosts = [];
  },
  setLinesFromLocalStorageVuex(state) {
    let t = JSON.parse(localStorage.getItem("lines"));
    if (t?.length) {
      state.lines = t;
      console.log(state.lines);
    }
  },
  deleteConnection(state) {
    localStorage.removeItem("lines");
    state.lines = [];
  }
};
export const actions = {
  getPosts({ commit }) {
    return this.$axios
      .get(`http://jsonplaceholder.typicode.com/posts`)
      .then(res => {
        console.log(res);
        if (res?.data) {
          commit("setState", { posts: res.data });
        }
      });
  },
  setInLocalStorage({ commit }) {
    commit("setInLocalStorage");
  },
  updateLocaletorage({ commit }, firstLoading) {
    commit("updateLocaletorage", firstLoading);
  },
  deleteCard({ commit }, id) {
    commit("deleteCard", id);
  },
  setСoordinates({ commit, dispatch }, { id, params, points }) {
    commit("setСoordinates", { id, params, points });
    dispatch("updateLocaletorage");
  },
  lineDrawingVuex({ commit }, { id, side }) {
    commit("lineDrawingVuex", { id, side });
  },
  syncCoordinates({ commit }, { id, points }) {
    commit("syncCoordinates", { id, points });
  },
  setLinesFromLocalStorageVuex({ commit }) {
    commit("setLinesFromLocalStorageVuex");
  },
  deleteConnection({ commit }) {
    commit("deleteConnection");
  },
  deleteCards({ state, commit, dispatch }) {
    state.addedPosts.forEach(item => {
      dispatch("deleteCard", item.id);
    });
    commit("deleteCards");
  }
};
