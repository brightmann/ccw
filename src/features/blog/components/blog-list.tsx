import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';

import { buttonVariants } from '@/components/base-ui/button';
import { TextLink } from '@/components/base-ui/text-link';
import { getBlogs } from '@/features/blog/lib/blog';
import { BlogQuery } from '@/features/blog/types';

export const BLOGS_PER_PAGE = 5;

export async function BlogList({
  limit,
  withZenn,
  tagSlug,
  showMore,
  page,
}: BlogQuery & { showMore?: boolean; page?: number }) {
  const allPosts = await getBlogs({ limit, withZenn, tagSlug });
  const totalPages = Math.max(1, Math.ceil(allPosts.length / BLOGS_PER_PAGE));
  const posts = page
    ? allPosts.slice((page - 1) * BLOGS_PER_PAGE, page * BLOGS_PER_PAGE)
    : allPosts;

  return (
    <div className="@container flex flex-col gap-4">
      {posts.map((blog, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 @md:flex-row @md:justify-between"
        >
          <TextLink href={blog.link} size="sm" className="min-w-0">
            {blog.title}
          </TextLink>
          <span className="text-on-muted shrink-0 text-xs">{blog.pubDate}</span>
        </div>
      ))}
      {page && totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className="mt-4 flex items-center justify-between gap-2 text-xs"
        >
          {page > 1 ? (
            <Link
              href={page === 2 ? '/blog' : `/blog/page/${page - 1}`}
              rel="prev"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Previous
            </Link>
          ) : (
            <span aria-disabled="true" className="text-on-muted px-4 py-2">
              Previous
            </span>
          )}
          <span aria-current="page">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/blog/page/${page + 1}`}
              rel="next"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Next
            </Link>
          ) : (
            <span aria-disabled="true" className="text-on-muted px-4 py-2">
              Next
            </span>
          )}
        </nav>
      )}
      {showMore && (
        <div className="flex items-center justify-end">
          <Link
            href="/blog"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            All Writing
            <ChevronRightIcon className="size-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
