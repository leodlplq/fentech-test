<script setup lang="ts">
import { DateTime } from 'luxon';
import { useDescriptionStore } from "../../stores/description";
import { useModalStore } from '../../stores/modal';

const descriptions = useDescriptionStore()
const modal = useModalStore()

const handleIntervalFormSubmit = (e: SubmitEvent)=>{
  e.preventDefault()
  const description = e.target.description.value

  descriptions.list = [
    ...descriptions.list, 
    {
      type: 'interval',
      description, 
      ...descriptions.selectedInterval
    }
  ]

  modal.closeModal()
  descriptions.isInterval = false
}
</script>

<template>
  <form @submit="handleIntervalFormSubmit">
    <h3 v-if="descriptions.selectedInterval">Ajouter une description pour l'interval <i>{{ descriptions.selectedInterval.first.label.setLocale('fr').toLocaleString(DateTime.DATETIME_SHORT) }} -> {{ descriptions.selectedInterval.last.label.setLocale('fr').toLocaleString(DateTime.DATETIME_SHORT) }}</i></h3>
    <div class="input-container">
      <label for="description">Description</label>
      <textarea name="description" id="description"></textarea>
    </div>
    
    <button type="submit">Sauvegarder</button>
  </form>
</template>

<style>
</style>