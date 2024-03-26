<template>
  <div>
    <h1>Jogo tabela verdade</h1>
    <h1 v-if="condition !== 'playing'">{{ condition === "lose" ? "você perdeu" : "você venceu" }}</h1>
    <table class="game__table">
      <tr>
        <th v-for="i in headerArray" class="game__table-cell">
          {{ i }}
        </th>
      </tr>
      <tr v-for="array, index1 in fieldsArray">
        <td v-for="j, index2 in array" @click="selectValue(index1, index2)" class="game__table-cell">
          {{ j }}
        </td>
      </tr>
    </table>
    <button @click="verifyWinCondition" style="margin: 20px;">Verificar resposta</button>
  </div>
</template>

<script setup>
import {ref, onBeforeMount} from 'vue'

const headerArray = ref([])
const fieldsArray = ref([])
const winCondition = ref([])
const condition = ref("playing")

function mountHeader() {
  headerArray.value = ["x", "y", "x e y", "x ou y"]
}

function mountFields() {
  const firstArray = ["verdadeiro", "falso", " ", " "]
  const secondArray = ["falso", "verdadeiro", " ", " "]
  const thirdArray = ["verdadeiro", "verdadeiro", " ", " "]
  const fourthArray = ["falso", "falso", " ", " "]
  fieldsArray.value.push(firstArray)
  fieldsArray.value.push(secondArray)
  fieldsArray.value.push(thirdArray)
  fieldsArray.value.push(fourthArray)
}

function mountWinCondition() {
  const firstArray = ["verdadeiro", "falso", "falso", "verdadeiro"]
  const secondArray = ["falso", "verdadeiro", "falso", "verdadeiro"]
  const thirdArray = ["verdadeiro", "verdadeiro", "verdadeiro", "verdadeiro"]
  const fourthArray = ["falso", "falso", "falso", "falso"]
  winCondition.value.push(firstArray)
  winCondition.value.push(secondArray)
  winCondition.value.push(thirdArray)
  winCondition.value.push(fourthArray)
}

function selectValue(arrayX, arrayY) {
  if (arrayY === 0 || arrayY === 1) {
    return
  }
  if (fieldsArray.value[arrayX][arrayY] === " ") {
    return fieldsArray.value[arrayX][arrayY] = "verdadeiro"
  }
  if (fieldsArray.value[arrayX][arrayY] === "verdadeiro") {
    return fieldsArray.value[arrayX][arrayY] = "falso"
  }
  fieldsArray.value[arrayX][arrayY] = "verdadeiro"
}

function verifyWinCondition() {
  for (const array of fieldsArray.value) {
    for (const value of array) {
      if (value !== 'verdadeiro' && value !== 'falso') {
        return alert("Preencha todos os campos");
      }
    }
  }

  for (let i = 0; i < fieldsArray.value.length; i++) {
    for (let j = 0; j < fieldsArray.value[i].length; j++) {
      if (fieldsArray.value[i][j] !== winCondition.value[i][j]) {
        return condition.value = "lose";
      }
    }
  }
  condition.value = "win"
}

onBeforeMount(() => {
  mountHeader()
  mountFields()
  mountWinCondition()
})

</script>

<style scoped>
.game__table {
  font-size: 20px;
  border-collapse: collapse;
  border: 1px solid black;
}

.game__table-cell {
  border: 1px solid black;
  width: 100px;
  height: 50px;
  text-align: center;
}
</style>
