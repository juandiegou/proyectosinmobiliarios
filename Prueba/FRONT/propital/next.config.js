/** @type {import('next').NextConfig} */
const nextConfig = {
    // React Strict Mode causa doble renderizado INTENCIONAL en desarrollo
    // para ayudar a detectar efectos secundarios y bugs potenciales.
    // Esto es comportamiento esperado y NO afecta producción.
    reactStrictMode: true,
}

module.exports = nextConfig
