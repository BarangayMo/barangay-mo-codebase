
import PageTemplate from "../PageTemplate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash, Edit, Plus, FolderTree } from "lucide-react";

const CategoriesPage = () => {
  const demoCategories = [
    { id: 1, name: "Food & Groceries", productCount: 134, subCategories: 5 },
    { id: 2, name: "Home & Kitchen", productCount: 87, subCategories: 8 },
    { id: 3, name: "Health & Beauty", productCount: 62, subCategories: 3 },
    { id: 4, name: "Clothing & Fashion", productCount: 91, subCategories: 6 },
    { id: 5, name: "Electronics", productCount: 43, subCategories: 4 },
  ];

  return (
    <PageTemplate 
      title="Product Categories" 
      description="Manage product categories and subcategories"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Add New Category</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input id="categoryName" placeholder="e.g. Electronics" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoryParent">Parent Category</Label>
                  <select 
                    id="categoryParent" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">None (Top Level)</option>
                    {demoCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoryDescription">Description</Label>
                  <textarea 
                    id="categoryDescription" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]" 
                    placeholder="Category description"
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoryImage">Category Image</Label>
                  <Input id="categoryImage" type="file" />
                </div>
                
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-8">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-medium">All Categories</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 border-b">Category Name</th>
                    <th className="text-center p-4 border-b">Products</th>
                    <th className="text-center p-4 border-b">Subcategories</th>
                    <th className="text-right p-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {demoCategories.map((category) => (
                    <tr key={category.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{category.name}</div>
                      </td>
                      <td className="p-4 text-center">{category.productCount}</td>
                      <td className="p-4 text-center">
                        <Button variant="ghost" size="sm">
                          <FolderTree className="h-4 w-4 mr-1" />
                          {category.subCategories}
                        </Button>
                      </td>
                      <td className="p-4 text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Category Name</Label>
                                <Input id="edit-name" defaultValue={category.name} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <textarea 
                                  id="edit-description" 
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]" 
                                  placeholder="Category description"
                                ></textarea>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default CategoriesPage;
