<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
import Vue from "vue";
import { ref, onMounted } from 'vue'
// @ts-ignore
import WaveSurfer from 'wavesurfer.js'
// @ts-ignore
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js'
// @ts-ignore
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.js'
import audioUrl from '@/assets/canon.mp3'
import colormapHot from './colormap'

let wavesurfer: any;
const percentage = ref(0)
const progressDiv = ref();
const progressBar = ref();
const zoomValue = ref(0);

onMounted(() => {
  
  wavesurfer = WaveSurfer.create({
    container: '#wave',
    waveColor: 'violet',
    progressColor: 'purple',
    plugins: [
      Timeline.create({
        container: "#wave-timeline"
      }),
      SpectrogramPlugin.create({
        wavesurfer: wavesurfer,
        container: "#wave-spectrogram",
        labels: true,
        height: 256,
        colorMap: colormapHot,
      })
    ]
  });
  wavesurfer.load(audioUrl);

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


const playAudio = () => {
  if (wavesurfer) {
    wavesurfer.play();
  }

}
const pauseAudio = () => {
  if (wavesurfer) {
    wavesurfer.pause();
  }
}
</script>

<template>
  <main>
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
        <ElButton @click="playAudio">播放</ElButton>
        <ElButton @click="pauseAudio">暂停</ElButton>
        <el-icon style="margin-left: 12px" :size="20">
          <ZoomOut />
        </el-icon>
        <el-slider style="width: 100px; margin-left: 12px; margin-right: 12px;" v-model="zoomValue" />
        <el-icon :size="20">
          <ZoomIn />
        </el-icon>
      </div>

    </el-card>
  </main>
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

.footer-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}
</style>