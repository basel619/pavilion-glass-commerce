import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Manually parse .env
const envFile = fs.readFileSync(".env", "utf8");
const env = {};
envFile.split("\n").forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : "";
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.SUPABASE_URL || "https://lfjsophdrgxytibojyow.supabase.co";
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Inserting demo banners...");

  // Clear existing banners
  const { error: deleteError } = await supabase
    .from("banners")
    .delete()
    .neq("title", "___NON_EXISTENT___"); 

  if (deleteError) {
    console.error("Delete error:", deleteError);
  }

  const { data: data1, error: error1 } = await supabase.from("banners").insert([
    {
      title: "عروض لابتوبات الجيل الجديد الفاخرة",
      image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
      link: "/shop",
      order_index: 1,
      active: true
    },
    {
      title: "قطع غيار واكسسوارات حصرية ومكفولة",
      image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
      link: "/categories",
      order_index: 2,
      active: true
    }
  ]).select();

  if (error1) {
    console.error("Error inserting banners:", error1);
  } else {
    console.log("Successfully inserted banners:", data1);
  }
}

run();
