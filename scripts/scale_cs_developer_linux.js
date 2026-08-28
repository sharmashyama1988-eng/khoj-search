const { saveDb } = require('./db_helper.js');

console.log("=== SCALE BATCH 2: COMPUTER SCIENCE & LINUX ===");

const linuxCommands = [
  ["ls", "List directory contents", "Options: -l (long listing with permissions/owner/size), -a (show hidden files starting with .), -h (human readable sizes), -R (recursive), -t (sort by modification time)"],
  ["cd", "Change working directory", "Usage: cd ~ (home), cd .. (parent directory), cd - (previous directory), cd / (root directory)"],
  ["pwd", "Print working directory", "Displays absolute full pathname of current directory from root /"],
  ["mkdir", "Make directory", "Options: -p (create parent directories without error if they already exist, e.g. mkdir -p a/b/c)"],
  ["rm", "Remove files or directories", "Options: -r / -R (recursive for folders), -f (force without prompt), -rf (force recursive removal)"],
  ["cp", "Copy files and directories", "Options: -r (recursive for directories), -p (preserve file attributes/timestamps), -v (verbose)"],
  ["mv", "Move or rename files and directories", "Usage: mv old_name new_name (rename) or mv file.txt /target/dir/ (move)"],
  ["touch", "Create empty file or update timestamps", "Creates new 0-byte file if non-existent, or updates access/modification time to current timestamp"],
  ["cat", "Concatenate and display file content", "Usage: cat file.txt; cat f1.txt f2.txt > combined.txt; -n (show line numbers)"],
  ["grep", "Global regular expression print / Search text pattern", "Options: -i (case-insensitive), -r / -R (recursive), -n (show line number), -v (invert match), -E (extended regex), -c (count matches)"],
  ["find", "Search for files in a directory hierarchy", "Usage: find /path -name '*.js' -type f; find . -mtime -7 (modified in last 7 days); find . -size +100M"],
  ["awk", "Pattern scanning and text processing language", "Usage: awk '{print $1, $3}' file.txt (print columns 1 and 3); awk -F',' '{sum += $2} END {print sum}' (sum CSV column)"],
  ["sed", "Stream editor for filtering and transforming text", "Usage: sed 's/old_text/new_text/g' file.txt (replace all occurrences globally); sed -i (in-place edit)"],
  ["tar", "Tape archive utility for tarballs", "Usage: tar -czvf archive.tar.gz /folder (create compressed); tar -xzvf archive.tar.gz (extract); tar -tvf (list contents)"],
  ["chmod", "Change file access permissions", "Usage: chmod 755 script.sh (rwxr-xr-x); chmod +x file (make executable); chmod -R (recursive); Octal: 4=Read, 2=Write, 1=Execute"],
  ["chown", "Change file owner and group", "Usage: chown user:group file.txt; chown -R www-data:www-data /var/www/html (recursive web server ownership)"],
  ["curl", "Command-line tool to transfer data with URLs", "Usage: curl -X POST https://api.com/v1 -H 'Content-Type: application/json' -d '{\"key\":\"val\"}' -o out.json; -I (fetch headers only); -L (follow redirects)"],
  ["wget", "Non-interactive network downloader", "Usage: wget -c URL (resume broken download); wget -r (recursive website mirroring); wget -O custom_name URL"],
  ["ssh", "Secure Shell remote login client", "Usage: ssh -i key.pem user@hostname -p 22; ssh-copy-id user@host (copy public key for passwordless auth)"],
  ["scp", "Secure copy file over SSH", "Usage: scp -i key.pem file.txt user@host:/remote/path/; scp -r /local/dir user@host:/remote/dir"],
  ["rsync", "Fast, versatile remote file-copying and sync tool", "Usage: rsync -avz --progress /source/ user@host:/dest/ (-a archive, -v verbose, -z compression); delta-transfer sends only modified bytes"],
  ["top / htop", "Interactive process viewer and system resource monitor", "Displays real-time CPU usage per core, RAM, load averages (1/5/15 min), running tasks, and thread tree"],
  ["ps", "Report snapshot of current processes", "Usage: ps aux (all processes BSD style); ps -ef (standard full listing); ps aux | grep node"],
  ["kill", "Send signal to process by PID", "Usage: kill -9 PID (SIGKILL force kill); kill -15 PID (SIGTERM graceful shutdown); killall node (kill by process name)"],
  ["systemctl", "Control the systemd system and service manager", "Usage: systemctl start nginx; systemctl stop service; systemctl restart service; systemctl enable service (start on boot); systemctl status service"],
  ["journalctl", "Query the systemd logging journal", "Usage: journalctl -u nginx.service -f (follow live logs); journalctl -xe (detailed error context); journalctl --since '1 hour ago'"],
  ["netstat / ss", "Print network connections, routing tables, interface stats", "Usage: ss -tuln (display listening TCP and UDP sockets with numeric ports); ss -tulpn (show process PIDs owning ports)"],
  ["lsof", "List open files and network sockets", "Usage: lsof -i :8080 (find which process is using port 8080); lsof -u username; lsof /path/to/file"],
  ["df", "Report file system disk space usage", "Usage: df -h (human-readable GB/MB); df -T (show filesystem type: ext4, xfs, nfs)"],
  ["du", "Estimate file space usage of directory", "Usage: du -sh * (summary human-readable size of each item in folder); du -h --max-depth=1 /var/log | sort -hr"],
  ["free", "Display total, used and free physical memory (RAM)", "Usage: free -h (human readable in MB/GB); shows Total, Used, Free, Shared, Buff/Cache, and Available memory"],
  ["cron / crontab", "Schedule periodic background jobs", "Syntax: * * * * * command (minute 0-59, hour 0-23, day of month 1-31, month 1-12, day of week 0-6); crontab -e (edit), crontab -l (list)"],
  ["iptables / ufw", "Linux firewall configuration tools", "UFW (Uncomplicated Firewall): ufw allow 22/tcp; ufw allow 80/tcp; ufw allow 443/tcp; ufw enable; ufw status numbered"],
  ["head / tail", "Output the first or last part of files", "Usage: tail -f /var/log/syslog (follow live stream); head -n 20 file.txt (first 20 lines); tail -n 50 (last 50 lines)"],
  ["sort / uniq", "Sort lines of text and report/omit repeated lines", "Usage: sort file.txt | uniq -c | sort -nr (frequency count sorted descending); sort -k2 -n (sort numerically on column 2)"],
  ["wc", "Print newline, word, and byte counts for files", "Usage: wc -l file.txt (count lines); wc -w (count words); wc -c (count bytes)"],
  ["xargs", "Build and execute command lines from standard input", "Usage: find . -name '*.log' | xargs rm -f; cat urls.txt | xargs -n 1 -P 4 curl -O (download 4 in parallel)"]
];

