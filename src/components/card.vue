<template>
  <vue-resizable
    ref="card"
    :width="250"
    :height="300"
    :top="top"
    :left="left"
    :dragSelector="dragSelector"
    @drag:move="eHandler"
    @drag:end="noZindex"
  >
    <div class="card">
      <!--            <app-icon-->
      <!--              @clickIcon="deleteCardsItem"-->
      <!--              icon="cancel"-->
      <!--              class="card__close"-->
      <!--            />-->
      <div class="card__title">
        {{ cardData.title }}
      </div>
      <div class="card__body">
        <div class="card__body__text">
          {{ cardData.body }}
        </div>
      </div>
      <div
        class="card__link"
        ref="card__link"
        @click="lineDrawing('right')"
      ></div>
      <div
        class="card__link card__link_left"
        ref="card__link_left"
        @click="lineDrawing('left')"
      ></div>
    </div>
  </vue-resizable>
</template>
<script>
import VueResizable from "vue-resizable";
import { mapActions } from "vuex";
import iconWrapperVue from "./iconWrapper.vue";
export default {
  name: "Card",
  props: {
    cardData: {
      type: Object
    }
  },
  components: {
    VueResizable,
    "app-icon": iconWrapperVue
  },
  data() {
    return {
      dragSelector: ".card",
      top: 0,
      left: 0
    };
  },
  methods: {
    ...mapActions("cards", [
      "deleteCard",
      "setСoordinates",
      "lineDrawingVuex",
      "syncCoordinates"
    ]),
    eHandler(e) {
      let t = e;
      delete t.eventName;
      this.$refs.card.style.zIndex = "10000";
      let c_right = this.$refs.card__link.getBoundingClientRect(),
        c_left = this.$refs.card__link_left.getBoundingClientRect();
      this.setСoordinates({
        id: this.cardData.id,
        params: t,
        points: [
          { x: c_right.left + 8, y: c_right.top + 8 },
          { x: c_left.left + 8, y: c_left.top + 8 }
        ]
      });
      this.syncCoordinates({
        id: this.cardData.id,
        points: {
          right: { x: c_right.left + 8, y: c_right.top + 8 },
          left: { x: c_left.left + 8, y: c_left.top + 8 }
        }
      });
      // console.log(f.top);
      // console.log(f.left);
    },
    noZindex(e) {
      // this.eHandler(e);
      this.$refs.card.style.zIndex = "1000";
    },
    lineDrawing(side) {
      this.lineDrawingVuex({ id: this.cardData.id, side: side });
    },
    deleteCardsItem() {
      this.deleteCard(this.cardData.id);
    },
    setLinesFromLocalStorage() {
      this.setLinesFromLocalStorageVuex();
    }
  },
  mounted() {
    if (this.cardData.left) {
      this.top = this.cardData.top;
      this.left = this.cardData.left;
      return;
    }
    let c = this.$refs.card.$el.getBoundingClientRect(),
      t = {
        top: 0,
        left: 0
      };
    console.log(this.$refs);
    let c_right = this.$refs.card__link.getBoundingClientRect(),
      c_left = this.$refs.card__link_left.getBoundingClientRect();
    this.setСoordinates({
      id: this.cardData.id,
      params: t,
      points: [
        { x: c_right.left + 8, y: c_right.top + 8 },
        { x: c_left.left + 8, y: c_left.top + 8 }
      ]
    });
  }
};
</script>
<style lang="scss">
.resizable-component {
  padding: 15px;
}
.card {
  position: relative;
  height: 300px;
  width: 250px;
  border: 2px solid #000;
  background: black;
  border-radius: 10px;
  cursor: pointer;
  z-index: 1000;
  &:hover .card__close {
    display: block;
  }
  &__link {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 50%;
    right: 0;
    border: 3px solid #000;
    background: white;
    border-radius: 50%;
    transform: translate(55%, -50%);
    transition: 0.2s;
    &:hover {
      transform: translate(55%, -50%) scale(1.3);
    }
    &_left {
      right: unset;
      left: 0;
      transform: translate(-55%, -50%);
      &:hover {
        transform: translate(-55%, -50%) scale(1.3);
      }
    }
  }
  &__close {
    position: absolute;
    display: none;
    top: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
  }
  &__title {
    background: #fff;
    padding: 15px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    font-weight: 800;
    text-align: center;
  }
  &__body {
    color: #fff;
    padding: 4px 15px;
    &__text {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  }
}
</style>
