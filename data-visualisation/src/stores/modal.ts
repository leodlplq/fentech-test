import { defineStore } from "pinia";
import { ref } from "vue";
import { useDescriptionStore } from "./description";

export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false);

  const descriptions = useDescriptionStore();

  const openModal = () => {
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    descriptions.isInterval = false;
  };
  return { isOpen, closeModal, openModal };
});
