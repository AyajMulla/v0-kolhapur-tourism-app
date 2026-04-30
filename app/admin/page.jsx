"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, RefreshCw, Search, BedDouble, Utensils, MapPin, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, X, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AdminDashboard() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("places");
  const [data, setData] = useState({ places: [], hotels: [], restaurants: [], admins: [] });
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

  // CSV Import State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState(null);
  const [csvDragOver, setCsvDragOver] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [placesRes, hotelsRes, restRes, adminsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/places`),
        fetch(`${API_BASE_URL}/api/hotels`),
        fetch(`${API_BASE_URL}/api/restaurants`),
        fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      const [places, hotels, restaurants, admins] = await Promise.all([
        placesRes.json(),
        hotelsRes.json(),
        restRes.json(),
        adminsRes.json(),
      ]);
      setData({ places, hotels, restaurants, admins });
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
      setFormData({ ...item });
    } else {
      // Initialize form with tab-specific defaults so all required fields are present
      if (activeTab === 'places') {
        setFormData({ id: "", name: "", description: "", image: "/placeholder.jpg", category: "", rating: 4.0, talukaId: "", talukaName: "", visitDuration: "", bestTimeToVisit: "", visitorTips: [] });
      } else if (activeTab === 'hotels') {
        setFormData({ id: "", name: "", category: "", rating: 4.0, address: "", priceRange: "", phone: "", website: "" });
      } else if (activeTab === 'restaurants') {
        setFormData({ id: "", name: "", cuisine: "", rating: 4.0, address: "", priceRange: "", phone: "", openHours: "" });
      } else {
        setFormData({ name: "", email: "", password: "" });
      }
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    let url, method, body;
    
    if (activeTab === 'admins') {
      url = `${API_BASE_URL}/api/admin/users/create-admin`;
      method = "POST";
      body = JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
    } else {
      const endpoint = `${API_BASE_URL}/api/admin/${activeTab}`;
      url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;
      method = editingItem ? "PUT" : "POST";
      body = JSON.stringify(formData);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body
      });
      if (!res.ok) {
        // Read actual error message from server response
        let errMsg = "Failed to save data";
        try {
          const errData = await res.json();
          errMsg = errData.error || errData.msg || errData.message || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
      }
      
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

  // --- CSV IMPORT FUNCTIONS ---
  const downloadCsvTemplate = () => {
    const headers = "id,name,description,image,category,rating,visitDuration,bestTimeToVisit,talukaId,talukaName,coordinates_lat,coordinates_lng,visitorTips";
    const sample = "amboli-viewpoint,Amboli Viewpoint,Scenic viewpoint in the Western Ghats.,/amboli-ghat.jpg,Nature,4.5,2-3 hours,June to September,ajara,Ajara,16.0500,74.0300,Carry rainwear|Visit early morning";
    const blob = new Blob([headers + "\n" + sample], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "places_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;
    setCsvUploading(true);
    setCsvResult(null);
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/places/bulk-upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setCsvResult(data);
      fetchData(); // Refresh the places table
    } catch (err) {
      setCsvResult({ error: err.message });
    } finally {
      setCsvUploading(false);
    }
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
                  {activeTab === 'admins' ? 'Email' : 'Category'} <SortIcon columnKey={activeTab === 'admins' ? 'email' : 'category'} />
                </th>
                <th className="p-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedItems.map((item, idx) => (
                <tr key={item.id || item._id || idx} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="p-4 font-mono text-xs text-gray-500 w-1/4">{item.id || item._id}</td>
                  <td className="p-4 font-medium text-gray-900">{item.name}</td>
                  <td className="p-4">
                    {activeTab === 'admins' ? (
                      <span className="text-gray-600 text-sm">{item.email}</span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold border border-orange-200">
                        {item.category || item.cuisine || "Unknown"}
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex justify-end space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    {activeTab !== 'admins' && (
                      <Button size="icon" variant="outline" className="h-8 w-8 text-blue-600 hover:bg-blue-50 border-blue-200" onClick={() => handleOpenModal(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 text-red-600 hover:bg-red-50 border-red-200" 
                      onClick={() => activeTab === 'admins' ? toast({title: "Not Implemented", description: "Admin deletion must be done via DB for safety."}) : handleDelete(item.id)}
                    >
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
            {activeTab === "places" && (
              <Button
                variant="outline"
                onClick={() => { setIsCsvModalOpen(true); setCsvFile(null); setCsvResult(null); }}
                className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 border-blue-200 shadow-sm"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Import CSV
              </Button>
            )}
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
              <TabsList className="grid w-full grid-cols-4 bg-gray-100/80 p-1 rounded-lg">
                <TabsTrigger value="places" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Places</TabsTrigger>
                <TabsTrigger value="hotels" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Hotels</TabsTrigger>
                <TabsTrigger value="restaurants" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Restaurants</TabsTrigger>
                <TabsTrigger value="admins" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Admins</TabsTrigger>
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
              <TabsContent value="admins" className="m-0 p-6 animate-in fade-in duration-300">
                {renderTable(data.admins)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Custom Editor Modal - fixed overlay to avoid Radix portal issues */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? "Edit Record" : (activeTab === 'admins' ? "Add New Administrator" : `Add New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}`)}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body - Form */}
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {activeTab === 'admins' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input required value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input required type="email" value={formData.email || ""} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input required type="password" value={formData.password || ""} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Min 6 characters" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
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

                  {/* Category field: 'cuisine' for restaurants, 'category' for others */}
                  <div className="space-y-2">
                    <Label>{activeTab === 'restaurants' ? 'Cuisine Type' : 'Category'}</Label>
                    <Input
                      required
                      value={activeTab === 'restaurants' ? (formData.cuisine || "") : (formData.category || "")}
                      onChange={e => {
                        if (activeTab === 'restaurants') {
                          setFormData({...formData, cuisine: e.target.value});
                        } else {
                          setFormData({...formData, category: e.target.value});
                        }
                      }}
                      placeholder={activeTab === 'restaurants' ? "e.g. Maharashtrian" : "e.g. Temple"}
                    />
                  </div>

                  {/* Image URL — only for places (required there) */}
                  {activeTab === 'places' && (
                    <div className="space-y-2">
                      <Label>Image URL <span className="text-red-500">*</span></Label>
                      <Input required value={formData.image || ""} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="/placeholder.jpg" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <Input type="number" step="0.1" min="1" max="5" required value={formData.rating ?? 4.0} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
                  </div>

                  {activeTab === "places" ? (
                    <div className="space-y-4">
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
                        <Label>Description <span className="text-red-500">*</span></Label>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                          required value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})}
                          placeholder="Brief description of this place..."
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Latitude</Label>
                          <Input
                            type="number"
                            step="0.0001"
                            value={formData.coordinates?.[0] || ""}
                            onChange={e => {
                              const coords = [...(formData.coordinates || [0, 0])];
                              coords[0] = parseFloat(e.target.value);
                              setFormData({...formData, coordinates: coords});
                            }}
                            placeholder="e.g. 16.7050"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Longitude</Label>
                          <Input
                            type="number"
                            step="0.0001"
                            value={formData.coordinates?.[1] || ""}
                            onChange={e => {
                              const coords = [...(formData.coordinates || [0, 0])];
                              coords[1] = parseFloat(e.target.value);
                              setFormData({...formData, coordinates: coords});
                            }}
                            placeholder="e.g. 74.2433"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Address <span className="text-red-500">*</span></Label>
                        <Input required value={formData.address || ""} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Full address" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Price Range</Label>
                          <Input value={formData.priceRange || ""} onChange={e => setFormData({...formData, priceRange: e.target.value})} placeholder="e.g. ₹500-₹1500" />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 XXXXXXXXXX" />
                        </div>
                      </div>
                      {activeTab === 'hotels' && (
                        <div className="space-y-2">
                          <Label>Website</Label>
                          <Input value={formData.website || ""} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://..." />
                        </div>
                      )}
                      {activeTab === 'restaurants' && (
                        <div className="space-y-2">
                          <Label>Open Hours</Label>
                          <Input value={formData.openHours || ""} onChange={e => setFormData({...formData, openHours: e.target.value})} placeholder="e.g. 9 AM - 10 PM" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) { setIsCsvModalOpen(false); } }}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Import Places from CSV / Excel</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Upload a .csv or .xlsx file to bulk-add places</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsCsvModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Download Template */}
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div>
                  <p className="text-sm font-semibold text-blue-800">Need a template?</p>
                  <p className="text-xs text-blue-600 mt-0.5">Download the sample CSV with correct column headers</p>
                </div>
                <Button size="sm" variant="outline" onClick={downloadCsvTemplate} className="border-blue-300 text-blue-700 hover:bg-blue-100 shrink-0">
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Template
                </Button>
              </div>

              {/* File Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setCsvDragOver(true); }}
                onDragLeave={() => setCsvDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setCsvDragOver(false); const f = e.dataTransfer.files[0]; if (f) { setCsvFile(f); setCsvResult(null); } }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  csvDragOver ? 'border-blue-500 bg-blue-50' : csvFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onClick={() => document.getElementById('csv-file-input').click()}
              >
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files[0]; if (f) { setCsvFile(f); setCsvResult(null); } }}
                />
                {csvFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <p className="font-semibold text-green-700">{csvFile.name}</p>
                    <p className="text-xs text-gray-500">{(csvFile.size / 1024).toFixed(1)} KB — Click to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="font-medium text-gray-600">Drag & drop your file here</p>
                    <p className="text-xs text-gray-400">or click to browse — .csv or .xlsx, max 5 MB</p>
                  </div>
                )}
              </div>

              {/* Column Reference */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">📋 Required CSV Columns</p>
                <div className="flex flex-wrap gap-1.5">
                  {['id','name','description','category'].map(c => (
                    <span key={c} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-mono border border-red-200">{c} *</span>
                  ))}
                  {['image','rating','visitDuration','bestTimeToVisit','talukaId','talukaName','coordinates_lat','coordinates_lng','visitorTips'].map(c => (
                    <span key={c} className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full font-mono">{c}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">* Required &nbsp;|&nbsp; Use <code className="bg-gray-200 px-1 rounded">|</code> to separate multiple visitorTips</p>
              </div>

              {/* Upload Result */}
              {csvResult && (
                <div className={`rounded-xl p-4 border ${
                  csvResult.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}>
                  {csvResult.error ? (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">{csvResult.error}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-semibold text-green-800">Upload Complete</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center bg-white rounded-lg p-2 border border-green-200">
                          <p className="text-2xl font-bold text-green-600">{csvResult.inserted}</p>
                          <p className="text-xs text-gray-500">Inserted</p>
                        </div>
                        <div className="text-center bg-white rounded-lg p-2 border border-yellow-200">
                          <p className="text-2xl font-bold text-yellow-600">{csvResult.skipped || 0}</p>
                          <p className="text-xs text-gray-500">Skipped</p>
                        </div>
                        <div className="text-center bg-white rounded-lg p-2 border border-red-200">
                          <p className="text-2xl font-bold text-red-500">{csvResult.errors?.length || 0}</p>
                          <p className="text-xs text-gray-500">Errors</p>
                        </div>
                      </div>
                      {csvResult.errors?.length > 0 && (
                        <div className="bg-white rounded-lg border border-red-200 divide-y divide-red-100 max-h-32 overflow-y-auto">
                          {csvResult.errors.map((e, i) => (
                            <div key={i} className="px-3 py-1.5 flex justify-between text-xs">
                              <span className="text-gray-500">Row {e.row}</span>
                              <span className="text-red-600">{e.reason}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setIsCsvModalOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleCsvUpload}
                  disabled={!csvFile || csvUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {csvUploading ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2" /> Upload & Import</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
