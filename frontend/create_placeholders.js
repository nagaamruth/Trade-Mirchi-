const fs = require('fs');
const path = require('path');

const routes = [
  'live-prices',
  'network',
  'analytics',
  'about',
  'login',
  'register',
  'admin/customers',
  'admin/settings'
];

routes.forEach(route => {
  const dirPath = path.join(__dirname, 'src', 'app', route);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const componentName = route.split('/').pop().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const title = route.split('/').pop().split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const content = `
export default function ${componentName.charAt(0).toUpperCase() + componentName.slice(1)}Page() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">${title}</h1>
        <p className="text-muted-foreground">This page is under construction.</p>
      </div>
    </main>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content.trim());
});

console.log("Placeholder pages created!");
