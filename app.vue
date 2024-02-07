<template>
  <NuxtLayout>
    <div v-if="loading" class="flex flex-col justify-center items-center p-5">
      <div class="mb-5">Please, wait</div>
      <img
        src="assets/images/loading.gif"
        alt="loading"
        width="50"
        heigt="50"
      />
    </div>
    <div v-else>
      <div class="bg-slate-500 flex items-center mb-5 justify-center">
        <div class="relative">
          <span class="px-2">Seacrh</span>
          <input
            type="text"
            name="search"
            placeholder="type package"
            v-model="search"
            class="py-2 pl-2 pr-8"
          />
          <img
            v-if="search.length"
            src="assets/icons/cross.svg"
            width="15"
            height="15"
            alt="close"
            @click="closeSearch"
            class="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
          />
        </div>
      </div>
      <table class="flex flex-col mx-auto w-full md:w-4/5">
        <thead>
          <tr class="border-b border-red-500 px-3 hidden md:flex">
            <th class="basis-1/5 text-left py-2 px-0">Name</th>
            <th class="basis-1/5 text-center py-2 px-0">Link to statistic</th>
            <th class="basis-1/5 text-center py-2 px-0">Type</th>
            <th class="basis-1/5 text-center py-2 px-0">Bandwidth</th>
            <th class="basis-1/5 text-right py-2 px-0">Hits</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="flex cursor-pointer odd:bg-slate-100 px-3 hover:bg-slate-200 flex-col md:flex-row items-end md:items-start"
            v-for="pack in currentPageItems"
            :key="pack.name"
            @click="showName(pack)"
          >
            <td
              class="before:content-['Name:'] before:absolute before:left-5 md:before:hidden basis-1/5 truncate text-left"
            >
              {{ pack.name }}
            </td>
            <td
              class="before:content-['Open:'] before:absolute before:left-5 md:before:hidden basis-1/5 text-center"
            >
              <a
                class="hover:underline"
                target="_blank"
                :href="pack.links.self"
                @click.stop
                >Open in new windows</a
              >
            </td>
            <td
              class="basis-1/5 text-center before:content-['Type:'] before:absolute before:left-5 md:before:hidden"
            >
              {{ pack.type }}
            </td>
            <td
              class="basis-1/5 text-center before:content-['Bandwidth:'] before:absolute before:left-5 md:before:hidden"
            >
              {{ pack.bandwidth }}
            </td>
            <td
              class="basis-1/5 text-right before:content-['Hits:'] before:absolute before:left-5 md:before:hidden"
            >
              {{ pack.hits }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!search.length" class="flex justify-between w-72 mx-auto mt-5">
        <button
          :class="{ 'pointer-events-none opacity-50': currentPage === 0 }"
          @click="currentPage--"
          :disabled="currentPage === 0"
          class="bg-red-500 rounded px-5 py-2 text-white hover:cursor-pointer hover:bg-red-900 w-32"
        >
          Previous
        </button>
        <button
          :class="{
            'pointer-events-none opacity-50':
              currentPage >= Math.ceil(packages.length / ITEMS_PER_PAGE) - 1,
          }"
          @click="currentPage++"
          :disabled="
            currentPage >= Math.ceil(packages.length / ITEMS_PER_PAGE) - 1
          "
          class="bg-red-500 rounded px-5 py-2 text-white hover:cursor-pointer hover:bg-red-900 w-32"
        >
          Next
        </button>
      </div>
    </div>

    <Transition name="fade" v-show="showModal">
      <div
        v-if="selectedPackage"
        :class="{ hidden: !showModal }"
        class="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-slate-700 flex items-center justify-center"
        @click="hideModal"
      >
        <div @click.stop class="bg-slate-50 w-4/5 md:w-1/2 h-2/3 p-5 relative">
          <img
            src="assets/icons/cross.svg"
            width="15"
            height="15"
            alt="close"
            @click="hideModal"
            class="absolute top-3 right-3 cursor-pointer"
          />
          <p>Name: {{ selectedPackage.name }}</p>
          <p>Type: {{ selectedPackage.type }}</p>
          <p>Bandwidth: {{ selectedPackage.bandwidth }}</p>
          <p>
            Link:
            <a :href="selectedPackage.links.self" target="_blank">
              {{ selectedPackage.name }}
            </a>
          </p>
          <p>Hits: {{ selectedPackage.hits }}</p>
          <p>Tags: {{ selectedPackage.tags.latest }}</p>
          <p class="line-clamp-4">Versions: {{ selectedPackage.versions }}</p>
        </div>
      </div>
    </Transition>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";

interface Packages {
  name: string;
  links: {
    self: string;
  };
  type: string;
  bandwidth: number;
  hits: number;
}

interface Package extends Packages {
  tags: {
    latest: string;
  };
  versions: string[];
}

const ITEMS_PER_PAGE = 10;

const loading = ref(true);
const packages = ref<Packages[]>([]);
const currentPage = ref(0);
const search = ref("");

let selectedPackage = ref<Package>();

let showModal = ref(false);

onMounted(async () => {
  if (packages.value.length === 0) {
    await fetchPackages();
    loading.value = false;
  }
});

const fetchPackages = async () => {
  try {
    const response = await fetch("https://data.jsdelivr.com/v1/stats/packages");
    const data = await response.json();
    packages.value = data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const currentPageItems = computed(() => {
  let filtered = filteredPackages.value;

  const startIndex = currentPage.value * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return filtered.slice(startIndex, endIndex);
});

const showName = (pack: Packages) => {
  if (pack.name) {
    fetchPackageData(pack.name);
  } else {
    console.error(`Package ${pack.name} is not found`);
  }

  showModal.value = !showModal.value;
};

const hideModal = () => {
  showModal.value = !showModal.value;
};

async function fetchPackageData(packageName: string) {
  try {
    const response = await fetch(
      `https://data.jsdelivr.com/v1/package/npm/${packageName}`
    );
    const data = await response.json();
    console.log("packageName", data);

    const foundPackage = currentPageItems.value.find(
      (item) => item.name === packageName
    );
    if (foundPackage) {
      selectedPackage.value = {
        name: foundPackage.name,
        type: foundPackage.type,
        bandwidth: foundPackage.bandwidth,
        hits: foundPackage.hits,
        links: {
          self: foundPackage.links.self,
        },
        tags: {
          latest: data.tags.latest,
        },
        versions: data.versions,
      };
    } else {
      console.error(`Package ${packageName} is not found in currentPageItems`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const filteredPackages = computed(() => {
  let filtered = packages.value;

  if (search.value.trim() !== "") {
    filtered = packages.value.filter((pack) => {
      return pack.name.toLowerCase().includes(search.value.toLowerCase());
    });
  }

  return filtered;
});

const closeSearch = () => {
  search.value = "";
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
  /* transition: opacity 2s ease; */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
