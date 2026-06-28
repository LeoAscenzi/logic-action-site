import Link from "next/link";

interface Post {
	id: number;
	author_id: number;
	author_fname: string;
	author_lname: string;
	author_role: string;
	title: string;
	content: string;
	created_at: string;
	comment_count: number;
}

function relativeTime(iso: string): string {
	const diff = (Date.now() - new Date(iso).getTime()) / 1000;
	if (diff < 60) return "just now";
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
	return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function RoleBadge({ role }: { role: string }) {
	if (role === "admin") {
		return (
			<span title="Admin" className="inline-flex items-center text-[var(--gold)] ml-1.5 text-[0.75rem]">
				★
			</span>
		);
	}
	if (role === "teacher") {
		return (
			<span title="Teacher" className="inline-flex items-center text-[var(--ink-soft)] ml-1.5 text-[0.75rem]">
				🎓
			</span>
		);
	}
	return (
		<span title="Parent" className="inline-flex items-center text-[var(--ink-soft)] ml-1.5 text-[0.75rem]">
			🏠
		</span>
	);
}

export default function PostCard({ post }: { post: Post }) {
	return (
		<article className="relative bg-white rounded-xl border border-[var(--line)] shadow-sm px-6 py-5 hover:shadow-md hover:border-[var(--cream-dim)] transition-all">
			{/* Author + timestamp — z-[1] sits above the stretched card link */}
			<p className="relative z-[1] text-xs text-[var(--ink-soft)] mb-1 flex items-center">
				<Link
					href={`/community/member/${post.author_id}`}
					className="hover:text-[var(--ink)] hover:underline transition-colors"
				>
					{post.author_fname} {post.author_lname}
				</Link>
				<RoleBadge role={post.author_role} />
				<span className="mx-1.5">·</span>
				{relativeTime(post.created_at)}
			</p>

			{/* Title — the ::after pseudo-element stretches to cover the whole card */}
			<h3 className="font-playfair text-[1.05rem] font-semibold text-[var(--ink)] mb-2 leading-snug">
				<Link
					href={`/community/post/${post.id}`}
					className="after:absolute after:inset-0 after:rounded-xl after:content-['']"
				>
					{post.title}
				</Link>
			</h3>

			<p className="text-sm text-[var(--ink-soft)] leading-relaxed line-clamp-4">
				{post.content}
			</p>

			<p className="relative z-[1] mt-3 text-xs text-[var(--ink-soft)]">
				💬 {post.comment_count} {post.comment_count === 1 ? "comment" : "comments"}
			</p>
		</article>
	);
}
