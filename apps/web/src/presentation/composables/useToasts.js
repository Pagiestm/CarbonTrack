import { readonly, ref } from 'vue';

const toasts = ref([]);
let suivant = 0;

const ajouter = (ton, message, duree) => {
  const id = (suivant += 1);
  toasts.value.push({ id, ton, message });
  if (duree) setTimeout(() => retirer(id), duree);
  return id;
};

const retirer = (id) => {
  toasts.value = toasts.value.filter((t) => t.id !== id);
};

export const useToasts = () => ({
  toasts: readonly(toasts),
  retirer,
  succes: (message, duree = 4000) => ajouter('success', message, duree),
  erreur: (message, duree = 7000) => ajouter('danger', message, duree),
  info: (message, duree = 5000) => ajouter('info', message, duree),
});
