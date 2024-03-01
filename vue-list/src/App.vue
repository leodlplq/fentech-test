<script setup lang="ts">
import { ref } from 'vue';
import useList from './composables/useList';

let item = ref<string | null>(null)
let input = ref<HTMLInputElement | null>(null)
let {items, addItems, deleteItem} = useList(item, input)

const handleClick = () => {
    addItems(item.value)
}

const handleKeyPress = (e: KeyboardEvent) => {
    if(e.key === 'Enter'){
        addItems(item.value)
    }
}
</script>

<template>
    <div class="input-container">
        <input type="text" v-model="item" placeholder="Add element to list" ref="input" @keypress="handleKeyPress">
        <button @click="handleClick">Add</button>
    </div>

    <ul class="list" v-auto-animate="{ duration: 100 }">
        <li v-for="(value, key) in items" @click="deleteItem(key)" :key="key">{{ value }}</li>
    </ul>
</template>

<style scoped>
.input-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.list {
    list-style-type: none;
    padding: 0;
    display: flex;
    gap: 5px;
    flex-direction: column;
}

.list>li {
    margin: 0;
    padding: 10px;
    background-color: #1e1e1e;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color .1s;
}

.list>li:hover {
    background-color: rgb(106, 0, 0);
}
</style>
