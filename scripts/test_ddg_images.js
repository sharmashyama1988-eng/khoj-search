async function testDuckDuckGoImages(query) {
  try {
    // Step 1: Get vqd token
    const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });
    const html = await tokenRes.text();
    const vqdMatch = html.match(/vqd=["']?([^"'\s&]+)/i) || html.match(/vqd=([^&]+)/i);
    const vqd = vqdMatch ? vqdMatch[1] : '';
    console.log("VQD Token:", vqd);

    if (vqd) {
      // Step 2: Fetch images with kp=-2 (SafeSearch OFF for unrestricted worldwide web results)
      const imgRes = await fetch(`https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&o=json&p=1&s=0&u=bing&f=,,,&l=us-en&vqd=${vqd}&p=1`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://duckduckgo.com/'
        }
      });
      const data = await imgRes.json();
      console.log(`Fetched ${data.results?.length || 0} images from Global Web Image Index!`);
      if (data.results && data.results.length > 0) {
        console.log("Sample Image 1:", data.results[0].title, "->", data.results[0].image);
        console.log("Sample Image 2:", data.results[1].title, "->", data.results[1].image);
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testDuckDuckGoImages('nature wallpapers 4k');