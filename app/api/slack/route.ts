export async function POST() {
  return Response.json({ status: "disabled", message: "Slack webhook integration disabled in SIGPRI" });
}
