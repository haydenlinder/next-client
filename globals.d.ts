
interface Window {
    dataLayer: {
        push: (args: unknown) => []
    };
    gtag: (lang: string, id: Date | string) => void
}


window.gtag = window.dataLayer.push(arguments)