async function handleBangSubmit(event) {
    event.preventDefault();
    const input = document.querySelector('input[type="text"]');
    const value = input.value.trim();
    const match = value.match(/^!(\S+)\s+(.+)/);
    let bang = null, query = null;
    if (match) {
        bang = match[1];
        query = match[2];
    } else {
        // if there's no bang then we'll use brave cuz FUCK DUCKDUCKGO!!!
        window.location.href = `https://search.brave.com/search?q=${encodeURIComponent(value)}`;
        return;
    }

    try {
        const response = await fetch('resources/lime.json');
        if (!response.ok) throw new Error('Failed to load bangs');
        const text = await response.text();
        // attempt parse as json array or object
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // if da parsing fails then we'll attempt to extract objects manually 
            const regex = /\{[^}]*"t"\s*:\s*"([^"]+)"[^}]*"u"\s*:\s*"([^"]+)"[^}]*\}/g;
            data = [];
            let m;
            while ((m = regex.exec(text)) !== null) {
                data.push({ t: m[1], u: m[2] });
            }
        }
        // find da bang
        const bangObj = Array.isArray(data)
            ? data.find(obj => obj.t === bang)
            : Object.values(data).find(obj => obj.t === bang);
        if (bangObj && bangObj.u) {
            const url = bangObj.u.replace(/\{\{\{s\}\}\}/g, encodeURIComponent(query));
            window.location.href = url;
            return;
        } else {
            // no bang, again we'll use brave (still, FUCK DUCKDUCK)
            window.location.href = `https://search.brave.com/search?q=${encodeURIComponent(value)}`;
        }
    } catch (err) {
        // sam e error flow as above ^^^^
        window.location.href = `https://search.brave.com/search?q=${encodeURIComponent(value)}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleBangSubmit);
    }
});