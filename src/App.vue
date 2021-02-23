<template>
  <div class="cards" ref="cards">
    <div class="cards__controler">
      <app-icon icon="plus" class="cards__btn" @clickIcon="addCard" />

      <button
        icon="plus"
        class="cards__btn cards__btn_delete cards__btn_delcard"
        @click="deleteConnection"
        v-if="points.length"
      >
        Очистить
      </button>
      <button
        icon="plus"
        class="cards__btn cards__btn_delete"
        @click="deleteCards"
        v-if="cards.length"
      >
        Удалить карты
      </button>
    </div>

    <div class="cards__item">
      <app-card v-for="card in cards" :key="card.id" :cardData="card" />
    </div>
    <canvas class="canvas" ref="canvas"></canvas>
  </div>
</template>
<script>
import iconWrapperVue from "@/components/iconWrapper.vue";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    "app-icon": iconWrapperVue,
    "app-card": () => import("@/components/card")
  },
  data() {
    return {
      canvas: null,
      ctx: null
    };
  },
  computed: {
    ...mapState({
      cards: state => state.cards.addedPosts,
      points: state => state.cards.lines
    })
  },
  watch: {
    cards: {
      handler() {
        this.updateLocaletorage();
      }
    },
    points: {
      handler(val) {
        if (this.canvas) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        if (this.$refs.canvas) {
          this.canvas = this.$refs.canvas;
          this.canvas.width = this.$refs.cards.clientWidth;
          this.canvas.height = this.$refs.cards.clientHeight;
          if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext("2d");
            this.ctx.beginPath();

            let t = JSON.parse(JSON.stringify(val));
            t.forEach(item => {
              if (item.length === 2) {
                item.forEach(subitem => {
                  let coor = subitem.right || subitem.left;
                  this.$set(subitem, "points", coor);
                });
                this.ctx.moveTo(item[0].points.x, item[0].points.y);
                this.ctx.lineTo(item[1].points.x, item[1].points.y);
              }
            });
            this.ctx.stroke();
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions("cards", [
      "getPosts",
      "updateLocaletorage",
      "setInLocalStorage",
      "setLinesFromLocalStorageVuex",
      "deleteConnection",
      "deleteCards"
    ]),
    addCard() {
      this.setInLocalStorage();
    }
  },

  mounted() {
    this.getPosts();
    this.updateLocaletorage(true);
    this.setLinesFromLocalStorageVuex();
  }
};
</script>
<style lang="scss">
.fixed {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 400px;
  height: 500px;
  background: #bfbdbd;
  overflow: auto;
}
* {
  margin: 0;
  padding: 0;
}
.cards {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  &__item {
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
  }
  &__link {
    position: absolute;
    top: 100px;
    left: 100px;
    bottom: 100px;
    left: 100px;
    background: #000;
  }

  &__controler {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-left: 20px;
  }
  &__btn {
    //position: absolute;
    //top: 10px;
    //left: 10px;
    z-index: 10000;
    width: 40px;
    height: 40px;
    margin-right: 20px;
    cursor: pointer;
    transition: 0.2s;
    &_delete {
      width: fit-content;
      padding: 5px 15px;
      background: black;
      color: white;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      border: none;
    }

    &:hover {
      transform: scale(1.2);
    }
    &:active {
      transform: scale(1);
    }
  }
}
</style>
