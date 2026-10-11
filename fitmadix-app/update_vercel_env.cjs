const fs = require("fs");

const token = process.env.VERCEL_TOKEN || "";
const projectId = "prj_jiofWf1HnbMOyxjZqK2NpvCykdwy";

async function run() {
  const envContent = fs.readFileSync(".env", "utf-8");
  const vars = [];
  for (const line of envContent.split("\n")) {
    if (line.trim() && !line.startsWith("#") && line.includes("=")) {
      const [key, ...rest] = line.split("=");
      const val = rest.join("=").trim();
      if (key !== "VERCEL_TOKEN") {
        vars.push({
          type: "encrypted",
          key: key.trim(),
          value: val,
          target: ["production", "preview", "development"],
        });
      }
    }
  }

  for (const variable of vars) {
    const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variable),
    });
    console.log(`Setting ${variable.key}:`, res.status);
    const body = await res.json().catch(() => ({}));
    if (!res.ok && body.error && body.error.code === "ENV_ALREADY_EXISTS") {
      console.log(`${variable.key} already exists.`);
    } else if (!res.ok) {
      console.error(body);
    }
  }

  // Re-deploy on Vercel
  const deployRes = await fetch(`https://api.vercel.com/v13/deployments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "fitmadix-app",
      project: projectId,
      target: "production",
    }),
  });
  console.log(`Triggering new deployment:`, deployRes.status);
}
run();