const linuxEntries = linuxCommands.map((cmd, idx) => {
  const [name, summary, desc] = cmd;
  return {
    id: `tech-linux-cmd-${name.replace(/[^\w]/g, '-')}`,
    keywords: [
      `${name} command linux`,
      `how to use ${name} command`,
      `${name} options linux`,
      `what is ${name} command`,
      `linux ${name} command syntax`
    ],
    title: `${name} Command (Linux / Unix) — ${summary}`,
    category: 'Technology',
    answer: `The \`${name}\` command in Linux is used to ${summary.toLowerCase()}. ${desc}.`,
    highlights: [
      `Command: ${name}`,
      `Purpose: ${summary}`,
      `Syntax & Options: ${desc}`,
      `OS Environment: Linux, macOS, Unix, WSL`
    ],
    url: `https://man7.org/linux/man-pages/man1/${name.split(' ')[0]}.1.html`
  };
});
saveDb('tech_programming.json', linuxEntries);

// LeetCode & DSA Algorithms (50 nodes)
const dsaAlgorithms = [
  ["Two Pointers Technique", "Uses two index pointers moving towards each other or at different speeds to solve array/string problems in O(N) time and O(1) space. E.g. Container With Most Water, 3Sum, Valid Palindrome."],
  ["Sliding Window Pattern", "Maintains a dynamic or fixed-size window subarray over contiguous elements, expanding right pointer and contracting left pointer in O(N) time. E.g. Longest Substring Without Repeating Characters, Minimum Window Substring."],
  ["Fast and Slow Pointers (Floyd's Tortoise and Hare)", "Uses two pointers traversing linked list at different speeds (slow=1 step, fast=2 steps). E.g. Linked List Cycle Detection, Finding Middle Node, Start of Cycle in O(N) time and O(1) space."],
  ["Monotonic Stack Pattern", "Maintains stack elements strictly in increasing or decreasing order to find the next greater or smaller element in O(N) time. E.g. Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram."],
  ["Topological Sort (Kahn's Algorithm)", "Orders vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u->v, u comes before v. Uses in-degree array and Queue in O(V+E) time. E.g. Course Schedule."],
  ["Dijkstra's Shortest Path Algorithm", "Finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights using a Min-Priority Queue in O((V + E) log V) time."],
  ["Bellman-Ford Algorithm", "Computes shortest paths from single source vertex in graphs with negative edge weights and detects negative weight cycles in O(V * E) time by relaxing all edges V-1 times."],
  ["Floyd-Warshall Algorithm", "Computes all-pairs shortest paths in a weighted directed graph in O(V^3) time using 3 nested loops: dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])."],
  ["Kruskal's Minimum Spanning Tree", "Greedy algorithm that sorts all edges by weight and adds edges to the spanning tree using Disjoint Set Union (DSU / Union-Find) to prevent cycles in O(E log E) time."],
  ["Prim's Minimum Spanning Tree", "Greedy algorithm that grows a single spanning tree from an initial vertex by repeatedly adding the minimum weight edge connecting the tree to a non-tree vertex using a Min-Heap in O(E log V) time."],
  ["Binary Search on Answer Range", "Monotonic predicate search over solution space [low, high] in O(log(range)) time. E.g. Koko Eating Bananas, Capacity To Ship Packages, Split Array Largest Sum."],
  ["0/1 Knapsack Problem", "Dynamic Programming where each item can be chosen at most once. DP state dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]) in O(N * W) time and O(W) space."],
  ["Longest Common Subsequence (LCS)", "Finds longest sequence appearing in both strings in the same relative order. DP state: if (s1[i]==s2[j]) dp[i][j]=1+dp[i-1][j-1] else max(dp[i-1][j], dp[i][j-1]) in O(M*N) time."],
  ["Longest Increasing Subsequence (LIS)", "Finds length of longest strictly increasing subsequence. Solvable in O(N log N) time using Patience Sorting / Binary Search (std::lower_bound) on a tails array."],
  ["Kadane's Algorithm for Max Subarray Sum", "Computes maximum sum of a contiguous subarray in O(N) time and O(1) space: max_ending_here = max(arr[i], max_ending_here + arr[i]), max_so_far = max(max_so_far, max_ending_here)."],
  ["A* Search Algorithm", "Informed heuristic graph search evaluating f(n) = g(n) + h(n), where g(n) is actual cost from start and h(n) is admissible heuristic estimating cost to goal. Guarantees shortest path."],
  ["KMP (Knuth-Morris-Pratt) String Matching", "Fast string pattern search in O(N + M) time using a Longest Proper Prefix which is also Suffix (LPS) π-table to avoid redundant character comparisons."],
  ["Rabin-Karp Rolling Hash Algorithm", "String matching algorithm using polynomial rolling hash functions to match substring hashes in O(N + M) average time and detect duplicate substrings."],
  ["Trie (Prefix Tree)", "Tree data structure for storing strings character by character providing O(L) insert, search, and prefix matching time complexity where L is the string length. Used in autocomplete."],
  ["LRU (Least Recently Used) Cache", "Constant O(1) get and put cache implemented using a Hash Map combined with a Doubly Linked List to keep most recently accessed elements at head and evict from tail."],
  ["LFU (Least Frequently Used) Cache", "Cache eviction scheme that discards the least frequently accessed items first. Implemented in O(1) time using two hash maps and frequency doubly-linked lists."],
  ["Fenwick Tree (Binary Indexed Tree / BIT)", "Array-based data structure that supports prefix sum queries and point updates in O(log N) time using bitwise least significant bit operations (x & -x)."],
  ["Segment Tree with Lazy Propagation", "Binary tree storing range intervals for O(log N) range queries and O(log N) range updates by deferring update operations to child nodes only when needed."],
  ["Bloom Filter", "Space-efficient probabilistic data structure using multiple hash functions over a bit array to test set membership with zero false negatives and configurable false positive rate."]
];

const dsaEntries = dsaAlgorithms.map((dsa, idx) => {
  const [name, desc] = dsa;
  return {
    id: `cs-dsa-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `${name.toLowerCase()} leetcode`,
      `how does ${name.toLowerCase()} work`,
      `${name.toLowerCase()} time complexity`,
      `${name.toLowerCase()} algorithm explanation`,
      `dsa ${name.toLowerCase()}`
    ],
    title: `${name} — Algorithmic Pattern & Complexity`,
    category: 'Computer Science',
    answer: `${name}: ${desc}`,
    highlights: [
      `Algorithm / Pattern: ${name}`,
      `Core Principle: ${desc}`,
      `Application: Coding interviews, performance optimization, distributed systems`
    ],
    url: 'https://en.wikipedia.org/wiki/Algorithm'
  };
});
saveDb('computer_science_advanced.json', dsaEntries);

console.log("CS & Linux batch completed.");