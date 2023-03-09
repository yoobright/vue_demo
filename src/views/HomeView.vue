<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
import Vue from "vue";
import { ref, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'
import WaveSurfer from 'wavesurfer.js'

// @ts-ignore
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js'
// @ts-ignore
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.js'
import audioUrl from '@/assets/canon.mp3'
import { colormapJet } from './colormap'
// @ts-ignore
// import colormap from 'colormap'

const { t } = useI18n()

let wavesurfer: any;
const percentage = ref(0)
const zoomValue = ref(1);
const minZoom = ref(1);
const volumeValue = ref(100);

const progressDiv = ref();
const progressBar = ref();
const zoomSlider = ref();

// const colors = colormap({
//   colormap: 'jet',
//   nshades: 256,
//   format: 'float'
// });
// console.log(colors);

onMounted(() => {

  wavesurfer = WaveSurfer.create({
    container: '#wave',
    waveColor: 'violet',
    progressColor: 'purple',
    scrollParent: true,
    // backend: 'MediaElement',
    plugins: [
      Timeline.create({
        container: "#wave-timeline"
      }),
      SpectrogramPlugin.create({
        wavesurfer: wavesurfer,
        container: "#wave-spectrogram",
        labels: true,
        height: 256,
        colorMap: colormapJet,
      })
    ]
  });
  wavesurfer.load(audioUrl);
  // console.log(wavesurfer.params.minPxPerSec);
  zoomValue.value = wavesurfer.params.minPxPerSec;

  const showProgress = function (percent: number) {
    progressDiv.value.style.display = 'block';
    percentage.value = percent;
    // debugger;
  };

  const hideProgress = function () {
    progressDiv.value.style.display = 'none';
  };

  wavesurfer.on('loading', showProgress);
  wavesurfer.on('ready', hideProgress);
  wavesurfer.on('destroy', hideProgress);
  wavesurfer.on('error', hideProgress);

})

const playPauseAudio = () => {
  if (wavesurfer) {
    wavesurfer.playPause();
  }

}

const changeZoom = () => {
  if (wavesurfer) {
    // wavesurfer.zoom(zoomValue.value);
    // wavesurfer.spectrogram.init();
    console.log(zoomValue);
  }
}

const changeVolume = () => {
  if (wavesurfer) {
    wavesurfer.setVolume(volumeValue.value / 100);
  }
}
</script>

<template>
  <el-main>
    <div class="footer-div">
      <h3>{{ t("test") }}</h3>
    </div>
    <div class="main-div">  
      <el-card class="box-card">
        <div class="waveform" style="position: relative;">
          <div ref="progressDiv" class="progress-div">
            <el-progress ref="progressBar" class="progress-bar" :text-inside="true" :stroke-width="20"
              :percentage="percentage" />
          </div>
          <div id="wave"></div>
          <div id="wave-timeline"></div>
          <div id="wave-spectrogram"></div>
        </div>
        <div style="height: 10px;"></div>
        <div class="footer-div">
          <ElButton @click="playPauseAudio" style="width: 100px;">{{ t("play_puase") }}</ElButton>
          <el-icon style="margin-left: 12px" :size="20">
            <i-ep-zoom-out />
          </el-icon>
          <el-slider @input="changeZoom" :min="1" :max="100" style="width: 100px; margin-left: 12px; margin-right: 12px;"
            v-model="zoomValue" />
          <el-icon :size="20" style="margin-right: 12px;">
            <i-ep-zoom-in />
          </el-icon>
          <el-icon :size="20">
            <i-ep-microphone />
          </el-icon>
          <el-slider @input="changeVolume" :min="0" :max="100"
            style="width: 100px; margin-left: 12px; margin-right: 12px;" v-model="volumeValue" />
        </div>
      </el-card>
    </div>
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
</style>
