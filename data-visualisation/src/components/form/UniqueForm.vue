<script setup lang="ts">
import { DateTime } from 'luxon';
import { useDescriptionStore } from "../../stores/description";
import { useModalStore } from "../../stores/modal";

const descriptions = useDescriptionStore()
const modal = useModalStore()

const handleFormSubmit = (e: SubmitEvent)=>{
  e.preventDefault()
  const description = e.target.description.value

  descriptions.list = [
    ...descriptions.list, 
    {
      type: 'unique' ,
      description, 
      label: descriptions.selectedPoint.label, 
      value: descriptions.selectedPoint.value
    }
  ]

  modal.closeModal()
}
</script>

<template>
  <form @submit="handleFormSubmit" v-if="!descriptions.isInterval">
    <h3 v-if="descriptions.selectedPoint">Ajouter une description pour le point <i>{{ descriptions.selectedPoint.label.setLocale('fr').toLocaleString(DateTime.DATETIME_SHORT) }}</i> qui a pour valeur <i>${{ descriptions.selectedPoint.value.toFixed(2) }}</i></h3>
    <div class="input-container">
      <label for="description">Description</label>
      <textarea name="description" id="description"></textarea>
    </div>
    
    <button type="submit">Sauvegarder</button>
  </form>
</template>

<style>
</style>