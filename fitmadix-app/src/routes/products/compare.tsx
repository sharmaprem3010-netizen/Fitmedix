import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, X, Plus } from "lucide-react";

export const Route = createFileRoute("/products/compare")({
  component: CompareProducts,
});

function CompareProducts() {
  // Mock products for comparison
  const products = [
    {
      id: 1,
      title: "Premium Whey Isolate",
      price: "₹2,499",
      specs: { Protein: "25g", Carbs: "1g", Calories: "110" },
      pros: ["Fast absorption", "Lactose-free"],
      cons: ["More expensive"]
    },
    {
      id: 2,
      title: "Standard Whey Concentrate",
      price: "₹1,899",
      specs: { Protein: "24g", Carbs: "3g", Calories: "120" },
      pros: ["Affordable", "Great taste"],
      cons: ["Contains lactose", "Slower absorption"]
    }
  ];

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6">
      <button 
        onClick={() => window.history.back()}
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Products
      </button>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Compare Products</h1>
        <p className="text-muted-foreground">Compare features, specifications, and prices side-by-side.</p>
      </div>

      <div className="overflow-x-auto pb-8">
        <table className="w-full min-w-200 border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left border-b border-border w-1/4">
                <button className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                  <Plus className="w-6 h-6 mb-2" />
                  <span className="block font-medium">Add Product</span>
                </button>
              </th>
              {products.map(p => (
                <th key={p.id} className="p-4 border-b border-border w-1/3">
                  <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                      <p className="text-xl font-extrabold text-primary">{p.price}</p>
                    </div>
                    <Link to="/products/$slug" params={{ slug: 'demo' }} className="mt-4 text-sm font-medium hover:underline">
                      View details
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 font-bold border-b border-border/50 text-muted-foreground uppercase tracking-wider text-xs">
                Specifications
              </td>
              <td className="border-b border-border/50"></td>
              <td className="border-b border-border/50"></td>
            </tr>
            {["Protein", "Carbs", "Calories"].map(spec => (
              <tr key={spec}>
                <td className="p-4 font-medium border-b border-border/50">{spec}</td>
                {products.map(p => (
                  <td key={p.id} className="p-4 border-b border-border/50 text-center">
                    {p.specs[spec as keyof typeof p.specs]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4 font-bold border-b border-border/50 text-muted-foreground uppercase tracking-wider text-xs mt-4 block">
                Pros & Cons
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Advantages</td>
              {products.map(p => (
                <td key={p.id} className="p-4 align-top">
                  <ul className="space-y-2">
                    {p.pros.map((pro, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium">Limitations</td>
              {products.map(p => (
                <td key={p.id} className="p-4 align-top">
                  <ul className="space-y-2">
                    {p.cons.map((con, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <X className="w-4 h-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
