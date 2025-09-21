
export default function Home() {
  return (
    <div className="font-sans  mx-auto p-6 ">
      <nav className="flex justify-between">
        <div>
          <p>Logo</p>
        </div>
        <div>
          <button>Sign In</button>
        </div>
      </nav>
      <div className="text-center h-screen flex flex-col justify-center items-center gap-8">
        <h1 className="text-5xl font-bold ">Find the Right Product, Together.</h1>
        <h3 className="text-2xl ">AI-powered search with real community insights.</h3>
        <div className="flex flex-col " >
          {/* Create a reusable React component in Next.js using Tailwind CSS that replicates this design:

A horizontally aligned dark input box with rounded corners.

Inside, the placeholder text should read: 'Ask v0 to build…' in a subtle, light gray font.

On the far left, place a small '+' icon button aligned vertically centered.

On the far right, add a square button with a subtle border containing an upward arrow icon (like a send button), also vertically centered.

The input area should expand to fill the remaining horizontal space between the two buttons.

The entire component should have a sleek, modern, dark theme aesthetic with smooth padding and spacing.

Use Tailwind utility classes for styling.

Ensure the component is responsive and looks good on both desktop and mobile. */}
          <textarea className="w-fit" />
          <button>Find Product</button>
        </div>
        <div>
          {/* An infitite coursal using react bits */}
          <p className="text-center">Powered By</p>
          <div className="flex justify-evenly">
            <p>Convex</p>
            <p>BetterAuth</p>
            <p>OpenAI</p>
          </div>
        </div>
      </div>
    
    </div>
  );
}
