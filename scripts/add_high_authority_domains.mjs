import fs from 'fs';

console.log("==================================================");
console.log("ENRICHING KHOJ GLOBAL DNS & AUTHORITY DOMAINS");
console.log("==================================================");

const dnsList = JSON.parse(fs.readFileSync('db/dns_global_domains.json', 'utf-8'));
const seenDomains = new Set(dnsList.map(d => d.domain.toLowerCase()));

function addDomain(name, domain, category, desc, tags = []) {
  const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  if (!cleanDomain || seenDomains.has(cleanDomain)) return;
  seenDomains.add(cleanDomain);

  dnsList.push({
    name,
    domain: cleanDomain,
    url: `https://${cleanDomain}`,
    category,
    desc,
    tags: Array.from(new Set([
      name.toLowerCase(),
      cleanDomain,
      cleanDomain.split('.')[0],
      ...tags.map(t => t.toLowerCase().trim())
    ])).filter(Boolean)
  });
}

const HIGH_PRIORITY_DOMAINS = [
  // 1. Blogging & Publishing Networks
  { n: 'Medium', d: 'medium.com', c: 'Publishing & Articles', desc: 'World premier publishing platform for human-written essays, engineering articles, and ideas.', t: ['medium', 'blog', 'article', 'writing', 'stories'] },
  { n: 'Substack', d: 'substack.com', c: 'Newsletters & Independent Journalism', desc: 'Leading platform for independent newsletters, expert analysis, and publications.', t: ['substack', 'newsletter', 'journalism', 'writers', 'articles'] },
  { n: 'WordPress', d: 'wordpress.org', c: 'Blogging & CMS', desc: 'Open-source web publishing software and world largest content management platform.', t: ['wordpress', 'wp', 'cms', 'blog', 'plugins'] },
  { n: 'WordPress.com', d: 'wordpress.com', c: 'Blogging & Web Hosting', desc: 'Hosted blogging and web creation platform powered by WordPress.', t: ['wordpress.com', 'blogs', 'sites'] },
  { n: 'Ghost', d: 'ghost.org', c: 'Blogging & Creators', desc: 'Modern open-source publishing platform built for independent creators and media teams.', t: ['ghost', 'ghost blog', 'publishing', 'newsletters'] },
  { n: 'Blogger', d: 'blogger.com', c: 'Blogging & Google', desc: 'Google free, reliable web publishing and blogging service.', t: ['blogger', 'blogspot', 'free blog'] },
  { n: 'Tumblr', d: 'tumblr.com', c: 'Microblogging & Community', desc: 'Microblogging and social networking platform for art, culture, and visual media.', t: ['tumblr', 'blogs', 'fandom', 'art'] },
  { n: 'LiveJournal', d: 'livejournal.com', c: 'Community & Journals', desc: 'Global online community for personal journaling, discussions, and diaries.', t: ['livejournal', 'journal', 'community'] },
  { n: 'Wix', d: 'wix.com', c: 'Website Builder', desc: 'Cloud-based web development and SEO-optimized website creation suite.', t: ['wix', 'website builder', 'portfolio', 'store'] },
  { n: 'Squarespace', d: 'squarespace.com', c: 'Website Builder & Design', desc: 'All-in-one website creation platform with award-winning design templates.', t: ['squarespace', 'domains', 'builder', 'design'] },
  { n: 'Webflow', d: 'webflow.com', c: 'Visual Web Development', desc: 'Visual web design, animations, CMS, and hosting for modern digital experiences.', t: ['webflow', 'no code', 'web design', 'ui'] },

  // 2. Technical, Coding & Developer Blogs
  { n: 'DEV Community', d: 'dev.to', c: 'Developer & Coding Blog', desc: 'Constructive and inclusive social network for software developers to share tutorials.', t: ['dev.to', 'dev', 'coding blog', 'tutorials', 'javascript', 'python'] },
  { n: 'Hashnode', d: 'hashnode.com', c: 'Developer Blogging', desc: 'Free developer blogging platform and engineering community for software engineers.', t: ['hashnode', 'tech blog', 'engineering', 'articles'] },
  { n: 'GitHub Pages', d: 'github.io', c: 'Open Source & Developer Portfolios', desc: 'Websites for developers, open source projects, documentation, and personal blogs.', t: ['github.io', 'github pages', 'portfolio', 'docs'] },
  { n: 'HackerNoon', d: 'hackernoon.com', c: 'Tech & AI Publication', desc: 'Independent technology publication covering AI, blockchain, cybersecurity, and coding.', t: ['hackernoon', 'tech news', 'ai', 'crypto', 'programming'] },
  { n: 'FreeCodeCamp', d: 'freecodecamp.org', c: 'Coding & Learning', desc: 'Non-profit community that teaches people to code with interactive projects and certifications.', t: ['freecodecamp', 'learn coding', 'web dev', 'html', 'python'] },
  { n: 'GeeksforGeeks', d: 'geeksforgeeks.org', c: 'Computer Science & DSA', desc: 'Computer science portal for DSA, algorithms, competitive programming, and interview prep.', t: ['geeksforgeeks', 'gfg', 'dsa', 'algorithms', 'interview questions'] },
  { n: 'CSS-Tricks', d: 'css-tricks.com', c: 'Web Design & CSS', desc: 'Articles, videos, and guides on CSS, HTML, JavaScript, and responsive web design.', t: ['css tricks', 'css', 'frontend', 'flexbox', 'grid'] },
  { n: 'Smashing Magazine', d: 'smashingmagazine.com', c: 'Web Design & UX', desc: 'Professional magazine for web designers and developers on UI, UX, and performance.', t: ['smashing magazine', 'ux', 'ui design', 'accessibility'] },
  { n: 'Hacker News', d: 'news.ycombinator.com', c: 'Tech & Startup Discussions', desc: 'Social news website focusing on computer science, technology, and entrepreneurship by Y Combinator.', t: ['hacker news', 'ycombinator', 'hn', 'startups', 'tech discussion'] },

  // 3. Business, Career & Professional Blogs
  { n: 'LinkedIn Pulse', d: 'linkedin.com', c: 'Professional & Business Articles', desc: 'Professional thought leadership, industry case studies, and career guidance.', t: ['linkedin', 'pulse', 'business', 'careers', 'networking'] },
  { n: 'HubSpot Blog', d: 'hubspot.com', c: 'Marketing & Sales', desc: 'Authority inbound marketing, sales, customer service, and business strategy guides.', t: ['hubspot', 'marketing', 'sales', 'seo', 'crm'] },
  { n: 'Harvard Business Review', d: 'hbr.org', c: 'Management & Strategy', desc: 'World premier management and leadership research, case studies, and executive insights.', t: ['hbr', 'harvard business review', 'management', 'leadership', 'strategy'] },
  { n: 'Entrepreneur', d: 'entrepreneur.com', c: 'Startups & Small Business', desc: 'Advice, insight, and profiles for entrepreneurs, founders, and small business owners.', t: ['entrepreneur', 'startups', 'funding', 'business ideas'] },
  { n: 'Fast Company', d: 'fastcompany.com', c: 'Innovation & Design', desc: 'Progressive business media brand with focus on innovation in technology, leadership, and design.', t: ['fast company', 'innovation', 'design', 'future'] },
  { n: 'TechCrunch', d: 'techcrunch.com', c: 'Startups & Venture Capital', desc: 'Breaking technology news, startup profiles, venture capital funding, and analysis.', t: ['techcrunch', 'startups', 'vc funding', 'silicon valley'] },

  // 4. Community, Q&A & Authentic Opinion Platforms
  { n: 'Reddit', d: 'reddit.com', c: 'Community & Real Discussions', desc: 'Unfiltered human discussions, real product reviews, recommendations, and communities.', t: ['reddit', 'forum', 'reviews', 'opinions', 'community'] },
  { n: 'Quora', d: 'quora.com', c: 'Q&A & Knowledge Sharing', desc: 'Question-and-answer platform where questions are asked, answered, followed, and edited by users.', t: ['quora', 'q&a', 'answers', 'questions', 'opinions'] },
  { n: 'Indie Hackers', d: 'indiehackers.com', c: 'Solopreneurs & Startups', desc: 'Community of bootstrap founders and solopreneurs sharing revenue, stories, and growth strategies.', t: ['indie hackers', 'solopreneur', 'saas', 'bootstrap', 'mrr'] },
  { n: 'Product Hunt', d: 'producthunt.com', c: 'Product Launches & Tech', desc: 'Curation of the best new products in tech, apps, AI tools, and startups every day.', t: ['product hunt', 'launches', 'ai tools', 'apps'] },
  { n: 'Stack Exchange', d: 'stackexchange.com', c: 'Expert Q&A Network', desc: 'Network of 170+ Q&A communities across science, math, physics, linguistics, and technology.', t: ['stack exchange', 'ask ubuntu', 'super user', 'server fault'] },

  // 5. Knowledge, How-To & Academic Tutorials
  { n: 'wikiHow', d: 'wikihow.com', c: 'How-to & Step-by-Step Guides', desc: 'World leading how-to website with step-by-step illustrations for learning how to do anything.', t: ['wikihow', 'how to', 'guide', 'steps', 'tutorial', 'learn'] },
  { n: 'Instructables', d: 'instructables.com', c: 'DIY & Hands-on Projects', desc: 'Community for people who like to make things with step-by-step DIY projects in electronics, craft, and code.', t: ['instructables', 'diy', 'arduino', 'craft', 'projects'] },
  { n: 'Khan Academy', d: 'khanacademy.org', c: 'Free Online Education', desc: 'Free world-class education for anyone, anywhere in math, physics, chemistry, biology, and CS.', t: ['khan academy', 'maths', 'science', 'free courses', 'lectures'] },
  { n: 'Coursera', d: 'coursera.org', c: 'Online Degrees & Certificates', desc: 'Online courses and degrees from leading universities like Stanford, Yale, Google, and IBM.', t: ['coursera', 'certificates', 'online degree', 'courses'] },

  // 6. Creative, Portfolio & Visual Design
  { n: 'Behance', d: 'behance.net', c: 'Design & Creative Portfolios', desc: 'Adobe premier creative showcase for graphic design, UI/UX, branding, and typography.', t: ['behance', 'design portfolio', 'ui', 'ux', 'branding', 'typography'] },
  { n: 'Dribbble', d: 'dribbble.com', c: 'Design Showcase & UX/UI', desc: 'Community for designers and creative professionals to share work, process, and current projects.', t: ['dribbble', 'ui design', 'app design', 'illustrations', 'mockups'] },
  { n: 'Pinterest', d: 'pinterest.com', c: 'Visual Inspiration & Ideas', desc: 'Visual discovery engine for finding ideas like home decor, style, art, recipes, and creative design.', t: ['pinterest', 'pins', 'ideas', 'aesthetic', 'moodboard'] },
  { n: 'DeviantArt', d: 'deviantart.com', c: 'Digital Art & Community', desc: 'Largest online social community for artists and art enthusiasts showcasing digital paintings and anime.', t: ['deviantart', 'digital art', 'paintings', 'illustrations', 'anime art'] },
  { n: 'ArtStation', d: 'artstation.com', c: '3D Art & Game Concepts', desc: 'Leading showcase platform for games, film, media & entertainment artists.', t: ['artstation', '3d art', 'game design', 'concept art'] },
  { n: 'Unsplash', d: 'unsplash.com', c: 'High-Res Free Photography', desc: 'Beautiful, free images and photos that you can download and use for any project.', t: ['unsplash', 'stock photos', 'wallpapers', 'photography'] }
];

HIGH_PRIORITY_DOMAINS.forEach(item => {
  addDomain(item.n, item.d, item.c, item.desc, item.t);
});

console.log(`✓ Total Verified Global Domains in DNS: ${dnsList.length}`);
fs.writeFileSync('db/dns_global_domains.json', JSON.stringify(dnsList, null, 2), 'utf-8');
const size = (fs.statSync('db/dns_global_domains.json').size / (1024 * 1024)).toFixed(2);
console.log(`✓ Saved db/dns_global_domains.json (${size} MB)!`);