"use client";
import { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useApiFetch } from "@/app/hooks/useApiFetch";
import CommunityLoginCard from "@/app/components/community/CommunityLoginCard";

interface Comment {
	id: number;
	author_id: number;
	author_fname: string;
	author_lname: string;
	author_role: string;
	content: string;
	created_at: string;
}

interface PostDetail {
	id: number;
	author_id: number;
	author_fname: string;
	author_lname: string;
	author_role: string;
	title: string;
	content: string;
	created_at: string;
	updated_at: string;
	comment_count: number;
	comments: Comment[];
}

function relativeTime(iso: string): string {
	const diff = (Date.now() - new Date(iso).getTime()) / 1000;
	if (diff < 60) return "just now";
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
	return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
			<span title="Teacher" className="inline-flex items-center ml-1.5 text-[0.75rem]">
				🎓
			</span>
		);
	}
	return (
		<span title="Parent" className="inline-flex items-center ml-1.5 text-[0.75rem]">
			🏠
		</span>
	);
}

const inputCls =
	"w-full rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-[var(--ink)] " +
	"placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const { user, isLoading } = useAuth();
	const apiFetch = useApiFetch();
	const router = useRouter();

	const [post, setPost]               = useState<PostDetail | null>(null);
	const [fetching, setFetching]       = useState(true);
	const [notFound, setNotFound]       = useState(false);
	const [comment, setComment]         = useState("");
	const [submitting, setSubmitting]   = useState(false);
	const [commentError, setCommentError] = useState("");
	const [deleting, setDeleting]       = useState(false);

	const loadPost = async () => {
		try {
			const data = await apiFetch<PostDetail>(`/community/posts/${id}`);
			setPost(data);
		} catch {
			setNotFound(true);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		if (!user) return;
		loadPost();
	}, [user, id]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleComment = async (e: FormEvent) => {
		e.preventDefault();
		if (!comment.trim()) return;
		setSubmitting(true);
		setCommentError("");
		try {
			await apiFetch(`/community/posts/${id}/comments`, {
				method: "POST",
				body: JSON.stringify({ content: comment }),
			});
			setComment("");
			await loadPost();
		} catch {
			setCommentError("Failed to post comment. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm("Delete this post? This cannot be undone.")) return;
		setDeleting(true);
		try {
			await apiFetch(`/community/posts/${id}`, { method: "DELETE" });
			router.push("/community");
		} catch {
			setDeleting(false);
		}
	};

	if (isLoading) return null;

	if (!user) {
		return (
			<div className="max-w-lg mx-auto px-4 py-16">
				<p className="text-sm text-[var(--ink-soft)] mb-6 text-center">Sign in to view this post.</p>
				<CommunityLoginCard />
			</div>
		);
	}

	if (fetching) {
		return (
			<div className="flex justify-center py-24">
				<div className="w-5 h-5 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (notFound || !post) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-16 text-center">
				<p className="text-[var(--ink-soft)]">Post not found.</p>
				<Link href="/community" className="mt-4 inline-block text-sm text-[var(--gold)] hover:underline">
					← Back to Community
				</Link>
			</div>
		);
	}

	const canDelete = user.id === post.author_id || user.role === "admin";

	return (
		<div className="bg-[var(--cream)] min-h-screen">
			<div className="max-w-3xl mx-auto px-4 py-10">

				{/* Breadcrumb */}
				<Link
					href="/community"
					className="inline-flex items-center gap-1 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors mb-8"
				>
					← All Posts
				</Link>

				{/* Post */}
				<div className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-7 mb-8 relative">
					{canDelete && (
						<button
							onClick={handleDelete}
							disabled={deleting}
							className="absolute top-5 right-5 text-xs text-red-400 hover:text-red-600 hover:underline disabled:opacity-50 transition-colors"
						>
							{deleting ? "Deleting…" : "Delete"}
						</button>
					)}
					<p className="text-xs text-[var(--ink-soft)] mb-2 flex items-center">
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
					<h1 className="font-playfair text-2xl font-semibold text-[var(--ink)] leading-snug mb-4">
						{post.title}
					</h1>
					<p className="text-sm text-[var(--ink-soft)] leading-relaxed whitespace-pre-wrap">
						{post.content}
					</p>
				</div>

				{/* Comments */}
				<h2 className="font-playfair text-lg font-semibold text-[var(--ink)] mb-4">
					Comments ({post.comments.length})
				</h2>

				{post.comments.length > 0 && (
					<div className="flex flex-col gap-2 mb-6">
						{post.comments.map((c) => (
							<div key={c.id} className="bg-white rounded-xl border border-[var(--line)] shadow-sm px-6 py-4">
								<p className="text-xs text-[var(--ink-soft)] mb-1 flex items-center">
									<Link
										href={`/community/member/${c.author_id}`}
										className="hover:text-[var(--ink)] hover:underline transition-colors"
									>
										{c.author_fname} {c.author_lname}
									</Link>
									<RoleBadge role={c.author_role} />
									<span className="mx-1.5">·</span>
									{relativeTime(c.created_at)}
								</p>
								<p className="text-sm text-[var(--ink)] leading-relaxed">{c.content}</p>
							</div>
						))}
					</div>
				)}

				{post.comments.length === 0 && (
					<p className="text-sm text-[var(--ink-soft)] mb-6">No comments yet. Be the first.</p>
				)}

				{/* Add comment */}
				<div className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6">
					<h3 className="text-sm font-semibold text-[var(--ink)] mb-3">Leave a comment</h3>
					<form onSubmit={handleComment} className="flex flex-col gap-3">
						<textarea
							className={`${inputCls} h-24 resize-none`}
							placeholder="Write a comment…"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							required
						/>
						{commentError && <p className="text-red-500 text-xs">{commentError}</p>}
						<button
							type="submit"
							disabled={submitting}
							className="self-end rounded-lg bg-[var(--navy)] text-[var(--cream)] px-5 py-2 text-sm font-semibold hover:bg-[var(--navy-mid)] transition-colors disabled:opacity-50"
						>
							{submitting ? "Posting…" : "Post Comment"}
						</button>
					</form>
				</div>

			</div>
		</div>
	);
}
