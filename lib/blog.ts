import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

// Dosya adındaki "01-", "02-" gibi öncekler yazarın verdiği okuma/yayın
// sırasını temsil eder (tüm yazılar aynı tarihle geldiğinde tarih tek
// başına sıralamaya yetmiyor). Frontmatter'daki `slug` her zaman öncelikli
// kabul edilir; dosya adı sadece sıralama ve son çare slug kaynağıdır.
function parseFileOrder(fileName: string): number {
  const match = fileName.match(/^(\d+)-/);
  return match ? Number(match[1]) : 0;
}

function slugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/, "").replace(/^\d+-/, "");
}

// Markdown gövdesi genelde frontmatter title'ıyla aynı metni tekrar eden bir
// `# Başlık` satırıyla başlıyor; sayfada başlığı zaten ayrı ve stilli
// gösterdiğimiz için gövdedeki bu tekrar eden ilk H1 satırını çıkarıyoruz.
function stripLeadingH1(content: string): string {
  return content.replace(/^\s*#\s+.*(\r?\n)+/, "");
}

function readAllFiles() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
      const { data, content } = matter(raw);
      return {
        fileName,
        order: parseFileOrder(fileName),
        slug: (data.slug as string) || slugFromFileName(fileName),
        title: data.title as string,
        excerpt: (data.excerpt as string) ?? (data.description as string),
        date: new Date(data.date).toISOString().slice(0, 10),
        content: stripLeadingH1(content),
      };
    });
}

export function getAllPosts(): BlogPostMeta[] {
  return readAllFiles()
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return b.order - a.order;
    })
    .map(({ slug, title, excerpt, date }) => ({ slug, title, excerpt, date }));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const post = readAllFiles().find((p) => p.slug === slug);
  if (!post) return null;

  const { slug: postSlug, title, excerpt, date, content } = post;
  return { slug: postSlug, title, excerpt, date, content };
}

export function getAdjacentPosts(slug: string): {
  previous: BlogPostMeta | null;
  next: BlogPostMeta | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) return { previous: null, next: null };

  return {
    previous: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}
