<template>
  <div v-if="show" class="fixed z-50 inset-0 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-surface-hover opacity-75"></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="relative inline-block align-middle bg-surface-raised rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-surface-raised px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-danger-soft sm:mx-0 sm:h-10 sm:w-10"
            >
              <svg
                class="h-6 w-6 text-danger"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-ink" id="modal-title">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-ink-subtle">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-surface-raised px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="confirm"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-xs px-4 py-2 bg-danger text-base font-medium text-surface hover:bg-danger focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-danger sm:ml-3 sm:w-auto sm:text-sm"
          >
            Supprimer
          </button>
          <button
            @click="cancel"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-line shadow-xs px-4 py-2 bg-surface-raised text-base font-medium text-ink-muted hover:bg-surface-raised sm:mt-0 sm:w-auto sm:text-sm"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>
