"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useApiFetch } from "@/app/hooks/useApiFetch";
import PostCard from "@/app/components/community/PostCard";
import CommunityLoginCard from "@/app/components/community/CommunityLoginCard";

interface MemberProfile {
	id: number;
	fname: string;
	lname: string;
	role: string;
}

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

const PAGE_SIZE = 10;

function rolLabel(role: string) {
	if (role === "admin") return "Admin";
	if (role === "teacher") return "Teacher";
	return "Parent";
}

function PostSkeleton() {
	return (
		<div className="bg-white rounded-xl border border-[var(--line)] shadow-sm px-6 py-5 animate-pulse">
			<div className="flex items-center gap-2 mb-3">
				<div className="h-3 w-24 bg-[var(--line)] rounded" />
				<div className="h-3 w-12 bg-[var(--line)] rounded" />
			</div>
			<div className="h-4 w-3/4 bg-[var(--line)] rounded mb-2" />
			<div className="space-y-1.5">
				<div className="h-3 w-full bg-[var(--line)] rounded" />
				<div className="h-3 w-full bg-[var(--line)] rounded" />
				<div className="h-3 w-2/3 bg-[var(--line)] rounded" />
			</div>
			<div className="h-3 w-16 bg-[var(--line)] rounded mt-3" />
		</div>
	);
}

function ProfileCard({ member }: { member: MemberProfile | null }) {
	return (
		<div className="bg-[var(--navy)] rounded-xl p-6 flex flex-col gap-4 sticky top-24">
			{/* Avatar + name */}
			<div className="flex items-center gap-4">
				<div className="w-14 h-14 rounded-full bg-[var(--navy-mid)] border border-[var(--line-dark)] flex items-center justify-center shrink-0">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="8" r="4" />
						<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
					</svg>
				</div>
				<div>
					{member ? (
						<>
							<p className="font-semibold text-[var(--cream)] leading-tight">{member.fname} {member.lname}</p>
							<p className="text-xs text-[var(--cream-dim)] mt-0.5 capitalize">{rolLabel(member.role)}</p>
						</>
					) : (
						<>
							<div className="h-4 w-28 bg-[var(--navy-mid)] rounded animate-pulse" />
							<div className="h-3 w-16 bg-[var(--navy-mid)] rounded animate-pulse mt-1" />
						</>
					)}
				</div>
			</div>

			{/* Description placeholder */}
			<div className="border-t border-[var(--line-dark)] pt-4">
				<p className="text-sm text-[var(--cream-dim)]/50 italic">No bio yet.</p>
			</div>

			{/* Joined */}
			<div className="border-t border-[var(--line-dark)] pt-4">
				<p className="text-xs text-[var(--cream-dim)]/50">Joined: —</p>
			</div>
		</div>
	);
}

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const memberId = parseInt(id);
	const { user, isLoading } = useAuth();
	const apiFetch = useApiFetch();

	const [member,   setMember]      = useState<MemberProfile | null>(null);
	const [notFound, setNotFound]    = useState(false);
	const [posts,    setPosts]       = useState<Post[]>([]);
	const [page,     setPage]        = useState(0);
	const [hasMore,  setHasMore]     = useState(true);
	const [fetching, setFetching]    = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const loadPage = useCallback(async (pageNum: number, replace = false) => {
		setFetching(true);
		try {
			const data = await apiFetch<Post[]>(
				`/community/posts?author_id=${memberId}&skip=${pageNum * PAGE_SIZE}&limit=${PAGE_SIZE}`
			);
			if (replace) setPosts(data); else setPosts(prev => [...prev, ...data]);
			setHasMore(data.length === PAGE_SIZE);
		} catch {
			// silently fail
		} finally {
			setFetching(false);
			setInitialLoad(false);
		}
	}, [apiFetch, memberId]);

	useEffect(() => {
		if (!user) return;
		apiFetch<MemberProfile>(`/community/users/${memberId}`)
			.then(setMember)
			.catch(() => setNotFound(true));
		loadPage(0, true);
	}, [user, memberId]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (page === 0) return;
		loadPage(page);
	}, [page]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el || !hasMore || fetching) return;
		const obs = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) setPage(p => p + 1); },
			{ threshold: 0.1 }
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [hasMore, fetching]);

	if (isLoading) return null;

	if (!user) {
		return (
			<div className="max-w-lg mx-auto px-4 py-16">
				<p className="text-sm text-[var(--ink-soft)] mb-6 text-center">Sign in to view member profiles.</p>
				<CommunityLoginCard />
			</div>
		);
	}

	if (notFound) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-16 text-center">
				<p className="text-[var(--ink-soft)]">Member not found.</p>
				<Link href="/community" className="mt-4 inline-block text-sm text-[var(--gold)] hover:underline">
					← Back to Community
				</Link>
			</div>
		);
	}

	const displayName = member ? `${member.fname} ${member.lname}` : "…";

	return (
		<div className="bg-[var(--cream)] min-h-screen">
			<div className="max-w-5xl mx-auto px-4 py-10">
				<Link
					href="/community"
					className="inline-flex items-center gap-1 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors mb-8"
				>
					← All Posts
				</Link>

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
					{/* Posts feed */}
					<div>
						<h2 className="font-playfair text-xl font-semibold text-[var(--ink)] mb-6">
							Posts by {displayName}
						</h2>

						{initialLoad ? (
							<div className="flex flex-col gap-3">
								{Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}
							</div>
						) : posts.length === 0 ? (
							<p className="text-[var(--ink-soft)] text-sm py-12 text-center">
								No posts yet.
							</p>
						) : (
							<div className="flex flex-col gap-3">
								{posts.map(post => <PostCard key={post.id} post={post} />)}
							</div>
						)}

						{hasMore && <div ref={sentinelRef} className="h-10" />}

						{fetching && !initialLoad && (
							<div className="flex justify-center py-8">
								<div className="w-5 h-5 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
							</div>
						)}

						{!hasMore && posts.length > 0 && (
							<p className="text-center text-xs text-[var(--ink-soft)] py-8">
								All posts shown.
							</p>
						)}
					</div>

					{/* Profile card */}
					<ProfileCard member={member} />
				</div>
			</div>
		</div>
	);
}
