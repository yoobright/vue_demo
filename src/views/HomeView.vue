<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
import Vue from "vue";
import { ref, onMounted } from 'vue'
// @ts-ignore
import WaveSurfer from 'wavesurfer.js'
// @ts-ignore
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js'
// import VueWaveSurfer from 'wavesurfer.js-vue'

let wavesurfer: any;
onMounted(() => {
  wavesurfer = WaveSurfer.create({
    container: '#wave',
    waveColor: 'violet',
    progressColor: 'purple',
    plugins: [
      Timeline.create({
      container: "#wave-timeline"
      })
    ] 
  });
  wavesurfer.load('https://wavesurfer-js.org/example/media/demo.wav');
})

const play_v = () => {
  wavesurfer.play();
}
const pause_v = () => {
  wavesurfer.pause();
}

</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <h1>测试</h1>
    <!-- <wavesurfer 
    ></wavesurfer> -->
    <el-card class="box-card">
      <div id="wave"></div>
      <div id="wave-timeline"></div>
      <div style="height: 10px;"></div>
      <ElButton v-on:click="play_v">播放</ElButton>
      <ElButton v-on:click="pause_v">暂停</ElButton>
    </el-card>
  </main>
</template>

<style>
  .box-card {
    width: 680px;
  }
</style>