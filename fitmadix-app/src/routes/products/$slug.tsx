import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, X, ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/AppButton";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();

  // Mock product data
  const product = {
    title: "Premium Whey Protein Isolate",
    type: "Supplement",
    description: "A high-quality, fast-absorbing whey protein isolate with zero artificial colors or sweeteners. Ideal for post-workout muscle recovery and meeting daily protein targets.",
    image_url: null,
    advantages: [
      "25g pure isolate protein per scoop",
      "Zero artificial sweeteners",
      "Easily digestible",
      "Third-party tested for purity"
    ],
    limitations: [
      "More expensive than concentrate",
      "Limited flavor options"
    ],
    specifications: {
      "Serving Size": "30g (1 scoop)",
      "Protein": "25g",
      "Carbs": "1g",
      "Fat": "0.5g",
      "Flavor": "Unflavored / Chocolate"
    },
    sellers: [
      { name: "Official Store", price: 2499, url: "#", availability: "In Stock" },
      { name: "HealthKart", price: 2399, url: "#", availability: "In Stock" },
    ]
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:px-6">
      
      <button 
        onClick={() => window.history.back()}
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-12">
        {/* Image Placeholder */}
        <div className="bg-secondary/30 border border-border rounded-3xl aspect-square flex items-center justify-center p-8">
           <div className="w-32 h-32 bg-surface rounded-full flex items-center justify-center shadow-inner">
             <ShoppingCart className="w-10 h-10 text-muted-foreground opacity-50" />
           </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-500 bg-teal-500/10 px-3 py-1 rounded-full">
              {product.type}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">{product.title}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h3 className="font-bold mb-4">Where to buy</h3>
            <div className="space-y-3">
              {product.sellers.map((seller, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border/50">
                  <div className="font-medium">{seller.name}</div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">₹{seller.price}</span>
                    <a href={seller.url} target="_blank" rel="noreferrer" className="flex items-center text-sm text-primary hover:underline">
                      Buy <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Pros / Cons */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-green-500 mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2" /> Pros
              </h3>
              <ul className="space-y-2">
                {product.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-green-500 font-medium mr-2">•</span>
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-red-500 mb-4 flex items-center">
                <X className="w-5 h-5 mr-2" /> Cons
              </h3>
              <ul className="space-y-2">
                {product.limitations.map((lim, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-red-500 font-medium mr-2">•</span>
                    {lim}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="md:col-span-1">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-bold mb-4">Specifications</h3>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-sm text-muted-foreground">{key}</span>
                  <span className="text-sm font-medium text-right ml-4">{value as React.ReactNode}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
