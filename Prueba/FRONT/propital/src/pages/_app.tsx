import 'react-phone-number-input/style.css';
import '@/styles/globals.css';
import '@/styles/phoneInput.css';
import '@/styles/map.css'
import type { AppProps } from 'next/app';
import { Layout, Loader } from '@/components';
import { Router } from 'next/router';
import { useEffect, useState } from 'react';
import { ToastProvider } from '@/hooks';

export default function App({ Component, pageProps }: AppProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Guardar referencias a las funciones para poder removerlas correctamente
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);
        const handleError = () => setLoading(false);

        Router.events.on('routeChangeStart', handleStart);
        Router.events.on('routeChangeComplete', handleComplete);
        Router.events.on('routeChangeError', handleError);

        // Cleanup: remover los event listeners usando las mismas referencias
        return () => {
            Router.events.off('routeChangeStart', handleStart);
            Router.events.off('routeChangeComplete', handleComplete);
            Router.events.off('routeChangeError', handleError);
        };
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <ToastProvider
            className={''}
            position={'bottom-center'}
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ToastProvider>
    );
}
