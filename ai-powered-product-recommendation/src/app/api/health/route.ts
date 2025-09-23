export async function GET() {
  return new Response(JSON.stringify({ message: "Hello from auth route" }), {
    status: 200,
  });
}
