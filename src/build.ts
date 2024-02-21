import fs from "fs";
import { partsTable } from "./db";
import { ProductWithCategory } from "./types";

(async () => {
  console.log("🚀 Building parts.json...");
  const results = ((await partsTable.getAll()) as ProductWithCategory[]).filter(
    (r) => r.part !== null
  );

  const folder = "./output";
  const file = `${folder}/parts.json`;

  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(results, null, 2));

  console.log(`📦 ${results.length} parts written to ${file}`);
})();
