export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Firebase Forms. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by Next.js & Genkit</p>
      </div>
    </footer>
  );
}
