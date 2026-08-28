async function testMultiVideoSources(query) {
  console.log("=== Testing DailyMotion Video API ===");
  try {
    const dmRes = await fetch(`https://api.dailymotion.com/videos?search=${encodeURIComponent(query)}&fields=id,title,description,thumbnail_720_url,thumbnail_480_url,thumbnail_240_url,url,duration,views_total,owner.screenname&limit=5`);
    const dmData = await dmRes.json();
    console.log(`DailyMotion returned ${dmData.list?.length || 0} videos:`);
    dmData.list?.slice(0, 2).forEach(v => {
      console.log(`  [DailyMotion] ${v.title} (${v.url})`);
    });
  } catch (err) {
    console.log("DailyMotion error:", err.message);
  }

  console.log("\n=== Testing Internet Archive Open Video Vault ===");
  try {
    const iaRes = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}+AND+mediatype:movies&fl[]=identifier,title,description,year,downloads&sort[]=downloads+desc&rows=5&page=1&output=json`);
    const iaData = await iaRes.json();
    const docs = iaData.response?.docs || [];
    console.log(`Internet Archive returned ${docs.length} videos:`);
    docs.slice(0, 2).forEach(d => {
      console.log(`  [Archive.org] ${d.title} (https://archive.org/details/${d.identifier})`);
    });
  } catch (err) {
    console.log("Archive error:", err.message);
  }
}

testMultiVideoSources('cricket match highlights');