<template>
  <div style="display: flex; justify-content: center; flex-direction: column;">
    <h1>Jogo tabela verdade</h1>
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
    <button v-if="condition === 'playing'" @click="verifyWinCondition" style="margin: 20px;">Verificar resposta</button>
    <button @click="restartGame" v-else style="margin: 20px;">Reiniciar o jogo</button>
    <button @click="easy" style="margin: 20px;">Easy</button>
    <button @click="normal" style="margin: 20px;">Normal</button>
    <button @click="hard" style="margin: 20px;">Hard</button>
    <button @click="veryHard" style="margin: 20px;">Very Hard</button>
    <button @click="almostImpossible" style="margin: 20px;">Almost Impossible</button>
    <button @click="godLevel" style="margin: 20px;">God Level</button>
  </div>
</template>

<script setup>
import {ref, onBeforeMount} from 'vue'

const headerArray = ref([])
const fieldsArray = ref([])
const winCondition = ref([])
const condition = ref("playing")
const usedVariables = ref([])
const resultArray = ref([])
const max = ref(1)
const variablesNum = ref(2)

const possibleVariables = ["x", "y", "z", "w"]
const possibleConnectives = ["e", "ou"]

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
    const randomVariable = possibleVariables[Math.floor(Math.random() * possibleVariables.length)];
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
  for (let i = 0; i < variablesNum.value; i += 1) {
    const variable = getRandomVariable();
    usedVariables.value.push(variable);
    headerArray.value.push({ type: "variable", value: variable });
  }
  const proposition = generateRandomProposition(max.value);
  headerArray.value.push({ type: "proposition", value: proposition });
  usedVariables.value = [];
}

function mountFields() {
  const rows = Math.pow(2, variablesNum.value);
  const columns = variablesNum.value;
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

function easy() {
  max.value = 1
  variablesNum.value = 2
  restartGame()
}

function normal() {
  max.value = 2
  variablesNum.value = 2
  restartGame()
}

function hard() {
  max.value = 2
  variablesNum.value = 3
  restartGame()
}

function veryHard() {
  max.value = 2
  variablesNum.value = 4
  restartGame()
}

function almostImpossible() {
  max.value = 3
  variablesNum.value = 4
  restartGame()
}

function godLevel() {
  max.value = 4
  variablesNum.value = 4
  restartGame()
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
  width: auto;
}

.game__table-cell {
  border: 1px solid black;
  width: auto;
  height: 50px;
  text-align: center;
  min-width: 200px;
}

.wrong {
  background-color: red;
}
</style>
