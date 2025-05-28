export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-4">Welcome to Next.js!</h1>
        <p className="mb-2">Get started by editing <code>src/app/page.tsx</code></p>
    
        <a
          href="https://nextjs.org"
          className="text-blue-500 underline hover:text-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to nextjs.org
        </a>
      </main>
    );
  }