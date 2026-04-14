import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/searchDialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Fuse from "fuse.js";
import searchData from "@/lib/search";

const options = {
  keys: ["label", "description", "keywords"],
  threshold: 0.3,
};

const SearchModal = ({ open, setOpen }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const fuse = new Fuse(searchData, options);

  useEffect(() => {
    if (query.trim() === "") {
      setResult([]);
      return;
    }

    const res = fuse.search(query);
    setResult(res.map((r) => r.item));
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Search</DialogTitle>
          <DialogDescription>
            find and navigate to anything in your store, from products to orders
            and customers.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Type to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <ul className="mt-4 max-h-60 overflow-y-auto">
          {result.map((item, idx) => (
            <li key={idx}>
              <Link href={item.url} className="block py-2 px-3 rounded hover:bg-muted" onClick={() => setOpen(false)}>
                <h4 className="font-medium">{item.label}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        {query && result.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-0">
            No results found for "{query}"
            </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
