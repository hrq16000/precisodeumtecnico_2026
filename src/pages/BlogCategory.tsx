import { useParams, Link, Navigate } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogCategories, getPostsByCategory } from "@/data/blog";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogCategory() {
  const { slug } = useParams<{ slug: string }>();
  const category = blogCategories.find((c) => c.slug === slug);
  if (!category) return <Navigate to="/blog" replace />;

  const posts = getPostsByCategory(category.slug);

  return (
    <Layout>
      <SEOHead
        title={`${category.name} — Blog | Preciso de Um Técnico`}
        description={`${category.description} Guias, tutoriais e artigos de ${category.name.toLowerCase()} escritos pelos técnicos do Preciso de Um Técnico em Curitiba e Região Metropolitana.`}
        canonical={`https://precisodeumtecnico.com/blog/categoria/${category.slug}`}
        ogImage={`https://precisodeumtecnico.com/og/${category.slug}.jpg`}
      />

      <section className="bg-gradient-to-br from-foreground to-primary/20 text-background py-16">
        <div className="container-custom">
          <Reveal>
            <Badge variant="secondary" className="mb-4">Categoria</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{category.name}</h1>
            <p className="text-lg text-background/80 max-w-2xl">{category.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">Em breve, novos artigos nesta categoria.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 60}>
                  <Card className="p-6 h-full flex flex-col hover-lift">
                    <h2 className="font-display text-xl font-bold mb-2 leading-tight">
                      <Link to={`/blog/${post.slug}`} className="hover:text-primary">{post.title}</Link>
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString("pt-BR")}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingTime} min</span>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="mt-4 text-sm font-semibold text-primary inline-flex items-center gap-1">
                      Ler artigo <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
