<template>
    <section class="w-full py-12 md:py-24 lg:py-32 bg-light dark:bg-secondary flex justify-center items-center">
        <div class="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div class="space-y-4 flex flex-col items-start">
                <div
                    class="inline-block rounded-lg bg-primary dark:bg-primary px-3 py-1 text-sm text-light dark:text-light">
                    Fonctionnalités
                </div>
                <h2
                    class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary dark:text-light">
                    Calculez votre impact environnemental
                </h2>
                <p class="mx-auto text-primary dark:text-light md:text-xl lg:text-base xl:text-xl">
                    CarbonTrack vous permet de calculer facilement l'empreinte carbone des matériaux de construction
                    utilisés dans vos projets. Accédez à une base de données exhaustive et personnalisez vos calculs
                    pour obtenir des résultats précis.
                </p>
            </div>
            <div class="grid grid-cols-2 gap-6">
                <FeatureCard icon="M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z"
                    title="Calcul d'empreinte carbone"
                    description="Calculez l'impact environnemental de vos matériaux de construction." />
                <FeatureCard
                    icon="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 12r3"
                    title="Base de données exhaustive"
                    description="Accédez à une base de données complète sur les matériaux de construction." />
                <FeatureCard
                    icon="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 12r3"
                    title="Personnalisation des calculs"
                    description="Personnalisez vos calculs en fonction de vos besoins spécifiques." />
                <FeatureCard icon="M12 8V2 M8 22h8 M12 16v-6" title="Rapports détaillés"
                    description="Générez des rapports détaillés pour analyser vos résultats." />
            </div>
        </div>
    </section>
</template>

<script>
import FeatureCard from './FeatureCard.vue'

export default {
    name: 'FeaturesSection',
    components: {
        FeatureCard
    }
}
</script>