import { reactive } from 'vue';

export const usePasswordCriteria = () => {
  const criteres = reactive({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  const evaluer = (valeur = '') => {
    criteres.length = valeur.length >= 8;
    criteres.uppercase = /[A-Z]/.test(valeur);
    criteres.lowercase = /[a-z]/.test(valeur);
    criteres.number = /\d/.test(valeur);
    criteres.symbol = /[^A-Za-z\d\s]/.test(valeur);
  };

  const toutValide = () => Object.values(criteres).every(Boolean);

  return { criteres, evaluer, toutValide };
};
