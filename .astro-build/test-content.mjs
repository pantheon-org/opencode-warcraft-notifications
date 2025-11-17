import { getCollection } from 'astro:content';

const docs = await getCollection('docs');
console.log('Found docs:', docs.length);
docs.forEach(doc => console.log('  -', doc.slug));
