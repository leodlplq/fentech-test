import { defineStore } from "pinia";
import { ref } from "vue";

type DescriptionItem = {
  type: "unique" | "interval";
  description: string;
  label: string | null;
  value: string | null;
  first: {
    label: string | null;
    value: string | null;
  } | null;
  last: {
    label: string | null;
    value: string | null;
  } | null;
};

export const useDescriptionStore = defineStore("descriptions", () => {
  const list = ref<DescriptionItem[]>([]);
  const isInterval = ref<boolean>(false);
  const selectedInterval = ref(null);
  const selectedPoint = ref(null);

  return { list, selectedInterval, selectedPoint, isInterval };
});
