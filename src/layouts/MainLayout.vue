<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <nav class="flex-no-wrap relative flex w-full items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 py-4 shadow-lg">
      <div class="flex w-full flex-wrap items-center justify-between px-6">
        <!-- Logo or Brand Name -->
        <div class="flex items-center">
          <!-- You can add a logo here if you have one -->
          <!-- <img src="path/to/logo.png" alt="Sebrae Logo" class="h-10 w-10 mr-2"> -->
          <span class="text-white text-2xl font-bold tracking-wide">Sebrae</span>
        </div>
      </div>
    </nav>

    <!-- Conteúdo -->
    <main class="flex-1 flex justify-center items-center">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts"></script>