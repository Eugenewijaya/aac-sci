import { db } from "../lib/db/index";
import { vocabularyCards, appSettings } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Updating vocabularyCards...");
  await db.update(vocabularyCards)
    .set({ word: "Blueberi" })
    .where(eq(vocabularyCards.word, "Bluberi"));

  console.log("Updating appSettings...");
  const settings = await db.query.appSettings.findMany();
  for (const s of settings) {
    try {
      const map = JSON.parse(s.pronunciationMap);
      map["cuaca"] = "chuacha";
      map["blueberi"] = "blu beh ri";
      
      await db.update(appSettings)
        .set({ pronunciationMap: JSON.stringify(map) })
        .where(eq(appSettings.id, s.id));
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Done");
  process.exit(0);
}

main();
