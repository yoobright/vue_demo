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
  <header>
    <!-- <img alt="Vue logo" class="logo" src="logoIcon" width="64" height="64" /> -->
    <el-form-item label="Lang">
      <el-select v-model="region" @change="changeLang(region)" style="width: 98px;">
        <el-option label="中文" value="zh" />
        <el-option label="English" value="en" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-switch @change="toggleDark()" v-model="isDark" :active-icon="dayIcon"
      :inactive-icon="darkIcon"/>
    </el-form-item>




    <!-- <div class="wrapper"> -->
    <!-- <HelloWorld msg="You did it!" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav> -->
    <!-- </div> -->
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.el-form-item {
  margin-bottom: unset;
}


</style>
