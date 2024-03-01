<template>
  <ul class="table" v-if="data?.length > 0">
    <li v-for="item in data">
      <span v-if="item.type === 'unique'">{{ item.label.setLocale('fr').toLocaleString(DateTime.DATETIME_SHORT) }}</span>
      <span v-else><span>{{ item.first.label.setLocale('fr').toLocaleString(DateTime.DATETIME_SHORT) }}</span> <span>➡️</span> <span>{{ item.last.label.setLocale('fr').toLocaleString(DateTime.DATETIME_SHORT) }}</span></span>
      <span>{{ item.description }}</span>
    </li>
  </ul>
  <span v-else>No data found</span>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { defineProps } from 'vue';

const props = defineProps({
  data: Array,
});
</script>

<style scoped>
  ul{
    font-size: 16px;
    list-style-type: none;
    border: 1px solid rgb(198, 198, 198);
    margin: 0;
    padding: 0;
    border-radius: 5px;
  }

  li{
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 3fr;
    flex-direction: column;
  }

  li>span{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 7px;
  }

  ul>li:not(:first-child){
    border-top: 1px solid rgb(198, 198, 198);
  }
  li>span:last-child{
    border-left: 1px solid rgb(198, 198, 198);
  }
</style>
