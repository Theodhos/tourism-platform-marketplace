"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";
import { categories } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(params?.get("category") || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(params?.get("subcategory") || "");

  const location = params?.get("location") || "";
  const country = params?.get("country") || "";
  const keyword = params?.get("q") || "";
  const minPrice = params?.get("minPrice") || "";
  const maxPrice = params?.get("maxPrice") || "";
  const minRating = params?.get("minRating") || "";
  const featured = params?.get("featured") || "";
  const sort = params?.get("sort") || "latest";

  const subcategories = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.subcategories || [];
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedCategory(params?.get("category") || "");
    setSelectedSubcategory(params?.get("subcategory") || "");
  }, [params]);

  function apply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = new URLSearchParams();
    formData.forEach((value, key) => {
      if (value) query.set(key, String(value));
    });
    router.push(`/services?${query.toString()}`);
  }

  return (
    <form onSubmit={apply} className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft">
      <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Filters</p>
            <h3 className="mt-1 text-lg font-black">Refine your search</h3>
          </div>
        </div>
      </div>

      <Input label="Keyword" name="q" defaultValue={keyword} placeholder="Search tours, hotels, or cities..." />
      <Input label="Location" name="location" defaultValue={location} placeholder="City or region" />
      <Input label="Country" name="country" defaultValue={country} placeholder="Country" />
      <Select
        label="Category"
        name="category"
        value={selectedCategory}
        onChange={(event) => {
          setSelectedCategory(event.target.value);
          setSelectedSubcategory("");
        }}
        options={[
          { label: "All categories", value: "" },
          ...categories.map((item) => ({ label: item.label, value: item.value }))
        ]}
      />
      <Select
        label="Subcategory"
        name="subcategory"
        value={selectedSubcategory}
        onChange={(event) => setSelectedSubcategory(event.target.value)}
        options={[
          { label: "All subcategories", value: "" },
          ...subcategories.map((item) => ({ label: item.label, value: item.value }))
        ]}
      />
      <Select
        label="Sort by"
        name="sort"
        defaultValue={sort}
        options={[
          { label: "Latest", value: "latest" },
          { label: "Popular", value: "popular" },
          { label: "Top rated", value: "rating" }
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Min price" name="minPrice" defaultValue={minPrice} placeholder="0" type="number" />
        <Input label="Max price" name="maxPrice" defaultValue={maxPrice} placeholder="1000" type="number" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Min rating" name="minRating" defaultValue={minRating} placeholder="4" type="number" min="1" max="5" />
        <Select
          label="Featured"
          name="featured"
          defaultValue={featured}
          options={[
            { label: "All listings", value: "" },
            { label: "Featured only", value: "true" }
          ]}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Apply filters</Button>
        <Button href="/services" variant="ghost" className="inline-flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
