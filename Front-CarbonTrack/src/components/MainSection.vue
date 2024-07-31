<template>
    <section class="w-full py-12 md:py-24 lg:py-32 bg-light dark:bg-secondary overflow-hidden flex items-center justify-center">
        <div class="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_550px] items-center justify-center">
            <div class="space-y-4 animate-fadeIn text-center lg:text-left">
                <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary dark:text-light">
                    Calculez votre empreinte carbone avec CarbonTrack
                </h1>
                <p class="mx-auto text-primary dark:text-light md:text-xl lg:text-base xl:text-xl">
                    CarbonTrack est une application innovante qui vous permet de calculer facilement l'empreinte carbone
                    des matériaux de construction. Découvrez comment réduire votre impact environnemental et prenez des
                    décisions éclairées pour vos projets.
                </p>
                <div class="flex flex-col gap-2 sm:flex-row justify-center lg:justify-start">
                    <a class="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary text-light dark:bg-secondary px-8 text-sm font-medium shadow-sm transition-colors hover:bg-primary hover:text-light dark:hover:bg-primary dark:hover:text-light focus:outline-none focus:ring-2 focus:ring-primary"
                        href="#">
                        Découvrir l'application
                    </a>
                    <a class="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary text-light dark:bg-secondary px-8 text-sm font-medium shadow-sm transition-colors hover:bg-primary hover:text-light dark:hover:bg-primary dark:hover:text-light focus:outline-none focus:ring-2 focus:ring-primary"
                        href="#">
                        Contactez-nous
                    </a>
                </div>
            </div>
            <div class="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square animate-parallax">
                <img src="https://www.lumo-france.com/uploads/2024/02/developpement-durable-lumo.jpeg" width="550" height="550" alt="Hero" class="w-full h-full object-cover" />
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'MainSection'
}
</script>