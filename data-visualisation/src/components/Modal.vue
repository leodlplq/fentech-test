<template>
  <transition name="modal-fade">
    <div v-if="modal.isOpen" class="modal-overlay" @click.self="modal.closeModal" >
      <div class="modal">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button @click="modal.closeModal">X</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useModalStore } from "../stores/modal";

const modal = useModalStore()

const props = defineProps({
  title: { type: String, default: 'Modal' },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
}

.modal {
  background-color: rgb(54, 54, 54);
  height: calc(100%);
  width: 500px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.modal-header button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}
</style>
