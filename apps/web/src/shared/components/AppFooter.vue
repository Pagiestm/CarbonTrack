<template>
    <footer class="bg-gray-800 py-6">
        <div class="container mx-auto px-4 md:px-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <!-- Section 1: About -->
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-gray-100">À propos</h3>
                    <p class="text-gray-300">CarbonTrack est une solution innovante pour suivre et réduire votre
                        empreinte carbone dans les projets de construction.</p>
                </div>
                <!-- Section 2: Links -->
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-gray-100">Liens utiles</h3>
                    <ul class="space-y-2">
                        <li><a href="#hero" class="text-gray-300 hover:text-gray-100">Accueil</a></li>
                        <li><a href="#about" class="text-gray-300 hover:text-gray-100">À propos</a></li>
                        <li><a href="#features" class="text-gray-300 hover:text-gray-100">Fonctionnalités</a></li>
                        <li><a href="#advantages" class="text-gray-300 hover:text-gray-100">Avantages</a></li>
                    </ul>
                </div>
                <!-- Section 3: Social Media -->
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-gray-100">Suivez-nous</h3>
                    <div class="flex space-x-4 justify-center">
                        <!-- Facebook -->
                        <a href="#" class="text-gray-300 hover:text-gray-100">
                            <svg class="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M22.675 0h-21.35C.595 0 0 .595 0 1.325v21.351C0 23.405.595 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.595 1.325-1.324V1.325C24 .595 23.405 0 22.675 0z" />
                            </svg>
                        </a>
                        <!-- Twitter -->
                        <a href="#" class="text-gray-300 hover:text-gray-100">
                            <svg class="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.897-.959-2.178-1.559-3.594-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.087-.205-7.719-2.165-10.148-5.144-.422.722-.666 1.561-.666 2.457 0 1.697.863 3.197 2.173 4.078-.803-.026-1.56-.247-2.228-.616v.061c0 2.367 1.684 4.342 3.918 4.788-.41.111-.84.171-1.285.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.6 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.395 0-.779-.023-1.158-.067 2.179 1.397 4.768 2.213 7.548 2.213 9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.015-.634.961-.695 1.8-1.562 2.46-2.549z" />
                            </svg>
                        </a>
                        <!-- LinkedIn -->
                        <a href="#" class="text-gray-300 hover:text-gray-100">
                            <svg class="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.5c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.86-3.06-1.86 0-2.14 1.45-2.14 2.95v5.71h-3.56V9h3.42v1.56h.05c.48-.91 1.66-1.86 3.42-1.86 3.66 0 4.34 2.41 4.34 5.54v6.21z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div class="mt-6 border-t border-gray-500 pt-4 text-center text-gray-300">
                © 2024 CarbonTrack. Tous droits réservés.
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>