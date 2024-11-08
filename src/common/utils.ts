export async function getData(name: string) {
    const res = await fetch(`/src/data/${name}.json`);
    return await res.json()
}