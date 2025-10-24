// Pre-Entrega Node.js (ECM) - by Carlos Javier Sigot
// Permite ejecutar comandos GET, POST y DELETE contra la API FakeStore

const URL = 'https://fakestoreapi.com/products';

function uso() {
    console.log(`
Uso:
    node index.js GET products
    node index.js GET products/<id>
    node index.js POST products <title> <price> <category>
    node index.js DELETE products/<id>

Ejemplos:
    node index.js GET products
    node index.js GET products/5
    node index.js POST products "Remera Node" 100 "ropa"
    node index.js DELETE products/10
`);
    process.exit(0);
}

function parseArgs(argv) {
    const [, , command, resourceAndMaybeId, ...rest] = argv;
    if (!command || !resourceAndMaybeId) return null;
    const [resource, id] = resourceAndMaybeId.split('/');
    return {
    command: command.toUpperCase(),
    resource,
    id,
    extra: rest
    };
}

async function haceGETaTodo() {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`Error ${res.status} al obtener productos`);
    const data = await res.json();
    console.table(
    data.map(p => ({
        id: p.id,
        Descripcion: p.title,
        Precio: `$${p.price}`,
        Categoria: p.category
    }))
    );
}

async function haceGETporId(id) {
    if (!id) throw new Error('Falta ID para GET producto/<id>');
    const res = await fetch(`${URL}/${id}`);
    if (res.status === 404) return console.log(`Producto ${id} no encontrado`);
    const p = await res.json();
    console.log(JSON.stringify(p, null, 2));
}

async function hacePOST(extraArgs) {
    if (extraArgs.length < 3)
    throw new Error('POST requiere: products <title> <price> <category>');

    const [title, priceStr, ...catParts] = extraArgs;
    const price = Number(priceStr);
    const category = catParts.join(' ') || 'uncategorized';

    const body = {
    title,
    price,
    description: 'Producto creado desde CLI de pre-entrega',
    category
    };

    const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
    });

    const creado = await res.json();
    console.log('Producto creado:');
    console.log(JSON.stringify(created, null, 2));
}

async function haceBorrado(id) {
    if (!id) throw new Error('Falta ID para DELETE producto/<id>');
    const res = await fetch(`${URL}/${id}`, { method: 'DELETE' });
    const body = await res.json();
    console.log('Resultado DELETE:');
    console.log(JSON.stringify(body, null, 2));
}

async function principal() {
    const args = parseArgs(process.argv);
    if (!args) return uso();

    const { command, resource, id, extra } = args;
    if (resource !== 'products') return usage();

    try {
    if (command === 'GET') {
        id ? await haceGETporId(id) : await haceGETaTodo();
    } else if (command === 'POST') {
        await hacePOST(extra);
    } else if (command === 'DELETE') {
        await haceBorrado(id);
    } else {
        uso();
    }
    } catch (err) {
    console.error('Error:', err.message);
    }
}

principal();