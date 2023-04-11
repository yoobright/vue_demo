<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
import Vue from 'vue'
import { ref, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'
// @ts-ignore
import WaveSurfer from 'wavesurfer.js'
// @ts-ignore
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js'
// @ts-ignore
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.js'
import audioUrl from '@/assets/canon.mp3'
import { colormapJet } from './colormap'
// @ts-ignore
// import colormap from 'colormap'
import Meyda from 'meyda/dist/node/main.js'
// @ts-ignore
import throttle from 'lodash.throttle'

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { HeatmapChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  DataZoomComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  HeatmapChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  DataZoomComponent,
]);



const { t } = useI18n()

let wavesurfer: any
const percentage = ref(0)
const zoomValue = ref(1)
const minZoom = ref(1)
const volumeValue = ref(100)

const progressDiv = ref()
const progressBar = ref()
const zoomSlider = ref()
const inputValue = ref()
const inputFile = ref()

const dialogVisible = ref(false)

function range(start: number, end: number) {
  return Array.apply(0, Array(end - 1))
    .map((element, index) => index + start);
}

const xMax = 420;
const yMax = 200;
const xData = range(0, xMax);
const yData = range(0, yMax);


function generateData() {
  let data = [];
  for (let i = 0; i <= xMax; i++) {
    for (let j = 0; j < yMax; j++) {
      data.push([i, j, Math.random() * 2 - 1]);
    }
  }
  return data;
}
const data = generateData();
const option = ref();
function initOption() {
  option.value = {
    tooltip: {},
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'category',
      data: yData
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        startValue: 0,
        endValue: 512
      }
    ],
    visualMap: {
      min: -1,
      max: 1,
      calculable: false,
      show: false,
      // orient: 'horizontal',
      bottom: 100,
      right: 20,
      realtime: false,
      inRange: {
        color: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026'
        ]
      }
    },
    series: [
      {
        name: 'Gaussian',
        type: 'heatmap',
        data: data,
        emphasis: {
          // itemStyle: {
          //   borderColor: '#333',
          //   borderWidth: 1
          // }
          disabled: true
        },
        progressive: 2000,
        animation: true,
        // silent: true,
      }
    ]
  }
}

// const colors = colormap({
//   colormap: 'jet',
//   nshades: 256,
//   format: 'float'
// });
// console.log(colors);

onMounted(() => {
  wavesurfer = WaveSurfer.create({
    container: '#wave',
    waveColor: '#95d475',
    progressColor: '#529b2e',
    scrollParent: true,
    // backend: 'MediaElementWebAudio',
    plugins: [
      Timeline.create({
        container: '#wave-timeline',
        primaryFontColor: '#337ecc',
        secondaryFontColor: '#337ecc'

      }),
      SpectrogramPlugin.create({
        wavesurfer: wavesurfer,
        container: '#wave-spectrogram',
        labels: true,
        height: 256,
        colorMap: colormapJet
      })
    ]
  })
  wavesurfer.load(audioUrl)
  // console.log(wavesurfer.params.minPxPerSec);
  zoomValue.value = wavesurfer.params.minPxPerSec

  const showProgress = function (percent: number) {
    progressDiv.value.style.display = 'block'
    percentage.value = percent
    // debugger;
  }

  const hideProgress = function () {
    progressDiv.value.style.display = 'none'
    initOption();
  }

  const seekFunction = function (percent: number) {
    console.log(percent)
  }

  const readyFunction = function () {
    console.log("ready")
    progressDiv.value.style.display = 'none'
    if (!option.value) {
      initOption();
    }
  }


  wavesurfer.on('loading', showProgress)
  wavesurfer.on('ready', hideProgress)
  wavesurfer.on('destroy', hideProgress)
  wavesurfer.on('error', hideProgress)
  wavesurfer.on('seek', seekFunction)
  wavesurfer.on('waveform-ready', readyFunction)

  // console.log(document.getElementById('heatmap'))
  // console.log("heatmap")

})

function getInputBuffer(length: number = 256, sampleSize: number = 512) {
  const bufferLength = wavesurfer.backend.buffer.length;
  const neededLength = length * sampleSize;
  const numberOfChannels = wavesurfer.backend.buffer.numberOfChannels;
  if (bufferLength < neededLength) {
    throw new Error('Buffer is too short for specified parameters');
  }
  const startPercents = wavesurfer.backend.getPlayedPercents();
  const startIndx = Math.round(startPercents * bufferLength);
  const endIndx = startIndx + neededLength;
  let inputStartIndex;
  let inputEndIndex;
  if (endIndx > bufferLength) {
    inputStartIndex = bufferLength - neededLength;
    inputEndIndex = bufferLength;
  } else {
    inputStartIndex = startIndx;
    inputEndIndex = endIndx;
  }

  const output = [];
  for (let n = 0; n < numberOfChannels; n++) {
    const channelData = wavesurfer.backend.buffer.getChannelData(n);
    output.push(channelData.slice(inputStartIndex, inputEndIndex));
  }

  return output;
}

