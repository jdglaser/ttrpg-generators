export async function getData(name: string) {
    const res = await fetch(`/src/data/${name}.json`);
    return await res.json()
}

export function sample<T>(arr: T[], select: number = 1) {
    const results: T[] = []
    while (results.length < select) {
        const selection = arr[Math.floor(Math.random() * arr.length)]
        if (!results.includes(selection)) {
            results.push(selection)
        }
    }
    return results
}

export function copyToClipboard(text: string) {
    const blob = new Blob([text], { type: 'text/html' });
    const clipboardItem = new window.ClipboardItem({ 'text/html': blob });
    navigator.clipboard.write([clipboardItem]);
}