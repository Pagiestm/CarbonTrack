<template>
    <section class="w-full py-12 md:py-24 lg:py-32 bg-gray-400 bg-light dark:bg-secondary flex justify-center">
        <div class="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div class="grid grid-cols-2 gap-6 order-last lg:order-first">
                <AdvantageCard icon="M12 8V2 M8 22h8 M12 16v-6" title="Précision"
                    description="Des résultats précis grâce à une base de données exhaustive." />
                <AdvantageCard
                    icon="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 12r3"
                    title="Facilité d'utilisation"
                    description="Interface conviviale et intuitive pour une utilisation simplifiée." />
                <AdvantageCard icon="M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z" title="Rapidité"
                    description="Obtenez vos résultats en quelques clics seulement." />
                <AdvantageCard
                    icon="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 12r3"
                    title="Support" description="Une équipe dédiée pour répondre à toutes vos questions." />
            </div>
            <div class="space-y-4 animate-fadeIn">
                <div class="inline-block rounded-lg bg-gray-500 dark:bg-gray-700 px-3 py-1 text-sm text-gray-100">
                    Avantages
                </div>
                <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-100">
                    Pourquoi choisir CarbonTrack ?
                </h2>
                <p class="max-w-2xl text-gray-300 md:text-xl lg:text-base xl:text-xl">
                    CarbonTrack offre une solution complète et facile à utiliser pour calculer et réduire votre
                    empreinte
                    carbone. Découvrez les avantages de notre application pour vos projets de construction.
                </p>
            </div>
        </div>
    </section>
</template>

<script>
import AdvantageCard from './AdvantageCard.vue'

export default {
    name: 'AdvantagesSection',
    components: {
        AdvantageCard
    }
}
</script>