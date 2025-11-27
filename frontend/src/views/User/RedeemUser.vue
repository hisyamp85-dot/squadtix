<template>
  <UserLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" :breadcrumbs="breadcrumbs" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Redeem</h3>
      <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p>Redeem options here.</p>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import UserLayout from "@/components/layout/UserLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";

const route = useRoute();

const currentPageTitle = ref("Redeem");

const breadcrumbs = [
  { text: 'Home', to: `/${route.params.id}` },
  { text: 'Redeem', active: true }
];
</script>
