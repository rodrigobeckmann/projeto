<template>
  <div class="game-wrapper" style="display: flex; justify-content: center; flex-direction: column;">
    <div style="display: flex;">
      <button v-if="condition === 'playing'" @click="verifyWinCondition" style="margin: 20px;">Verificar
        resposta</button>
      <button @click="restartGame" v-else style="margin: 20px;">Reiniciar o jogo</button>
      <button @click="decreaseLevel" style="margin: 20px;">Diminuir dificuldade</button>
      <button @click="increaseLevel" style="margin: 20px;">Aumentar dificuldade</button>
    </div>
    <h1 v-if="condition !== 'playing'">{{ condition === "lose" ? "você perdeu" : "você venceu" }}</h1>
    <table class="game__table">
      <tr>
        <th v-for="head in headerArray" class="game__table-cell">
          <p v-if="head.type === 'variable'">{{ head.value }}</p>
          <p v-else>{{ stringifyProposition(head.value) }}</p>
        </th>
      </tr>
      <tr v-for="array, index1 in fieldsArray">
        <td v-for="j, index2 in array" @click="selectValue(index1, index2)" class="game__table-cell">
          {{ j }}
        </td>
      </tr>
    </table>

  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'

const headerArray = ref([])
const fieldsArray = ref([])
const winCondition = ref([])
const condition = ref("playing")
const usedVariables = ref([])
const resultArray = ref([])
const max = ref(1)
const variablesNum = ref(2)
const actualLevel = ref(0)

const possibleVariables = ["x", "y", "z", "w"]
const possibleConnectives = ["e", "ou"]

const levels = [
  { name: "easy", max: 1, variablesNum: 2 },
  { name: "normal", max: 2, variablesNum: 2 },
  { name: "hard", max: 2, variablesNum: 3 },
  { name: "veryHard", max: 2, variablesNum: 4 },
  { name: "almostImpossible", max: 3, variablesNum: 4 },
  { name: "godLevel", max: 4, variablesNum: 4 },
]

function stringifyProposition(proposition) {
  if (proposition.type === "variable") {
    return proposition.value;
  } else {
    const left = stringifyProposition(proposition.left);
    const right = stringifyProposition(proposition.right);
    const connective = proposition.connective
    return `(${left} ${connective} ${right})`;
  }
}

function getRandomVariable() {
  const availableVariables = possibleVariables.filter(variable => !usedVariables.value.includes(variable));
  if (availableVariables.length === 0) {
    throw new Error("Não há mais variáveis disponíveis.");
  }
  const randomIndex = Math.floor(Math.random() * availableVariables.length);
  const selectedVariable = availableVariables[randomIndex];
  return selectedVariable;
}

function generateRandomProposition(maxDepth = 1, currentDepth = 0) {
  if (currentDepth === maxDepth) {
    const randomVariable = usedVariables.value[Math.floor(Math.random() * usedVariables.value.length)];
    return { type: "variable", value: randomVariable };
  } else {
    const connective = possibleConnectives[Math.floor(Math.random() * possibleConnectives.length)];
    let leftProposition, rightProposition;
    do {
      leftProposition = generateRandomProposition(maxDepth, currentDepth + 1);
      rightProposition = generateRandomProposition(maxDepth, currentDepth + 1);
    } while (JSON.stringify(leftProposition) === JSON.stringify(rightProposition));

    return {
      type: "proposition",
      connective,
      left: leftProposition,
      right: rightProposition,
    };
  }
}

function mountHeader() {
  for (let i = 0; i < levels[actualLevel.value].variablesNum; i += 1) {
    const variable = getRandomVariable();
    usedVariables.value.push(variable);
    headerArray.value.push({ type: "variable", value: variable });
  }
  const proposition = generateRandomProposition(levels[actualLevel.value].max);
  headerArray.value.push({ type: "proposition", value: proposition });
}

function mountFields() {
  const rows = Math.pow(2, levels[actualLevel.value].variablesNum);
  const columns = levels[actualLevel.value].variablesNum;
  fieldsArray.value = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      const isTrue = (i & (1 << j)) !== 0;
      row.unshift(isTrue);
    }
    row.push(null);
    fieldsArray.value.push(row);
  }
}

function restartGame() {
  headerArray.value = []
  fieldsArray.value = []
  winCondition.value = []
  usedVariables.value = [];
  mountHeader()
  mountFields()
  mountWinCondition()
  condition.value = "playing"
}

function mountWinCondition() {
  winCondition.value = [];
  for (let i = 0; i < fieldsArray.value.length; i++) {
    const rowEvaluation = [];

    for (let j = 0; j < headerArray.value.length; j++) {
      if (headerArray.value[j].type === "variable") {
        rowEvaluation.push(fieldsArray.value[i][j])
      } else {
        const proposition = headerArray.value[j].value;
        const truthValues = fieldsArray.value[i].map(value => value === true);
        rowEvaluation.push(evaluateProposition(proposition, truthValues));
      }
    }
    winCondition.value.push(rowEvaluation);
  }
}

function evaluateProposition(proposition, truthValues) {
  if (proposition.type === "variable") {
    const index = headerArray.value.findIndex(obj => obj.value === proposition.value);
    return truthValues[index];
  } else {
    const leftResult = evaluateProposition(proposition.left, truthValues);
    const rightResult = evaluateProposition(proposition.right, truthValues);
    if (proposition.connective === "e") {
      return leftResult && rightResult;
    } else {
      return leftResult || rightResult;
    }
  }
}

function selectValue(arrayX, arrayY) {
  if (arrayY === 0 || arrayY === 1) {
    return
  }
  if (fieldsArray.value[arrayX][arrayY] === null) {
    return fieldsArray.value[arrayX][arrayY] = true
  }
  if (fieldsArray.value[arrayX][arrayY] === true) {
    return fieldsArray.value[arrayX][arrayY] = false
  }
  fieldsArray.value[arrayX][arrayY] = true
}

function verifyWinCondition() {
  resultArray.value = [];

  let gameWon = true;

  for (let i = 0; i < winCondition.value.length; i++) {
    let rowCorrect = true;

    for (let j = 0; j < winCondition.value[i].length; j++) {
      if (fieldsArray.value[i][j] !== winCondition.value[i][j]) {
        rowCorrect = false;
        gameWon = false;
        break;
      }
    }
    resultArray.value.push(rowCorrect);
  }
  condition.value = gameWon ? "win" : "lose";
}

function decreaseLevel() {
  if (actualLevel.value === 0) {
    return
  }
  actualLevel.value -= 1
  restartGame()
}

function increaseLevel() {
  if (actualLevel.value === levels.length - 1) {
    return
  }
  actualLevel.value += 1
  restartGame()
}

onBeforeMount(() => {
  mountHeader()
  mountFields()
  mountWinCondition()
})

</script>

<style scoped>
.game-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background-color: #a0a8a8;
  padding: 20px;
  border-radius: 10px;
  width: -moz-fit-content;
  width: fit-content;
}

.game__table {
  font-size: 20px;
  border-collapse: separate;
  border: 5px solid black;
  width: auto;
  border-radius: 10px;
}

.game__table-cell {
  border: 1px solid black;
  width: auto;
  height: 50px;
  text-align: center;
  min-width: 200px;
  vertical-align: middle;
}

.wrong {
  background-color: red;
}

.border-top-left {
  border-top-left-radius: 10px;
}

.border-top-right {
  border-top-right-radius: 10px;
}

.border-bottom-left {
  border-bottom-left-radius: 10px;
}

.border-bottom-right {
  border-bottom-right-radius: 10px;
}
</style>
