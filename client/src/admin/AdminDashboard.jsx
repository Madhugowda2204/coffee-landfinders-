
import { useEffect, useState } from 'react'
import './AdminDashboard.css'
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  LogOut,
  X,
  CheckCircle2,
  Star,
  Home,
  RefreshCw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const API ='https://coffee-landfinders-api.onrender.com'

const emptyForm = {
  title: '',
  location: '',
  type: 'Land & Plots',
  area: '',
  price: '',
  description: '',
  images: '',
  videos: '',
  features: '',
  featured: false,
  status: 'Available'
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const [selectedImages, setSelectedImages] = useState([])
  const [selectedVideos, setSelectedVideos] = useState([])

  useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }

    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API}/properties/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminInfo')
          navigate('/admin')
          return
        }

        throw new Error(data.message || 'Unable to load properties')
      }

      setProperties(data.properties || [])
    } catch (err) {
      setError(err.message || 'Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setSelectedImages([])
    setSelectedVideos([])
    setError('')
    setShowForm(true)
  }

  const openEditForm = (property) => {
    setEditingId(property._id)

    setForm({
      title: property.title || '',
      location: property.location || '',
      type: property.type || 'Land & Plots',
      area: property.area || '',
      price: property.price ?? '',
      description: property.description || '',
      images: (property.images || []).join('\n'),
      videos: (property.videos || []).join('\n'),
      features: (property.features || []).join('\n'),
      featured: property.featured || false,
      status: property.status || 'Available'
    })

    setSelectedImages([])
    setSelectedVideos([])
    setError('')
    setShowForm(true)
  }

  const saveProperty = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      let imageUrls = form.images
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)

      let videoUrls = form.videos
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)

      // Check the maximum allowed media files
      if (imageUrls.length + selectedImages.length > 10) {
        throw new Error('A property can have a maximum of 10 photos.')
      }

      if (videoUrls.length + selectedVideos.length > 3) {
        throw new Error('A property can have a maximum of 3 videos.')
      }

      // Upload selected photos and videos to Cloudinary
      if (selectedImages.length > 0 || selectedVideos.length > 0) {
        const mediaFormData = new FormData()

        selectedImages.forEach(file => {
          mediaFormData.append('images', file)
        })

        selectedVideos.forEach(file => {
          mediaFormData.append('videos', file)
        })

        const uploadResponse = await fetch(
          `${API}/properties/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: mediaFormData
          }
        )

        const uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.message || 'Media upload failed'
          )
        }

        imageUrls = [
          ...imageUrls,
          ...(uploadData.images || [])
        ]

        videoUrls = [
          ...videoUrls,
          ...(uploadData.videos || [])
        ]
      }

      const payload = {
        ...form,
        images: imageUrls,
        videos: videoUrls,
        features: form.features
          .split('\n')
          .map(item => item.trim())
          .filter(Boolean)
      }

      const url = editingId
        ? `${API}/properties/${editingId}`
        : `${API}/properties`

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save property')
      }

      setShowForm(false)
      setForm(emptyForm)
      setSelectedImages([])
      setSelectedVideos([])
      setEditingId(null)

      await fetchProperties()
    } catch (err) {
      setError(err.message || 'Unable to save property')
    } finally {
      setSaving(false)
    }
  }

  const deleteProperty = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this property?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(`${API}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete property')
      }

      await fetchProperties()
    } catch (err) {
      setError(err.message)
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
    navigate('/admin')
  }

  const filteredProperties = properties.filter(property =>
    `${property.title} ${property.location} ${property.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const available = properties.filter(
    p => p.status === 'Available'
  ).length

  const sold = properties.filter(
    p => p.status === 'Sold'
  ).length

  const featured = properties.filter(
    p => p.featured
  ).length

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-mark">CL</div>
          <div>
            <strong>COFFEE</strong>
            <strong>LANDFINDERS</strong>
            <small>ADMINISTRATION</small>
          </div>
        </div>

        <div className="admin-sidebar-label">MENU</div>

        <div className="admin-side-active">
          <Building2 size={19} />
          Property Management
        </div>

        <div className="admin-sidebar-bottom">
          <span>COORG · KARNATAKA</span>
          <button onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">
              COFFEE LANDFINDERS / ADMIN
            </span>
            <h1>Property Dashboard</h1>
          </div>

          <button
            className="admin-logout-mobile"
            onClick={logout}
          >
            <LogOut size={17} /> Logout
          </button>
        </header>

        <section className="admin-welcome">
          <div>
            <span>PROPERTY MANAGEMENT</span>
            <h2>Manage your Coorg listings.</h2>
            <p>
              Add, update and organise your property opportunities.
            </p>
          </div>

          <button
            className="admin-add-button"
            onClick={openAddForm}
          >
            <Plus size={19} /> Add New Property
          </button>
        </section>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <Building2 />
            <span>Total Properties</span>
            <strong>{properties.length}</strong>
          </div>

          <div className="admin-stat-card">
            <CheckCircle2 />
            <span>Available</span>
            <strong>{available}</strong>
          </div>

          <div className="admin-stat-card">
            <Home />
            <span>Sold</span>
            <strong>{sold}</strong>
          </div>

          <div className="admin-stat-card">
            <Star />
            <span>Featured</span>
            <strong>{featured}</strong>
          </div>
        </section>

        <section className="admin-listing-section">
          <div className="admin-listing-heading">
            <div>
              <span>YOUR INVENTORY</span>
              <h2>Property Listings</h2>
            </div>

            <button
              className="admin-refresh"
              onClick={fetchProperties}
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          <div className="admin-search">
            <Search size={18} />
            <input
              placeholder="Search by property, location or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {error && (
            <div className="admin-error">{error}</div>
          )}

          {loading ? (
            <p className="admin-message">
              Loading properties...
            </p>
          ) : filteredProperties.length === 0 ? (
            <div className="admin-empty">
              <Building2 size={38} />
              <h3>No properties found</h3>
              <p>
                Add your first property listing to get started.
              </p>
              <button onClick={openAddForm}>
                <Plus size={17} /> Add Property
              </button>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>PROPERTY</th>
                    <th>TYPE</th>
                    <th>AREA</th>
                    <th>PRICE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProperties.map(property => (
                    <tr key={property._id}>
                      <td>
                        <strong>{property.title}</strong>
                        <small>{property.location}</small>
                      </td>
                      <td>{property.type}</td>
                      <td>{property.area}</td>
                      <td>{property.price}</td>
                      <td>
                        <span
                          className={`admin-status ${
                            property.status === 'Sold' ? 'sold' : ''
                          }`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            title="Edit property"
                            onClick={() => openEditForm(property)}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            title="Delete property"
                            className="admin-delete"
                            onClick={() => deleteProperty(property._id)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showForm && (
          <div className="admin-form-overlay">
            <div className="admin-form-modal">
              <div className="admin-form-heading">
                <div>
                  <span>PROPERTY INFORMATION</span>
                  <h2>
                    {editingId ? 'Edit Property' : 'Add New Property'}
                  </h2>
                </div>

                <button onClick={() => setShowForm(false)}>
                  <X />
                </button>
              </div>

              <form onSubmit={saveProperty}>
                <label>Property Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  required
                />

                <label>Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={updateField}
                  placeholder="e.g. Madikeri, Coorg"
                  required
                />

                <label>Property Type *</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={updateField}
                >
                  <option>Land & Plots</option>
                  <option>Coffee Estates</option>
                  <option>Villas & Homes</option>
                </select>

                <label>Area *</label>
                <input
                  name="area"
                  value={form.area}
                  onChange={updateField}
                  placeholder="e.g. 5 Acres"
                  required
                />

                <label>Price *</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={updateField}
                  placeholder="e.g. Price on Request"
                  required
                />

                <label>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows="4"
                  required
                />

                <label>Upload Property Photos (Maximum 10)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={e =>
                    setSelectedImages(Array.from(e.target.files || []))
                  }
                />
                <small>
                  {selectedImages.length} new photo(s) selected.
                  Existing photo URLs are listed below.
                </small>

                <label>Existing / Additional Image URLs (one per line)</label>
                <textarea
                  name="images"
                  value={form.images}
                  onChange={updateField}
                  rows="3"
                  placeholder="Paste image URLs here, one per line"
                />

                <label>Upload Property Videos (Maximum 3)</label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  multiple
                  onChange={e =>
                    setSelectedVideos(Array.from(e.target.files || []))
                  }
                />
                <small>
                  {selectedVideos.length} new video(s) selected.
                </small>

                <label>Existing / Additional Video URLs (one per line)</label>
                <textarea
                  name="videos"
                  value={form.videos}
                  onChange={updateField}
                  rows="3"
                  placeholder="Paste video URLs here, one per line"
                />

                <label>Property Highlights (one per line)</label>
                <textarea
                  name="features"
                  value={form.features}
                  onChange={updateField}
                  rows="3"
                  placeholder={'Coffee plantation\nRoad access\nScenic views'}
                />

                <label>Listing Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                >
                  <option>Available</option>
                  <option>Sold</option>
                </select>

                <label className="admin-featured-check">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={updateField}
                  />
                  Mark as Featured Property
                </label>

                <div className="admin-form-actions">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" disabled={saving}>
                    {saving
                      ? 'Uploading and Saving...'
                      : editingId
                        ? 'Update Property'
                        : 'Save Property'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
