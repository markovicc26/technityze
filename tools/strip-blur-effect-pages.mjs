import fs from "node:fs";
import path from "node:path";

const appDir = path.join(process.cwd(), "app");

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p);
    else if (name.name.endsWith(".tsx")) {
      let s = fs.readFileSync(p, "utf8");
      if (!s.includes("BlurEffect")) continue;
      s = s.replace(/^import BlurEffect from ["']@\/components\/common\/BlurEffect["'];\r?\n/m, "");
      s = s.replace(/^\s*<BlurEffect \/>\r?\n/m, "");
      fs.writeFileSync(p, s, "utf8");
      console.log("stripped", p);
    }
  }
}

walk(appDir);
