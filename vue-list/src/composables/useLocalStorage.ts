export default function useLocalStorage() {
  const read = (key: string) => {
    return JSON.parse(localStorage.getItem(key) || "{}");
  };

  const write = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return { read, write };
}
