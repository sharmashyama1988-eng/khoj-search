async function testImagesAndVideos() {
  console.log("==================================================");
  console.log("TESTING MULTI-SOURCE IMAGES & VIDEOS FETCHING");
  console.log("==================================================");

  // Test Image Token + Fetcher
  const query = 'sunset beach 4k wallpaper';
  console.log(`\n1. Fetching Global Images for: "${query}"`);
  
  const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await tokenRes.text();
  const vqdMatch = html.match(/vqd=["']?([^"'\s&]+)/i) || html.match(/vqd=([^&]+)/i);
  const vqd = vqdMatch ? vqdMatch[1] : '';

  if (vqd) {
    const imgRes = await fetch(`https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&o=json&p=1&s=0&u=bing&f=,,,&l=us-en&vqd=${vqd}&p=1`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const imgData = await imgRes.json();
    console.log(`✓ Retrieved ${imgData.results?.length || 0} Global Images from across the Web!`);
    imgData.results?.slice(0, 3).forEach((img, i) => {
      console.log(`   Image #${i+1}: ${img.title.slice(0, 40)}... -> ${img.image}`);
    });
  }

  // Test Multi-platform Video APIs
  const vQuery = 'supercar racing';
  console.log(`\n2. Fetching Multi-Platform Videos for: "${vQuery}"`);
  const dmRes = await fetch(`https://api.dailymotion.com/videos?search=${encodeURIComponent(vQuery)}&fields=id,title,url&limit=3`);
  const dmData = await dmRes.json();
  console.log(`✓ DailyMotion returned ${dmData.list?.length || 0} videos`);

  const iaRes = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(vQuery)}+AND+mediatype:movies&fl[]=identifier,title&rows=3&page=1&output=json`);
  const iaData = await iaRes.json();
  console.log(`✓ Internet Archive returned ${iaData.response?.docs?.length || 0} videos`);
}

testImagesAndVideos();