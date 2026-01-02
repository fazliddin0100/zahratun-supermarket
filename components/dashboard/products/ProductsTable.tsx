'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { IndeterminateCheckbox } from '@/components/dashboard/products/indeterminate-checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

type ProductStatusType = 'active' | 'draft' | 'deactive';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  status: ProductStatusType;
  date: string;
  image: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Haldiram's Sev Bhujia",
    category: 'Snack & Munchies',
    price: 18,
    status: 'active',
    date: '24 Nov 2022',
    image: '/images/products/product-img-1.jpg',
  },
  {
    id: 2,
    name: 'NutriChoice Digestive',
    category: 'Bakery & Biscuits',
    price: 24,
    status: 'draft',
    date: '20 Nov 2022',
    image: '/images/products/product-img-2.jpg',
  },
  {
    id: 3,
    name: 'Onion Flavour Potato',
    category: 'Snack & Munchies',
    price: 9,
    status: 'deactive',
    date: '15 Nov 2022',
    image: '/images/products/product-img-3.jpg',
  },
  {
    id: 4,
    name: 'Cadbury Dairy Milk',
    category: 'Chocolates',
    price: 15,
    status: 'active',
    date: '10 Dec 2022',
    image: '/images/products/product-img-4.jpg',
  },
  {
    id: 5,
    name: 'Lays Classic Salted',
    category: 'Snack & Munchies',
    price: 12,
    status: 'active',
    date: '05 Dec 2022',
    image: '/images/products/product-img-5.jpg',
  },
  {
    id: 6,
    name: 'Parle-G Glucose Biscuit',
    category: 'Bakery & Biscuits',
    price: 8,
    status: 'draft',
    date: '01 Dec 2022',
    image: '/images/products/product-img-6.jpg',
  },
  {
    id: 7,
    name: 'Maggi 2 Minute Noodles',
    category: 'Instant Food',
    price: 22,
    status: 'deactive',
    date: '28 Nov 2022',
    image: '/images/products/product-img-7.jpg',
  },
  {
    id: 8,
    name: 'KitKat Chocolate',
    category: 'Chocolates',
    price: 13,
    status: 'active',
    date: '25 Nov 2022',
    image: '/images/products/product-img-8.jpg',
  },
];

const StatusBadge = ({ status }: { status: ProductStatusType }) => {
  const styles = {
    active: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none',
    draft: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-none',
    deactive: 'bg-rose-100 text-rose-700 hover:bg-rose-100 border-none',
  };

  const labels = { active: 'Faol', draft: 'Qoralama', deactive: 'Nofaol' };

  return (
    <Badge
      className={`${styles[status]} capitalize px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide`}>
      {labels[status]}
    </Badge>
  );
};

export default function ProductsTable() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // Status uchun yangi state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Qidiruv va Status bo'yicha filtrlash
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const isAllSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.includes(p.id));
  const isIndeterminate =
    selectedIds.some((id) => paginatedProducts.map((p) => p.id).includes(id)) &&
    !isAllSelected;

  const handleAction = (type: string, id: number) => {
    toast.info(`Mahsulot #${id} uchun ${type} amali bajarilmoqda`);
  };

  const handleDeleteSelected = () => {
    if (confirm(`${selectedIds.length} ta mahsulotni oʻchirmoqchimisiz?`)) {
      toast.error(`${selectedIds.length} ta mahsulot oʻchirildi`);
      setSelectedIds([]);
    }
  };

  return (
    <div className="w-full h-full space-y-6">
      {/* Search and Status Filter Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:max-w-3xl">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Mahsulot yoki kategoriya qidirish..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 rounded-2xl h-11 bg-white border-gray-200"
            />
          </div>

          {/* Status Select Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}>
            <SelectTrigger className="w-full sm:w-56 h-11 rounded-2xl bg-white border-gray-200">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                <SelectValue placeholder="Status bo'yicha" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Barcha statuslar</SelectItem>
              <SelectItem value="active">Faol</SelectItem>
              <SelectItem value="draft">Qoralama</SelectItem>
              <SelectItem value="deactive">Nofaol</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selected Actions & Count */}
        <div className="flex items-center gap-3 shrink-0">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="rounded-xl h-10 px-4">
              {selectedIds.length} ta oʻchirish
            </Button>
          )}
          <div className="text-sm text-gray-500 bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm">
            Natijalar:{' '}
            <span className="font-bold text-blue-600">
              {filteredProducts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-gray-100/50">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-12.5 pl-6">
                <IndeterminateCheckbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  indeterminate={isIndeterminate}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Mahsulot
              </TableHead>
              <TableHead className="font-semibold text-gray-600 hidden md:table-cell">
                Kategoriya
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Narx
              </TableHead>
              <TableHead className="font-semibold text-gray-600 hidden lg:table-cell">
                Sana
              </TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p, index) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group border-b border-gray-50 last:border-none hover:bg-blue-50/30 transition-all">
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={selectedIds.includes(p.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(p.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <span className="font-bold text-gray-700 text-sm md:text-base block">
                        {p.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 hidden md:table-cell">
                    {p.category}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">
                    ${p.price}.00
                  </TableCell>
                  <TableCell className="text-gray-400 text-xs hidden lg:table-cell italic">
                    {p.date}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl p-2">
                        <DropdownMenuItem
                          onClick={() => handleAction('koʻrish', p.id)}
                          className="gap-2 rounded-lg cursor-pointer">
                          <Eye className="h-4 w-4" /> Koʻrish
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction('tahrirlash', p.id)}
                          className="gap-2 rounded-lg cursor-pointer">
                          <Edit className="h-4 w-4" /> Tahrirlash
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction('oʻchirish', p.id)}
                          className="gap-2 rounded-lg text-rose-600 focus:bg-rose-50 cursor-pointer">
                          <Trash2 className="h-4 w-4" /> Oʻchirish
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-gray-500 italic">
                  Ma&apos;lumot topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            Sahifa{' '}
            <span className="text-blue-600 font-bold">{currentPage}</span> /{' '}
            {totalPages}
          </p>
          <div className="flex items-center gap-1 bg-white/70 p-1.5 rounded-2xl shadow-sm border border-gray-100/50">
            <PaginationButton
              label="Oldingi"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            />
            <PaginationButton
              label="Keyingi"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PaginationButton({
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant={active ? 'default' : 'ghost'}
      className={`px-4 py-2 text-xs font-bold rounded-xl h-9 transition-all ${
        active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'
      } ${disabled ? 'opacity-30' : 'hover:bg-gray-100'}`}>
      {label}
    </Button>
  );
}
