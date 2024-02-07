<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <div class="flex-1">
      <slot />
    </div>

    <footer class="h-32 bg-slate-300 mt-5 pt-5">
      <div
        class="px-5 mx-auto flex-wrap md:p-0 md:w-4/5 flex md:flex-nowrap justify-around"
      >
        <div
          class="text-center basis-full mb-3 md:basis-1/4 md:mb-0 md:mr-3 md:text-left"
        >
          About me:
        </div>
        <div class="basis-4/12 md:mr-3">Eugene Savenkov</div>
        <div class="basis-4/12 md:mr-3">
          <a
            href="https://github.com/zhenko?tab=repositories"
            target="_blank"
            class="underline flex"
          >
            <img
              src="assets/icons/github.svg"
              width="30"
              class="mr-2"
              alt="Github icon"
            />
            <span>Github</span>
          </a>
        </div>
        <div class="flex basis-4/12 items-start md:mr-3">
          <a href="https://t.me/Zhenko" target="_blank" class="underline flex">
            <img
              src="assets/icons/telegram.svg"
              width="30"
              class="mr-2"
              alt="Github icon"
            />
            <span>@Zhenko</span>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
