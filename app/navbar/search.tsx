'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchProducts = () => {
  const [query, setQuery] = React.useState('');

  const handleSearch = () => {
    console.log('Searching for:', query);
  };

  return (
    <div className="flex items-center gap-2 w-75">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8 h-9 text-black bg-white dark:text-white placeholder:text-muted-foreground"
        />
      </div>
      <Button
        onClick={handleSearch}
        variant="outline"
        size="sm"
        className="h-9 px-3 dark:bg-zinc-800 dark:text-white">
        Search..
      </Button>
    </div>
  );
};

export default SearchProducts;
