<template>
  <div>
    <PageHeader eyebrow="Administration" :title="title" :subtitle="sousTitre">
      <template v-if="$slots.actions" #actions><slot name="actions" /></template>

    </PageHeader>


    <AppAlert v-if="erreur" class="mb-6">{{ erreur }}</AppAlert>


    <div class="mb-6 max-w-sm">
      <AppField
        :id="`recherche-${title}`"
        v-model="recherche"
        label="Rechercher"
        :icon="Search"
        :placeholder="searchPlaceholder"
        :required="false"
      />
    </div>


    <AppCard v-if="chargement" padding="p-4"><AppSkeleton :lines="8" height="h-6" /></AppCard>


    <EmptyState
      v-else-if="resultat.isEmpty"
      :icon="emptyIcon"
      :title="recherche ? 'Aucun résultat' : emptyTitle"
      :description="recherche ? `Rien ne correspond à « ${recherche} ».` : emptyDescription"
    />

    <template v-else>
      <slot :items="resultat.items" />
      <AppPagination v-model="page" :page="resultat" :loading="chargement" class="mt-6" />
    </template>

  </div>

</template>


<script setup>
import { computed } from 'vue';
import { Inbox, Search } from 'lucide-vue-next';
import { usePagedList } from '@/presentation/composables/usePagedList.js';
import PageHeader from '@/presentation/components/ui/PageHeader.vue';
import AppAlert from '@/presentation/components/ui/AppAlert.vue';
import AppCard from '@/presentation/components/ui/AppCard.vue';
import AppField from '@/presentation/components/ui/AppField.vue';
import AppPagination from '@/presentation/components/ui/AppPagination.vue';
import AppSkeleton from '@/presentation/components/ui/AppSkeleton.vue';
import EmptyState from '@/presentation/components/ui/EmptyState.vue';

const props = defineProps({
  title: { type: String, required: true },
  unite: { type: String, required: true },
  load: { type: Function, required: true },
  searchPlaceholder: { type: String, default: 'Rechercher…' },
  emptyIcon: { type: [Object, Function], default: () => Inbox },
  emptyTitle: { type: String, default: 'Rien à afficher' },
  emptyDescription: { type: String, default: '' },
});

const { resultat, page, recherche, chargement, erreur, rafraichir } = usePagedList(props.load);

const sousTitre = computed(() =>
  resultat.value.total ? `${resultat.value.total} ${props.unite}` : '',
);

defineExpose({ rafraichir });
rafraichir();
</script>

