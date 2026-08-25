import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { allBlogPosts as blogPosts, blogCategories } from "@/data/blog";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { RelatedGuidesCard, GUIDE_LINKS } from "@/components/seo/RelatedGuidesCard";


export default function Blog() {
  const sorted = [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Preciso de Um Técnico",
    url: "https://precisodeumtecnico.com/blog",
    publisher: { "@type": "Organization", name: "Preciso de Um Técnico" },
    blogPost: sorted.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.publishedAt,
      url: `https://precisodeumtecnico.com/blog/${p.slug}`,
    })),
  };

  return (
    <Layout>
      <SEOHead
        title="Blog | Dicas, Guias e Preços de Assistência Técnica"
        description="Guias práticos sobre informática, redes Wi-Fi, CFTV, ar-condicionado, elétrica e celulares. Conteúdo escrito por técnicos profissionais em Curitiba."
        canonical="https://precisodeumtecnico.com/blog"
        ogImage="https://precisodeumtecnico.com/og/blog.jpg"
        structuredData={[blogSchema]}
      />

      <section className="bg-gradient-to-br from-foreground to-primary/20 text-background py-16">
        <div className="container-custom">
          <Reveal>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-background/80 max-w-2xl">
              Guias técnicos, tabelas de preço e tutoriais escritos por quem atende todos os dias em Curitiba e região.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container-custom py-6">
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((c) => (
              <Link key={c.slug} to={`/blog/categoria/${c.slug}`}>
                <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  {c.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RelatedGuidesCard
        title="Guias empresariais"
        links={[GUIDE_LINKS.ti, GUIDE_LINKS.workstation]}
      />



      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((post, i) => {
              const cat = blogCategories.find((c) => c.slug === post.category);
              return (
                <Reveal key={post.slug} delay={i * 60}>
                  <Card className="p-6 h-full flex flex-col hover-lift">
                    {cat && <Badge variant="secondary" className="mb-3 self-start">{cat.name}</Badge>}
                    <h2 className="font-display text-xl font-bold mb-2 leading-tight">
                      <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min
                      </span>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-4 text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Ler artigo <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
