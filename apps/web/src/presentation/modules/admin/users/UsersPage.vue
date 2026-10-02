<template>
  <AdminList
    ref="liste"
    title="Comptes"
    unite="comptes"
    :load="charger"
    search-placeholder="Nom, email ou entreprise…"
    :empty-icon="Users"
    empty-title="Aucun compte"
  >
    <template #default="{ items }">
      <div class="overflow-x-auto rounded-card border border-line">
        <table class="w-full min-w-[52rem] text-sm">
          <thead class="bg-surface-overlay text-left">
            <tr>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Compte</th>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Fonction</th>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Ville</th>
              <th scope="col" class="px-4 py-3 text-right font-medium text-ink-muted">Projets</th>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Inscrit</th>
              <th scope="col" class="px-4 py-3 font-medium text-ink-muted">Rôle</th>
              <th scope="col" class="px-4 py-3 text-right font-medium text-ink-muted">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line bg-surface-raised">
            <tr v-for="compte in items" :key="compte.id" class="hover:bg-surface-overlay">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <span
                    class="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent"
                  >
                    {{ compte.initials || '?' }}
                  </span>
                  <div class="min-w-0">
                    <p class="truncate font-medium text-ink">{{ compte.name }}</p>
                    <p class="truncate text-xs text-ink-subtle">{{ compte.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-ink-muted">{{ compte.subtitle ?? '—' }}</td>
              <td class="px-4 py-3 text-ink-muted">{{ compte.city ?? '—' }}</td>
              <td class="px-4 py-3 text-right tabular-nums text-ink">
                {{ compte.projectCount ?? 0 }}
              </td>
              <td class="px-4 py-3 text-ink-muted">{{ formatDate(compte.createdAt) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <AppBadge :tone="compte.isAdmin ? 'accent' : 'neutral'">
                    {{ compte.isAdmin ? 'Administrateur' : 'Utilisateur' }}
                  </AppBadge>
                  <AppBadge v-if="compte.isGoogleAccount">Google</AppBadge>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-1">
                  <AppButton
                    variant="ghost"
                    size="sm"
                    :icon="compte.isAdmin ? ShieldOff : ShieldCheck"
                    :disabled="estMoi(compte) || bascule === compte.id"
                    :aria-label="compte.isAdmin ? 'Retirer les droits' : 'Donner les droits'"
                    @click="basculerRole(compte)"
                  />
                  <AppButton
                    variant="ghost"
                    size="sm"
                    :icon="Trash2"
                    :disabled="estMoi(compte)"
                    :aria-label="`Supprimer ${compte.name}`"
                    @click="aSupprimer = compte"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </AdminList>

  <ConfirmDialog
    v-if="aSupprimer"
    :title="`Supprimer le compte de ${aSupprimer.name} ?`"
    :description="`Ses ${aSupprimer.projectCount ?? 0} projet(s) seront effacés avec lui.`"
    :loading="suppression"
    @cancel="aSupprimer = null"
    @confirm="supprimer"
  />
</template>

<script setup>
import { ref } from 'vue';
import { ShieldCheck, ShieldOff, Trash2, Users } from 'lucide-vue-next';
import { useCases } from '@/container.js';
import { useSessionStore } from '@/presentation/stores/session.js';
import { useToasts } from '@/presentation/composables/useToasts.js';
import AppBadge from '@/presentation/components/ui/AppBadge.vue';
import AppButton from '@/presentation/components/ui/AppButton.vue';
import ConfirmDialog from '@/presentation/components/ui/ConfirmDialog.vue';
import AdminList from '@/presentation/modules/admin/components/AdminList.vue';

const session = useSessionStore();
const toasts = useToasts();
const liste = ref(null);
const aSupprimer = ref(null);
const suppression = ref(false);
const bascule = ref(null);

const charger = (options) => useCases.users.listUsers.execute(options);

const estMoi = (compte) => compte.id === session.session?.userId;

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

const basculerRole = async (compte) => {
  bascule.value = compte.id;
  const nouveau = compte.isAdmin ? 'USER' : 'ADMIN';
  try {
    await useCases.users.changeUserRole.execute(compte.id, nouveau);
    toasts.succes(
      nouveau === 'ADMIN'
        ? `${compte.name} est désormais administrateur.`
        : `${compte.name} redevient utilisateur.`,
    );
    await liste.value.rafraichir();
  } catch (e) {
    toasts.erreur(e.message);
  } finally {
    bascule.value = null;
  }
};

const supprimer = async () => {
  suppression.value = true;
  try {
    const nom = aSupprimer.value.name;
    await useCases.users.deleteUser.execute(aSupprimer.value.id);
    aSupprimer.value = null;
    toasts.succes(`Compte de ${nom} supprimé.`);
    await liste.value.rafraichir();
  } catch (e) {
    toasts.erreur(e.message);
    aSupprimer.value = null;
  } finally {
    suppression.value = false;
  }
};
</script>
