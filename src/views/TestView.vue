

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import  SimpleHeatmap from '@/utils/heatmap'


function range(start: number, end: number) {
  return Array.apply(0, Array(end - 1))
    .map((element, index) => index + start);
}

const xMax = 100;
const yMax = 100;
const xData = range(0, xMax);
const yData = range(0, yMax);

const randomInRange = () => Math.floor(Math.random() * (255 - 0) + 0)
const heatmap = ref()


function generateData(): number[][] {
    const data: number[][] = []
    for (let i = 0; i < xMax; i++) {
        data[i] = []
        for (let j = 0; j < yMax; j++) {
            data[i][j] = Math.random() * 100
        }
    }
    return data
}

function normalData(data: number[][]) {
    let min = Infinity
    let max = -Infinity
    for (let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].length; j++) {
            if (data[i][j] < min) {
                min = data[i][j]
            }
            if (data[i][j] > max) {
                max = data[i][j]
            }
        }
    }
    const range = max - min
    for (let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].length; j++) {
            data[i][j] = Math.round(((data[i][j] - min) / range) * 255)
        }
    }
}


onMounted(() => {
    const data = generateData();
    normalData(data)
    heatmap.value = new SimpleHeatmap(
        {
            container: "#map-test",
            width: 400,
            height: 400,
        }
    )
    heatmap.value.setData(data)
})

const handleClick = () => {
    console.log('click')
    const data = generateData();
    normalData(data)
    heatmap.value.setData(data)
}

</script>

<template>
    <div class="main-div">
        <el-card class="box-card" style="height: 640px;">
        <div class="main-div">
            <div id="map-test"></div>
        </div>
        <div class="footer-div">
            <el-button type="primary" @click="handleClick">点击</el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <style>
.main-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
  </style>
  