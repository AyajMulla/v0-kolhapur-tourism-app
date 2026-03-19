"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("places");
  const [data, setData] = useState({ places: [], hotels: [], restaurants: [] });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

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
      fetchData(); // Refresh UI
    } catch (err) {
      alert(err.message);
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
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const renderTable = (items) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left bg-white rounded-lg overflow-hidden border">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id || idx} className="border-t hover:bg-gray-50 transition border-gray-100">
              <td className="p-4 font-mono text-xs text-gray-500">{item.id}</td>
              <td className="p-4 font-medium text-gray-800">{item.name}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-xs font-semibold">
                  {item.category || item.cuisine || "Unknown"}
                </span>
              </td>
              <td className="p-4 flex space-x-2">
                <Button size="icon" variant="outline" className="h-8 w-8 text-blue-600" onClick={() => handleOpenModal(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 text-red-600" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">No records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage database records securely.</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => handleOpenModal(null)} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add New
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-200 border-0">
              <TabsTrigger value="places">Places</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="places" className="m-0 p-4">
              {renderTable(data.places)}
            </TabsContent>
            <TabsContent value="hotels" className="m-0 p-4">
              {renderTable(data.hotels)}
            </TabsContent>
            <TabsContent value="restaurants" className="m-0 p-4">
              {renderTable(data.restaurants)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
                <div className="space-y-2">
                  <Label>Taluka ID</Label>
                  <Input value={formData.talukaId || ""} onChange={e => setFormData({...formData, talukaId: e.target.value})} placeholder="e.g. karvir" />
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
