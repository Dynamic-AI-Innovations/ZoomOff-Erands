import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Resources",
  description: "Tips, guides, and updates from the ZoomOff Errands team — how to run smarter errands, runner success stories, and platform news.",
};

const POSTS = [
  {
    slug: "how-to-use-zoomoff",
    category: "Guide",
    title: "How to Request Your First Errand in 3 Simple Steps",
    excerpt: "Getting started with ZoomOff Errands is quick. Here's exactly how to post your first task and get matched with a verified runner in minutes.",
    date: "June 2025",
    readTime: "3 min read",
  },
  {
    slug: "become-a-runner-tips",
    category: "Runners",
    title: "5 Tips to Maximise Your Earnings as a ZoomOff Runner",
    excerpt: "Top runners on ZoomOff earn over ₦100,000 a month. Here are the strategies they use to stay busy and keep their ratings high.",
    date: "May 2025",
    readTime: "5 min read",
  },
  {
    slug: "business-errand-management",
    category: "Business",
    title: "How Businesses Use ZoomOff to Cut Errand Costs by 40%",
    excerpt: "From Lagos startups to enterprise teams, companies are using ZoomOff Errands to outsource office errands and logistics. Here's how.",
    date: "May 2025",
    readTime: "4 min read",
  },
  {
    slug: "runner-safety",
    category: "Safety",
    title: "Our Commitment to Runner and Customer Safety",
    excerpt: "Every ZoomOff runner is verified with NIN/BVN, background-checked, and GPS-tracked. Learn how we keep both sides of every errand safe.",
    date: "April 2025",
    readTime: "4 min read",
  },
  {
    slug: "pricing-explained",
    category: "Pricing",
    title: "ZoomOff Errands Pricing — What You Pay and Why It's Fair",
    excerpt: "Transparent pricing with no hidden fees. Here's exactly how our pricing works, from the base fare to the runner's cut.",
    date: "April 2025",
    readTime: "3 min read",
  },
  {
    slug: "ndpr-privacy",
    category: "Compliance",
    title: "Your Data, Your Rights — How We Handle Personal Information",
    excerpt: "ZoomOff Errands is fully NDPR-compliant. Here's what data we collect, why we collect it, and how you can request deletion at any time.",
    date: "March 2025",
    readTime: "5 min read",
  },
];

const CATEGORY_COLOR: Record<string, string> = {
  Guide:      "text-blue-700 bg-blue-50",
  Runners:    "text-green-700 bg-green-50",
  Business:   "text-purple-700 bg-purple-50",
  Safety:     "text-red-700 bg-red-50",
  Pricing:    "text-amber-700 bg-amber-50",
  Compliance: "text-gray-700 bg-gray-50",
};

export default function BlogPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-brand-charcoal py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 mb-6">
            <BookOpen className="h-4 w-4 text-brand-gold" />
            <span className="text-xs font-semibold text-white">Blog & Resources</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tips, Guides & Updates
          </h1>
          <p className="text-gray-400 text-base mt-3 leading-relaxed">
            Learn how to get the most out of ZoomOff Errands — whether you&apos;re a customer, runner, or business.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-zo-border bg-white hover:border-brand-gold/40 hover:shadow-md transition-all overflow-hidden">
              <div className="h-2 w-full bg-brand-gold/80" />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_COLOR[post.category] ?? "text-gray-700 bg-gray-50"}`}>
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zo-muted">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>
                <h2 className="font-display text-base font-bold text-brand-charcoal leading-snug mb-2 group-hover:text-brand-gold transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs text-zo-muted leading-relaxed flex-1">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-zo-muted">{post.date}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-brand-gold group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zo-bg-light border-t border-zo-border py-14 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-2xl font-extrabold text-brand-charcoal mb-2">Ready to get started?</h2>
          <p className="text-sm text-zo-muted mb-6">Join thousands of Nigerians who use ZoomOff Errands every week.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/delegate"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-6 py-3 text-sm font-bold text-brand-charcoal hover:bg-brand-gold/90 transition-colors">
              Request an Errand <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/become-a-runner"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-charcoal px-6 py-3 text-sm font-bold text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-colors">
              Become a Runner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
