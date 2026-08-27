'use client';
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props { query: string }

interface FAQItem {
  question: string;
  answer: string;
  url?: string;
}

// Generate contextual "People Also Ask" questions for any query
function generatePeopleAlsoAsk(query: string, lang: string): FAQItem[] {
  const q = query.trim();
  const isHindi = lang === 'hi';

  if (/search console|gsc/i.test(q)) {
    return [
      {
        question: isHindi ? 'गूगल सर्च कंसोल का मुख्य उपयोग क्या है?' : 'What is Google Search Console used for?',
        answer: isHindi ? 'Google Search Console एक मुफ़्त टूल है जो आपकी वेबसाइट की सर्च विजिबिलिटी, इंडेक्सिंग स्टेटस और SEO प्रदर्शन को ट्रैक करने में मदद करता है।' : 'Google Search Console is a free tool by Google that helps website owners monitor, maintain, and troubleshoot their site\'s presence in Google Search results.',
      },
      {
        question: isHindi ? 'मैं अपनी साइट का SEO रैंकिंग कैसे चेक कर सकता हूँ?' : 'How can I check my SEO rankings?',
        answer: isHindi ? 'GSC के Performance टैब में जाकर आप अपनी साइट के क्लिक, इंप्रेशन और एवरेज पोजीशन देख सकते हैं।' : 'In GSC Performance tab, you can view total clicks, impressions, average CTR, and average position for queries ranking your site.',
      },
      {
        question: isHindi ? 'क्या सर्च कंसोल मुफ़्त है?' : 'Is Google Search Console free?',
        answer: isHindi ? 'हाँ, यह पूरी तरह से मुफ़्त है और किसी भी वेबसाइट ऑनर के लिए उपलब्ध है।' : 'Yes, Google Search Console is 100% free for anyone with a website.',
      },
      {
        question: isHindi ? 'GSC और Google Analytics में क्या अंतर है?' : 'What is the difference between GSC and Google Analytics?',
        answer: isHindi ? 'GSC सर्च इंजन विजिबिलिटी पर ध्यान केंद्रित करता है, जबकि Analytics वेबसाइट पर यूजर बिहेवियर को ट्रैक करता है।' : 'GSC focuses on search engine performance and indexing, while Google Analytics tracks user behavior on your site after they arrive.',
      },
    ];
  }

  // General query template
  return [
    {
      question: isHindi ? `${q} का मुख्य अर्थ या उपयोग क्या है?` : `What is the main purpose of ${q}?`,
      answer: isHindi ? `${q} का उपयोग जानकारी प्राप्त करने, समस्याओं के समाधान और विषय को बेहतर ढंग से समझने के लिए किया जाता है।` : `${q} serves as a key concept or tool widely utilized for information gathering, problem solving, and analysis in its respective domain.`,
    },
    {
      question: isHindi ? `${q} कैसे काम करता है?` : `How does ${q} work?`,
      answer: isHindi ? `यह इनपुट डेटा को प्रोसेस करके सटीक परिणाम और संरचित जानकारी प्रदान करता है।` : `It processes input parameters and data structures to deliver structured outcomes, definitions, or operational workflows effectively.`,
    },
    {
      question: isHindi ? `${q} के मुख्य लाभ क्या हैं?` : `What are the key benefits of ${q}?`,
      answer: isHindi ? `यह समय बचाता है, उत्पादकता बढ़ाता है और सटीक उत्तर तुरंत उपलब्ध कराता है।` : `Key benefits include increased efficiency, accurate real-time information retrieval, automated processing, and simplified decision making.`,
    },
    {
      question: isHindi ? `${q} के बारे में अधिक जानकारी कहाँ मिलेगी?` : `Where can I find more documentation about ${q}?`,
      answer: isHindi ? `आप विकिपीडिया, आधिकारिक वेब पेजों और कम्युनिटी फ़ोरम (Reddit/Quora) पर अधिक विस्तृत जानकारी प्राप्त कर सकते हैं।` : `Official documentation, Wikipedia articles, research papers, and technical community forums provide comprehensive details and guides about ${q}.`,
    },
  ];
}

export function PeopleAlsoAsk({ query }: Props) {
  const { lang } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!query || query.length < 2) return null;

  const faqs = generatePeopleAlsoAsk(query, lang);
  const titleText = lang === 'hi' ? 'लोग यह भी जानना चाहते हैं' : 'People also ask';

  return (
    <div className="my-6 max-w-2xl border-t border-b border-border/30 py-3 animate-fade-in">
      {/* Section Title */}
      <h3 className="text-base sm:text-lg font-medium text-text-primary mb-3 flex items-center gap-2">
        <span>{titleText}</span>
      </h3>

      {/* Accordion Questions */}
      <div className="divide-y divide-border/20 border-t border-border/20">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-2.5">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left py-1 group cursor-pointer"
              >
                <span className="text-[15px] text-text-primary group-hover:text-indigo-400 dark:group-hover:text-[#8ab4f8] transition-colors font-normal">
                  {faq.question}
                </span>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center bg-surface-2/60 text-text-muted
                  group-hover:bg-surface-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="pt-2 pb-3 px-1 text-sm text-text-secondary dark:text-[#bdc1c6] leading-relaxed animate-fade-in">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
