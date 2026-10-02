import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { useFormErrors } from '@/presentation/composables/useFormErrors.js';

describe('useFormErrors', () => {
  it('range une erreur locale sous son champ', () => {
    const erreurs = useFormErrors(['email']);
    erreurs.poser('email', 'Format invalide');
    expect(erreurs.etat.parChamp.email).toBe('Format invalide');
    expect(erreurs.aDesErreurs()).toBe(true);
  });

  it('range les détails de l’API sous les champs connus', () => {
    const erreurs = useFormErrors(['email', 'password']);
    erreurs.depuisApi({
      message: 'Requête invalide',
      details: [
        { field: 'email', message: 'Cet email est déjà utilisé' },
        { field: 'password', message: 'Trop court' },
      ],
    });

    expect(erreurs.etat.parChamp.email).toBe('Cet email est déjà utilisé');
    expect(erreurs.etat.parChamp.password).toBe('Trop court');
    expect(erreurs.etat.general).toBe('');
  });

  it('retient la racine d’un chemin imbriqué', () => {
    const erreurs = useFormErrors(['materials']);
    erreurs.depuisApi({
      message: 'x',
      details: [{ field: 'materials.0.quantity', message: 'Quantité invalide' }],
    });
    expect(erreurs.etat.parChamp.materials).toBe('Quantité invalide');
  });

  it('bascule en message général ce qui ne correspond à aucun champ', () => {
    const erreurs = useFormErrors(['email']);
    erreurs.depuisApi({ message: 'x', details: [{ field: 'inconnu', message: 'Souci' }] });
    expect(erreurs.etat.general).toBe('Souci');
  });

  it('affiche le message brut quand l’API ne détaille rien', () => {
    const erreurs = useFormErrors(['email']);
    erreurs.depuisApi({ message: 'Serveur injoignable' });
    expect(erreurs.etat.general).toBe('Serveur injoignable');
  });

  it('se vide entièrement', () => {
    const erreurs = useFormErrors(['email']);
    erreurs.poser('email', 'x');
    erreurs.depuisApi({ message: 'y' });
    erreurs.reinitialiser();
    expect(erreurs.etat.parChamp).toEqual({});
    expect(erreurs.etat.general).toBe('');
    expect(erreurs.aDesErreurs()).toBe(false);
  });

  it('oublie une erreur de champ corrigée', () => {
    const erreurs = useFormErrors(['email']);
    erreurs.poser('email', 'x');
    erreurs.oublier('email');
    expect(erreurs.etat.parChamp.email).toBeUndefined();
  });

  it('se déballe correctement dans un template', async () => {
    const erreurs = useFormErrors(['email']);
    const composant = mount({
      template: '<p v-if="erreurs.etat.general">{{ erreurs.etat.general }}</p>',
      setup: () => ({ erreurs }),
    });

    expect(composant.find('p').exists()).toBe(false);

    erreurs.depuisApi({ message: 'Serveur injoignable' });
    await composant.vm.$nextTick();

    expect(composant.find('p').text()).toBe('Serveur injoignable');
  });
});
