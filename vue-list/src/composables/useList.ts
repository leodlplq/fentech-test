// a composable that handle adding elements to a list and save it to localStorage
import { v4 as uuidv4 } from "uuid";
import { ref, Ref } from "vue";
import useLocalStorage from "./useLocalStorage";

export default function useList(
  item: Ref<string | null>,
  input: Ref<HTMLInputElement | null>
) {
  const { read, write } = useLocalStorage();
  let items = ref<Record<string, string | null>>(read("list"));

  const addItems = (value: string | null) => {
    if (value !== null && value.trim() !== "") {
      const key = uuidv4();
      items.value[key] = value?.trim();
    }

    write("vue-list", items.value);

    item.value = null;
    if (input.value) {
      input.value.focus();
    }
  };

  const deleteItem = (key: string) => {
    delete items.value[key];
    write("vue-list", items.value);
  };

  return { items, addItems, deleteItem };
}
