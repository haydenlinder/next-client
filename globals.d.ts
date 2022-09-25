
interface Window {
    dataLayer: {
        push: (args: unknown) => []
    };
    gtag: (lang: string, id: Date | string, opts?: { send_to: string }) => void
}


