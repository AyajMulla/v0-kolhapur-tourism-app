"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, RefreshCw, Search, BedDouble, Utensils, MapPin, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AdminDashboard() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("places");
  const [data, setData] = useState({ places: [], hotels: [], restaurants: [] });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  
  // Advanced Features State
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [placesRes, hotelsRes, restRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/places`),
        fetch(`${API_BASE_URL}/api/hotels`),
        fetch(`${API_BASE_URL}/api/restaurants`),
      ]);
      const [places, hotels, restaurants] = await Promise.all([
        placesRes.json(),
        hotelsRes.json(),
        restRes.json(),
      ]);
      setData({ places, hotels, restaurants });
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      toast({ title: "Connection Error", description: "Failed to load database records.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      // Default empty form payload
      setFormData({
        id: "", name: "", description: "", image: "", category: "", rating: 4.0, address: "", talukaId: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const endpoint = `${API_BASE_URL}/api/admin/${activeTab}`;
    const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;
    const method = editingItem ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to save data");
      
      setIsModalOpen(false);
      toast({ title: "Success", description: `Record successfully ${editingItem ? 'updated' : 'created'}.`, variant: "default" });
      fetchData(); // Refresh UI
    } catch (err) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/${activeTab}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      toast({ title: "Deleted", description: "Record permanently removed.", variant: "default" });
      fetchData();
    } catch (err) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  const exportToCSV = () => {
    const items = data[activeTab];
    if (!items || items.length === 0) return;
    
    // Get headers
    const headers = Object.keys(items[0]).filter(k => typeof items[0][k] !== 'object');
    
    // Create CSV rows
    const csvRows = [];
    csvRows.push(headers.join(',')); // Add Header Row
    
    items.forEach(item => {
      const values = headers.map(header => {
        const val = item[header];
        // Escape quotes and wrap in quotes to handle commas within strings
        return `"${String(val || '').replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });
    
    // Create blob and download
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `kolhapur_${activeTab}_export.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({ title: "Export Successful", description: `Downloaded ${items.length} records.`, variant: "default" });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = (items) => {
    const sortableItems = [...items];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  };

  const filteredItems = (items) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderTable = (items) => {
    const displayedItems = filteredItems(items);
    const sortedItems = getSortedItems(displayedItems);
    
    // Pagination Logic
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    // Ensure we don't sit on an empty page after deletion/search
    const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

    const SortIcon = ({ columnKey }) => {
      if (sortConfig.key !== columnKey) return null;
      return sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4 ml-1 inline" /> : <ChevronDown className="h-4 w-4 ml-1 inline" />;
    };

    return (
      <div className="flex flex-col space-y-4">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left bg-white">
            <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-200">
              <tr>
                <th 
                  className="p-4 font-semibold text-sm cursor-pointer hover:bg-gray-100 transition select-none"
                  onClick={() => handleSort("id")}
                >
                  ID <SortIcon columnKey="id" />
                </th>
                <th 
                  className="p-4 font-semibold text-sm cursor-pointer hover:bg-gray-100 transition select-none"
                  onClick={() => handleSort("name")}
                >
                  Name <SortIcon columnKey="name" />
                </th>
                <th 
                  className="p-4 font-semibold text-sm cursor-pointer hover:bg-gray-100 transition select-none"
                  onClick={() => handleSort("category")}
                >
                  Category <SortIcon columnKey="category" />
                </th>
                <th className="p-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedItems.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="p-4 font-mono text-xs text-gray-500 w-1/4">{item.id}</td>
                  <td className="p-4 font-medium text-gray-900">{item.name}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold border border-orange-200">
                      {item.category || item.cuisine || "Unknown"}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="outline" className="h-8 w-8 text-blue-600 hover:bg-blue-50 border-blue-200" onClick={() => handleOpenModal(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search className="h-8 w-8 mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-600">No records found</p>
                      <p className="text-sm">Try adjusting your search query.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedItems.length)} of {sortedItems.length} entries
            </span>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={validCurrentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <div className="flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium bg-gray-50">
                Page {validCurrentPage} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={validCurrentPage === totalPages}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header Area */}
      <div className="bg-white border-b border-gray-200 px-6 py-8 md:px-12 mb-8">
        <div className="max-w-7xl mx-auto mb-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-orange-600 font-medium transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Exit to Website
          </Link>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage all regions, hotels, and tourism data securely.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={exportToCSV} className="bg-white text-green-700 hover:bg-green-50 hover:text-green-800 border-green-200 shadow-sm">
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button variant="outline" onClick={fetchData} disabled={loading} className="bg-white shadow-sm border-gray-200">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button onClick={() => handleOpenModal(null)} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-md">
              <Plus className="h-4 w-4 mr-2" /> Add Record
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-md rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin className="h-24 w-24" /></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Tourist Places</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{data.places.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-md rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10"><BedDouble className="h-24 w-24" /></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Registered Hotels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{data.hotels.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-md rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Utensils className="h-24 w-24" /></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Listed Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{data.restaurants.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-white border-b px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-1 rounded-lg">
                <TabsTrigger value="places" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Places</TabsTrigger>
                <TabsTrigger value="hotels" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Hotels</TabsTrigger>
                <TabsTrigger value="restaurants" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Restaurants</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Search Bar Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search records by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-orange-500 rounded-full h-10 w-full"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-gray-50/30">
            <Tabs value={activeTab} onValueChange={(val) => {
              setActiveTab(val);
              setCurrentPage(1); // Reset pagination on tab change
              setSearchTerm(""); // Reset search on tab change
            }} className="w-full">
              <TabsContent value="places" className="m-0 p-6 animate-in fade-in duration-300">
                {renderTable(data.places)}
              </TabsContent>
              <TabsContent value="hotels" className="m-0 p-6 animate-in fade-in duration-300">
                {renderTable(data.hotels)}
              </TabsContent>
              <TabsContent value="restaurants" className="m-0 p-6 animate-in fade-in duration-300">
                {renderTable(data.restaurants)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Editor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Record" : "Create New Record"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ID (Slug)</Label>
                <Input required disabled={!!editingItem} value={formData.id || ""} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="e.g. mahalaxmi-temple" />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input required value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Location Name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category / Cuisine</Label>
              <Input required value={formData.category || formData.cuisine || ""} onChange={e => setFormData({...formData, category: e.target.value, cuisine: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={formData.image || ""} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="/placeholder.jpg" />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <Input type="number" step="0.1" max="5" required value={formData.rating || 4.0} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
            </div>

            {(activeTab === "places") ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Visit Duration</Label>
                    <Input value={formData.visitDuration || ""} onChange={e => setFormData({...formData, visitDuration: e.target.value})} placeholder="e.g. 2-3 hours" />
                  </div>
                  <div className="space-y-2">
                    <Label>Best Time</Label>
                    <Input value={formData.bestTimeToVisit || ""} onChange={e => setFormData({...formData, bestTimeToVisit: e.target.value})} placeholder="e.g. October to March" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Visitor Tips (Comma Separated)</Label>
                  <Input 
                    value={formData.visitorTips?.join(", ") || ""} 
                    onChange={e => setFormData({...formData, visitorTips: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} 
                    placeholder="e.g. Bring water, Wear shoes..." 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Taluka ID</Label>
                    <Input value={formData.talukaId || ""} onChange={e => setFormData({...formData, talukaId: e.target.value})} placeholder="e.g. karveer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Taluka Name</Label>
                    <Input value={formData.talukaName || ""} onChange={e => setFormData({...formData, talukaName: e.target.value})} placeholder="e.g. Kolhapur City" />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>Address</Label>
                <Input required value={formData.address || ""} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
