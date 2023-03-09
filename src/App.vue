<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core';

import dayIcon from "@/assets/svg/day.svg"
import darkIcon from "@/assets/svg/dark.svg"
// import HelloWorld from './components/HelloWorld.vue'
const region = ref("zh")

const { locale: i18nLang } = useI18n()


const isDark = useDark()

const toggleDark = () => {
  useToggle(isDark)
}

const changeLang = (lang: string) => {
  i18nLang.value = lang
}

</script>

<template>
  <div class="navbar">
    
    <!-- <img alt="Vue logo" class="logo" src="logoIcon" width="64" height="64" /> -->
    <div class="vertical-header-right">
      <el-form inline=true>
      <el-form-item label="Lang">
        <el-select v-model="region" @change="changeLang(region)" style="width: 98px;">
          <el-option label="中文" value="zh" />
          <el-option label="English" value="en" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-switch @change="toggleDark()" v-model="isDark" inline-prompt :active-icon="darkIcon" :inactive-icon="dayIcon" />
      </el-form-item>
    </el-form>
    </div>

  </div>

  <RouterView />
</template>

<style scoped>
.el-form-item {
  margin-bottom: unset;
  margin-right: 10px;
}

.navbar {
    height: 48px;
    overflow: hidden;
    width: 100%;
}

.navbar .vertical-header-right {
    align-items: center;
    color: #000000d9;
    display: flex;
    height: 48px;
    justify-content: flex-end;
    min-width: 280px;
}

</style>
