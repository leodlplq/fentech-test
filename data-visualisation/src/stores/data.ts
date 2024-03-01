import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataStore = defineStore("data", () => {
  const data = ref();
  const loaded = ref<boolean>(false);

  return { data, loaded };
});
