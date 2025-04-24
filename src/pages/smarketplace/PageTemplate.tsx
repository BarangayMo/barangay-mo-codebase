
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PageTemplateProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  hasTabs?: boolean;
  tabItems?: {icon: React.ReactNode; label: string; value: string}[];
}

const PageTemplate: React.FC<PageTemplateProps> = ({ 
  title, 
  description, 
  children,
  hasTabs = false,
  tabItems = [
    { icon: null, label: "All", value: "all" },
    { icon: null, label: "Active", value: "active" },
    { icon: null, label: "Pending", value: "pending" },
    { icon: null, label: "Archived", value: "archived" }
  ]
}) => {
  // Generate sample data based on the title
  const generateSampleData = () => {
    if (title.toLowerCase().includes("product")) {
      return [
        { id: 'P001', name: 'Organic Rice (5kg)', category: 'Groceries', price: '₱350', status: 'Active', vendor: 'Green Farms', stock: 125 },
        { id: 'P002', name: 'Hand-woven Basket', category: 'Home Goods', price: '₱750', status: 'Active', vendor: 'Local Crafts', stock: 32 },
        { id: 'P003', name: 'Coconut Soap', category: 'Personal Care', price: '₱85', status: 'Low Stock', vendor: 'Natural Products', stock: 8 },
        { id: 'P004', name: 'Dried Mango', category: 'Snacks', price: '₱220', status: 'Active', vendor: 'Tropical Treats', stock: 45 },
        { id: 'P005', name: 'Bamboo Toothbrush', category: 'Personal Care', price: '₱120', status: 'Pending Review', vendor: 'Eco Friends', stock: 0 }
      ];
    } 
    else if (title.toLowerCase().includes("order")) {
      return [
        { id: 'ORD-2521', customer: 'Maria Santos', date: '2025-04-20', status: 'Delivered', total: '₱1,250', items: 3 },
        { id: 'ORD-2522', customer: 'Juan Cruz', date: '2025-04-22', status: 'Processing', total: '₱875', items: 2 },
        { id: 'ORD-2523', customer: 'Elena Reyes', date: '2025-04-23', status: 'Shipped', total: '₱2,350', items: 5 },
        { id: 'ORD-2524', customer: 'Carlos Bautista', date: '2025-04-23', status: 'Processing', total: '₱430', items: 1 },
        { id: 'ORD-2525', customer: 'Sofia Lopez', date: '2025-04-24', status: 'Pending Payment', total: '₱1,780', items: 4 }
      ];
    }
    else if (title.toLowerCase().includes("vendor")) {
      return [
        { id: 'V001', name: 'Green Farms Co-op', products: 32, status: 'Verified', rating: '4.8', sales: '₱325,650' },
        { id: 'V002', name: 'Local Crafts Association', products: 56, status: 'Verified', rating: '4.5', sales: '₱215,470' },
        { id: 'V003', name: 'Natural Products Inc.', products: 18, status: 'Pending Review', rating: '-', sales: '₱0' },
        { id: 'V004', name: 'Tropical Treats Foods', products: 24, status: 'Active', rating: '4.2', sales: '₱189,320' },
        { id: 'V005', name: 'Eco Friends Philippines', products: 12, status: 'Active', rating: '4.7', sales: '₱97,850' }
      ];
    }
    else if (title.toLowerCase().includes("customer")) {
      return [
        { id: 'C001', name: 'Maria Santos', orders: 12, spending: '₱25,350', joined: '2024-10-15', status: 'Active' },
        { id: 'C002', name: 'Juan Cruz', orders: 5, spending: '₱8,750', joined: '2024-12-03', status: 'Active' },
        { id: 'C003', name: 'Elena Reyes', orders: 28, spending: '₱52,430', joined: '2024-08-22', status: 'VIP' },
        { id: 'C004', name: 'Carlos Bautista', orders: 1, spending: '₱430', joined: '2025-04-10', status: 'New' },
        { id: 'C005', name: 'Sofia Lopez', orders: 8, spending: '₱12,780', joined: '2024-11-18', status: 'Active' }
      ];
    }
    else if (title.toLowerCase().includes("review")) {
      return [
        { id: 'R001', product: 'Organic Rice (5kg)', rating: '5', reviewer: 'Maria S.', date: '2025-04-15', status: 'Published' },
        { id: 'R002', product: 'Hand-woven Basket', rating: '4', reviewer: 'Juan C.', date: '2025-04-12', status: 'Published' },
        { id: 'R003', product: 'Coconut Soap', rating: '2', reviewer: 'Elena R.', date: '2025-04-20', status: 'Flagged' },
        { id: 'R004', product: 'Dried Mango', rating: '5', reviewer: 'Carlos B.', date: '2025-04-18', status: 'Published' },
        { id: 'R005', product: 'Bamboo Toothbrush', rating: '3', reviewer: 'Sofia L.', date: '2025-04-22', status: 'Pending' }
      ];
    }
    else {
      // Default data for other pages
      return [
        { id: '001', name: 'Item 1', category: 'Category A', status: 'Active', date: '2025-04-20' },
        { id: '002', name: 'Item 2', category: 'Category B', status: 'Pending', date: '2025-04-21' },
        { id: '003', name: 'Item 3', category: 'Category A', status: 'Active', date: '2025-04-22' },
        { id: '004', name: 'Item 4', category: 'Category C', status: 'Archived', date: '2025-04-23' },
        { id: '005', name: 'Item 5', category: 'Category B', status: 'Active', date: '2025-04-24' }
      ];
    }
  };

  const sampleData = generateSampleData();

  // Dynamic column headers based on the first row of data
  const getHeaders = () => {
    if (sampleData && sampleData.length > 0) {
      return Object.keys(sampleData[0]);
    }
    return [];
  };

  const renderTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {getHeaders().map(header => (
              <TableHead key={header} className="capitalize">
                {header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.map((row, index) => (
            <TableRow key={index} className="cursor-pointer hover:bg-gray-50">
              {Object.values(row).map((value, i) => (
                <TableCell key={i}>
                  <Link to={`${window.location.pathname}/${row.id}`}>
                    {value}
                  </Link>
                </TableCell>
              ))}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Layout>
      <Helmet>
        <title>{title} - Smarketplace Admin - Barangay Mo</title>
      </Helmet>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
              <CardTitle>{title}</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className="pl-10 md:w-[200px]" placeholder={`Search ${title.toLowerCase()}`} />
                </div>
                <Button>Add New</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {hasTabs ? (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 border-b w-full rounded-none bg-transparent h-auto p-0 flex-wrap">
                  {tabItems.map((item) => (
                    <TabsTrigger 
                      key={item.value}
                      value={item.value}
                      className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="all">
                  {children || renderTable()}
                </TabsContent>
                {tabItems.slice(1).map((item) => (
                  <TabsContent key={item.value} value={item.value}>
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-gray-500">No {item.label.toLowerCase()} items found</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              children || renderTable()
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// For TypeScript compatibility
import { Link } from "react-router-dom";

export default PageTemplate;
