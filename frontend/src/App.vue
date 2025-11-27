<script setup lang="ts">
const testApi = async () => {
  const res = await fetch('/api/hello');
  const data = await res.json();
  console.log(data);
};

testApi();
</script>

<template>
  <h1>Squadtix Frontend Connected!</h1>
</template>
