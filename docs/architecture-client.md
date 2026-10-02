# Clean architecture côté client

## Ce que c'est

La **clean architecture** (Robert C. Martin, 2012) range le code en couches
concentriques et impose **une seule règle** : les dépendances pointent toujours
vers l'intérieur. Le cœur, qui porte le métier, ne sait rien de ce qui
l'entoure.

L'idée tient en une phrase : **le framework est un détail**. Vue, axios, le
`localStorage`, l'API REST sont des choix techniques, remplaçables. Le fait
qu'une empreinte carbone soit la somme des empreintes de chaque matériau, lui,
ne change pas.

Trois conséquences pratiques :

| Bénéfice        | Concrètement                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| **Testable**    | Le métier se teste sans navigateur, sans serveur, sans DOM. Les 16 tests du domaine tournent en 140 ms. |
| **Remplaçable** | Passer d'axios à `fetch`, ou du `localStorage` à un cookie, ne touche qu'un fichier.                    |
| **Lisible**     | Une règle métier a un seul endroit où vivre. On sait où chercher.                                       |

Le prix à payer est réel : plus de fichiers, et une indirection de plus entre
un clic et un appel réseau. C'est un pari sur la durée de vie du projet.

## L'organisation retenue

Elle suit [l'article de Victor Misiko](https://medium.com/@victormisiko.vm/implementing-clean-architecture-in-a-vue-js-application-fd23b33ef488)
— trois couches `domain`, `data`, `presentation` — adaptée au fait que ce
client est en JavaScript et non en TypeScript.

```
apps/web/src/
├── domain/                   le métier, zéro dépendance
│   ├── entities/             User, Project, Material, Category, Footprint, Session
│   ├── repositories/         les contrats dont le métier a besoin
│   └── use-cases/            une action métier = une classe, une méthode execute()
│
├── data/                     les détails techniques
│   ├── http/                 le client axios
│   ├── models/               traduction des réponses de l'API en entités
│   ├── repositories/         implémentations HTTP des contrats
│   └── storage/              la session dans le localStorage
│
├── presentation/             Vue
│   ├── app/                  point d'entrée, App.vue, routeur
│   ├── stores/               état partagé (Pinia) — la couche « bloc » de l'article
│   ├── composables/          logique de vue réutilisable (toasts, pagination)
│   ├── components/           composants communs, dont le kit d'interface (ui/)
│   └── modules/              les pages, par domaine fonctionnel
│
└── container.js              racine de composition : qui implémente quoi
```

### La règle de dépendance

```
presentation  ──▶  domain  ◀──  data
                     ▲
                     │  le domaine ne pointe vers personne
```

- `domain/` n'importe **rien** d'autre que lui-même. Pas de Vue, pas d'axios.
- `data/` implémente les contrats que `domain/` déclare.
- `presentation/` appelle des cas d'usage, jamais l'API directement.
- `container.js` est le seul endroit qui connaît les deux côtés.

Cette règle est vérifiable d'un `grep` : aucun fichier de `domain/` ne
mentionne `vue`, `axios`, `window` ou `localStorage`.

## Les pièces

### Entités

Du métier et rien d'autre. `Footprint` porte les seuils (sobre, modéré, élevé),
la conversion en tonnes et l'équivalent en kilomètres parcourus — pas un
composant d'affichage, parce que ce sont des règles, pas des décorations.

```js
export class Footprint {
  get niveau() {
    if (this.kg < 1_000) return 'faible';
    if (this.kg < 10_000) return 'modere';
    return 'eleve';
  }
}
```

### Contrats de dépôts

L'article déclare des `interface` TypeScript. En JavaScript, ce sont des
classes abstraites : elles documentent le contrat et lèvent si une méthode
manque. Le domaine déclare **ce dont il a besoin** ; la couche data s'y
conforme.

### Cas d'usage

Une classe, une méthode `execute`, des dépôts reçus par le constructeur.
Jamais d'import direct d'un dépôt : c'est ce qui permet de les tester avec un
faux.

```js
export class CreateProject extends UseCase {
  async execute({ name, description, materials }) {
    return this.projectRepository.create({
      name,
      description,
      materials: verifierLignes(materials),
    });
  }
}
```

Tous les `execute` renvoient une promesse, y compris quand ils échouent sur une
règle avant tout appel réseau : un appelant n'a qu'un seul comportement à gérer.

### Modèles (couche data)

Le seul endroit qui connaît la forme exacte du JSON de l'API : `ProjectMaterial`
en PascalCase, les décimaux renvoyés en chaînes par Prisma, les champs
optionnels. Si l'API change, la correction tient ici.

### Stores (couche présentation)

Pinia porte l'état partagé. Un store appelle des cas d'usage, jamais l'API.

C'est aussi ce qui corrige un défaut de l'ancienne version : chaque composant
relisait le `localStorage` dans son `onMounted`, si bien que la barre de
navigation ne se mettait à jour qu'au remontage.

## Tester

```sh
npm test -w @carbontrack/web
```

Les tests du domaine ne démarrent **ni serveur, ni navigateur, ni base**. Un
cas d'usage reçoit un faux dépôt :

```js
const authRepository = { login: vi.fn().mockResolvedValue({ token: 'jwt' }) };
const sessionRepository = { save: vi.fn() };

await new Login({ authRepository, sessionRepository }).execute({ email, password });

expect(sessionRepository.save).toHaveBeenCalledWith('jwt');
```

## Les écarts assumés par rapport à l'article

| L'article                             | Ici                                    | Pourquoi                                                                                                                                                                       |
| ------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TypeScript, `interface`               | JavaScript, classes abstraites         | Le projet est en JavaScript ; on garde l'intention du contrat.                                                                                                                 |
| `Either<DataError, T>`                | Promesse, erreur levée                 | En JavaScript, `Either` demande une bibliothèque et beaucoup de cérémonie pour peu de gain ; le client HTTP traduit déjà les erreurs de l'API en `Error` porteuses du message. |
| Dossiers `bloc/` et `modules/`        | `stores/` et `modules/`                | `stores/` est le nom usuel dans l'écosystème Vue. Le rôle est le même.                                                                                                         |
| Injection par classe `BaseRepository` | Racine de composition (`container.js`) | Un seul endroit de câblage, plus simple à remplacer dans un test.                                                                                                              |
