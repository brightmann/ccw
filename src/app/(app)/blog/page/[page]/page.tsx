import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BLOGS_PER_PAGE } from '@/features/blog/components/blog-list';
import { getBlogs } from '@/features/blog/lib/blog';

import BlogListPage from '../../page';

export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

type PageProps = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
  const posts = await getBlogs({ withZenn: true });
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOGS_PER_PAGE));
  return Array.from({ length: totalPages }, (_, i) => ({ page: `${i + 1}` }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page } = await params;
  return { title: `All Blogs - Page ${page}` };
}

export default async function PaginatedBlogPage({ params }: PageProps) {
  const { page } = await params;
  if (!/^[1-9]\d*$/.test(page)) notFound();

  const pageNumber = Number(page);
  const posts = await getBlogs({ withZenn: true });
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOGS_PER_PAGE));
  if (!Number.isSafeInteger(pageNumber) || pageNumber > totalPages) notFound();

  return <BlogListPage page={pageNumber} />;
}