function getAllfeature(featureName: string, length: number = 256, sampleSize: number = 512) {
  const bufferData = getInputBuffer(length, sampleSize);
  const numberOfChannels = bufferData.length;
  const res = [];
  for (let n = 0; n < numberOfChannels; n++) {
    const channelData = bufferData[n];
    for (let i = 0; i < channelData.length; i += Meyda.bufferSize) {
      const buffer = channelData.slice(i, i + Meyda.bufferSize);
      if (buffer.length < Meyda.bufferSize) {
        break;
      }
      res.push(Meyda.extract(featureName, buffer));
    }
  }
  return res;
}


const testFunction = throttle(() => {
  if (wavesurfer) {
    // console.log(wavesurfer.backend);
    const featureName = "amplitudeSpectrum";
    const numberOfChannels = wavesurfer.backend.buffer.numberOfChannels;
    const sampleSize = 512;
    const maxLen = 256;

    Meyda.bufferSize = sampleSize;
    Meyda.sampleRate = wavesurfer.backend.ac.sampleRate;
    const res = getAllfeature(featureName, maxLen, sampleSize);



    // console.log(res);
    // const xMax: number = res.length;
    const xMax: number = Math.min(res.length, maxLen);
    const yMax: number = Math.min(res[0].length, 256);
    const kMax: number = res.length / numberOfChannels;
    console.log(xMax, yMax, kMax);
    option.value.xAxis.data = range(0, xMax);
    option.value.yAxis.data = range(0, yMax);
    const data = [];
    let max = -Infinity;
    let min = Infinity;
    for (let i = 0; i < xMax; i++) {
      for (let j = 0; j < yMax; j++) {
        let d = 0;
        for (let k = 0; k < numberOfChannels; k++) {
          d += res[i + k * kMax][j];
        }
        d = Math.max(-80, Math.log10(d) * 20);
        if (d > max) {
          max = d;
        }
        if (d < min) {
          min = d;
        }
        data.push([i, j, d]);
      }
    }
    option.value.series[0].data = data;
    option.value.visualMap.min = min;
    option.value.visualMap.max = max;
    option.value.series[0].name = featureName;
    // dialogVisible.value = true
  }
},
  2000, {
  leading: true,
  trailing: false
})

const playPauseAudio = () => {
  if (wavesurfer) {
    wavesurfer.playPause()
  }
}

const changeZoom = () => {
  if (wavesurfer) {
    // wavesurfer.zoom(zoomValue.value);
    // wavesurfer.spectrogram.init();
    console.log(zoomValue)
  }
}

const changeVolume = () => {
  if (wavesurfer) {
    wavesurfer.setVolume(volumeValue.value / 100)
  }
}

const readFile = () => {
  const files = inputFile.value.input.files
  if (files.length > 0) {
    const file = files[0]
    if (wavesurfer.isReady) {
      wavesurfer.loadBlob(file)
    }

  }
}


</script>

<template>
  <el-main>
    <div class="footer-div">
      <h3>{{ t('test') }}</h3>
    </div>
    <div class="footer-div">
      <el-input style="width: 680px" type="file" ref="inputFile" @change="readFile()" v-model="inputValue" />
    </div>
    <div class="main-div">
      <el-card class="box-card">
        <div class="waveform" style="position: relative">
          <div ref="progressDiv" class="progress-div">
            <el-progress ref="progressBar" class="progress-bar" :text-inside="true" :stroke-width="20"
              :percentage="percentage" />
          </div>
          <div id="wave"></div>
          <div id="wave-timeline"></div>
          <div id="wave-spectrogram"></div>
        </div>
        <div style="height: 10px"></div>
        <div class="footer-div">
          <ElButton @click="playPauseAudio" style="width: 100px">{{ t('play_puase') }}</ElButton>
          <ElButton @click="testFunction" style="width: 100px">{{ t('test') }}</ElButton>
          <el-icon style="margin-left: 12px" :size="20">
            <i-ep-zoom-out />
          </el-icon>
          <el-slider @input="changeZoom" :min="1" :max="100" style="width: 100px; margin-left: 12px; margin-right: 12px"
            v-model="zoomValue" />
          <el-icon :size="20" style="margin-right: 12px">
            <i-ep-zoom-in />
          </el-icon>
          <el-icon :size="20">
            <i-ep-microphone />
          </el-icon>
          <el-slider @input="changeVolume" :min="0" :max="100" style="width: 100px; margin-left: 12px; margin-right: 12px"
            v-model="volumeValue" />
        </div>
      </el-card>
      <el-card class="box-card" style="height: 504px;">
        <div class="main-div">
          <v-chart class="heatmap" :option="option" autoresize />
        </div>
      </el-card>

    </div>
    <el-dialog v-model="dialogVisible" title="Tips" width="30%">

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-main>
</template>

<style>
.box-card {
  width: 680px;
}

.progress-div {
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 5px;
  right: 5px;
}

.main-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.footer-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.heatmap {
  height: 400px;
  width: 600px;
}
</style>
