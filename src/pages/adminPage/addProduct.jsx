import React, { useEffect, useState } from 'react';
import { 
  getCategories, 
  getPropertiesByCategory, 
  getAllProductsByCategory, 
  getPropertiesByProduct, 
  getPropertyValues, 
  addProducts,
  addProperties,
  addPropertyValues
} from "@/services/productServices";
import NavStyle from "@/widgets/layout/nav_style";
import { FaPlus, FaMinus } from "react-icons/fa";

function AddProduct() {
  // Common categories state.
  const [categories, setCategories] = useState([]);
  
  // -------------------------
  // Section: Add Product
  const [selectedProductCategory, setSelectedProductCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [showProductInput, setShowProductInput] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [pictureLink, setPictureLink] = useState('')
  
  // -------------------------
  // Section: Add Properties
  const [selectedPropertyCategory, setSelectedPropertyCategory] = useState('');
  const [properties, setProperties] = useState([]);
  const [showPropertyInput, setShowPropertyInput] = useState(false);
  const [newPropertyName, setNewPropertyName] = useState('');
  
  // -------------------------
  // Section: Add Property Value
  const [pvSelectedCategory, setPvSelectedCategory] = useState('');
  const [pvProducts, setPvProducts] = useState([]);
  const [pvSelectedProduct, setPvSelectedProduct] = useState(null);
  const [pvProperties, setPvProperties] = useState([]);
  const [pvSelectedProperty, setPvSelectedProperty] = useState(null);
  const [pvPropertyValues, setPvPropertyValues] = useState([]);
  const [showPvInput, setShowPvInput] = useState(false);
  const [newPvValue, setNewPvValue] = useState('');
  
  // Optional state if you need to store additional property values.
  const [propertyValues, setPropertyValues] = useState({});
  
  // Active tab state. Valid values: 'product', 'property', 'value'
  const [activeTab, setActiveTab] = useState('product');
  
  // Fetch common categories when the component mounts.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  
  // -------------------------
  // Add Product Section Handlers
  const handleProductCategorySelect = async (category) => {
    setSelectedProductCategory(category.name);
    setProducts([]);
    try {
      const productsData = await getAllProductsByCategory(category.name);
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  const addProduct = () => {
    if (newProductName.trim()) {
      setProducts([...products, { name: newProductName.trim(), isNew: true }]);
      // Optionally, you could clear newProductName here if you want immediate reset:
      // setNewProductName('');
      setShowProductInput(false);
    }
  };
  

  const addLink = () => {
    //set link to product
  }
  
  const removeProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const finishProcessForProduct = async () => {
    if (newProductName.trim()) {
      const productData = { name: newProductName.trim() };
      try {
        const response = await addProducts(productData, selectedProductCategory, pictureLink);
        setProducts([...products, { ...response.product, isNew: true }]);
        setNewProductName('');
        setPictureLink('');
        setShowProductInput(false);
        window.location.reload();
        alert("Product addition process finished!");
        
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };
  
  // -------------------------
  // Add Properties Section Handlers
  const handlePropertyCategorySelect = async (category) => {
    setSelectedPropertyCategory(category.name);
    setProperties([]);
    try {
      const propertiesData = await getPropertiesByCategory(category.name);
      setProperties(propertiesData || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };
  
  const addProperty = () => {
    if (newPropertyName.trim()) {
      setProperties([...properties, { name: newPropertyName.trim(), isNew: true }]);
      setNewPropertyName('');
      setShowPropertyInput(false);
    }
  };
  
  const removeProperty = (index) => {
    const updated = properties.filter((_, i) => i !== index);
    setProperties(updated);
  };

  const finishProcessForPropery = async () => {
    try {
      for (let prop of properties) {
        if (prop.isNew) {
          await addProperties(prop.name, selectedPropertyCategory);
        }
      }
      alert("Properties added successfully!");
      window.location.reload(); // Refresh the page after successful submission.
    } catch (error) {
      console.error("Error adding properties:", error);
    }
  };
  
  
  // -------------------------
  // Add Property Value Section Handlers
  const handlePvCategorySelect = async (category) => {
    setPvSelectedCategory(category.name);
    setPvProducts([]);
    setPvSelectedProduct(null);
    setPvProperties([]);
    setPvSelectedProperty(null);
    setPvPropertyValues([]);
    try {
      const productsData = await getAllProductsByCategory(category.name);
      setPvProducts(productsData || []);
    } catch (error) {
      console.error("Error fetching products for property values:", error);
    }
  };
  
  const handlePvProductSelect = async (product) => {
    setPvSelectedProduct(product);
    setPvProperties([]);
    setPvSelectedProperty(null);
    setPvPropertyValues([]);
    try {
      const pvPropertiesData = await getPropertiesByProduct(product.id, pvSelectedCategory);
      setPvProperties(pvPropertiesData || []);
    } catch (error) {
      console.error("Error fetching properties by product:", error);
    }
  };
  
  const handlePvPropertySelect = async (property) => {
    setPvSelectedProperty(property);
    setPvPropertyValues([]);
    try {
      const pvValuesData = await getPropertyValues(pvSelectedProduct.id, property.id, pvSelectedCategory);
      setPvPropertyValues(pvValuesData || []);
    } catch (error) {
      console.error("Error fetching property values:", error);
    }
  };
  
  const addPvValue = () => {
    if (newPvValue.trim()) {
      setPvPropertyValues([...pvPropertyValues, { value: newPvValue.trim(), isNew: true }]);
      setNewPvValue('');
      setShowPvInput(false);
    }
  };
  
  const removePvValue = (index) => {
    const updated = pvPropertyValues.filter((_, i) => i !== index);
    setPvPropertyValues(updated);
  };
  
  const finishProcessForValue = async () => {
    try {
      if (!pvSelectedProduct || !pvSelectedProperty || !pvSelectedCategory) {
        throw new Error("Please select a product, a property, and a category.");
      }
      
      for (const pv of pvPropertyValues) {
        if (pv.isNew) {
          await addPropertyValues(
            pvSelectedProduct.id,    
            pvSelectedProperty.id,   
            pv.value,                
            pvSelectedCategory       
          );
        }
      }
      alert("Property values added successfully!");
      window.location.reload(); // Refresh the page after successful submission.
    } catch (error) {
      console.error("Error adding property values:", error);
    }
  };
  
  
  return (
    <div className='bg-[#e7e7e7] min-h-screen pb-20'>
      <NavStyle />
      
      {/* Tabs */}
      <div className="flex justify-center gap-5 mt-10 mb-4">
        <button 
          onClick={() => setActiveTab('product')}
          className={`px-4 py-2 rounded-t-md font-rblack ${activeTab === 'product' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Add Product
        </button>
        <button 
          onClick={() => setActiveTab('property')}
          className={`px-4 py-2 rounded-t-md font-rblack ${activeTab === 'property' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Add Properties
        </button>
        <button 
          onClick={() => setActiveTab('value')}
          className={`px-4 py-2 rounded-t-md font-rblack ${activeTab === 'value' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Add Property Value
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mx-20 shadow-lg pt-14 pb-14 pl-40 pr-40 bg-gray">
      {activeTab === 'product' && (
  <div>
    <h1 className='text-2xl font-rblack font-bold mb-5'>Add Product</h1>
    <h1 className='mb-3'>Select a Category for Products</h1>
    <div className="flex flex-wrap gap-3">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => handleProductCategorySelect(cat)}
          className={`rounded-2xl shadow-sm px-5 py-2 ${selectedProductCategory === cat.name ? "bg-green-500 text-white" : "bg-white text-black"}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
    {selectedProductCategory && (
      <div className='mt-10'>
        <h2 className='mb-3'>Products in {selectedProductCategory}</h2>
        <div className="flex flex-wrap gap-3 items-center">
          {products.length ? (
            products.map((prod, idx) => (
              <button
                key={prod.id || idx}
                className="rounded-2xl shadow-sm px-5 py-2 bg-white text-black flex items-center"
              >
                <span>{prod.name}</span>
                {prod.isNew && (
                  <span onClick={(e) => { e.stopPropagation(); removeProduct(idx); }} className="ml-3 text-red-400 cursor-pointer">
                    <FaMinus />
                  </span>
                )}
              </button>
            ))
          ) : (
            <p>No products added yet.</p>
          )}
          <button
            onClick={() => setShowProductInput(!showProductInput)}
            className="rounded-full bg-blue-500 text-white p-2 shadow-sm flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
        <div className='flex flex-col gap-3 mt-3'>
          {showProductInput && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="border p-2 rounded"
                />
                <button onClick={addProduct} className="bg-green-500 text-white px-4 py-2 rounded">
                  Add Product
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter product image link"
                  value={pictureLink}
                  onChange={(e) => setPictureLink(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
            </>
          )}
        </div>
        {products.length > 0 && (
          <div className="mt-10 items-end justify-end flex">
            <button onClick={finishProcessForProduct} className="bg-green-500 hover:bg-green-500/50 text-white px-16 py-2 rounded shadow mr-10">
              Confirm
            </button>
          </div>
        )}
      </div>
    )}
  </div>
)}


        
        {activeTab === 'property' && (
          <div>
            <h1 className='text-2xl font-rblack font-bold mb-5'>Add Properties</h1>
            <h1 className='mb-3'>Select a Category for Properties</h1>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handlePropertyCategorySelect(cat)}
                  className={`rounded-2xl shadow-sm px-5 py-2 ${selectedPropertyCategory === cat.name ? "bg-green-500 text-white" : "bg-white text-black"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            {selectedPropertyCategory && (
              <div className='mt-10'>
                <h2 className='mb-3'>Properties in {selectedPropertyCategory}</h2>
                <div className="flex flex-wrap gap-3 items-center">
                  {properties.length ? (
                    properties.map((prop, idx) => (
                      <button
                        key={prop.id || idx}
                        className="rounded-2xl shadow-sm px-5 py-2 bg-white text-black flex items-center"
                      >
                        <span>{prop.name}</span>
                        {prop.isNew && (
                          <span onClick={(e) => { e.stopPropagation(); removeProperty(idx); }} className="ml-3 text-red-400 cursor-pointer">
                            <FaMinus />
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <p>No properties added yet.</p>
                  )}
                  <button
                    onClick={() => setShowPropertyInput(!showPropertyInput)}
                    className="rounded-full bg-blue-500 text-white p-2 shadow-sm flex items-center justify-center"
                  >
                    <FaPlus />
                  </button>
                </div>
                {showPropertyInput && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter property name"
                      value={newPropertyName}
                      onChange={(e) => setNewPropertyName(e.target.value)}
                      className="border p-2 rounded"
                    />
                    <button onClick={addProperty} className="bg-green-500 text-white px-4 py-2 rounded">
                      Add Property
                    </button>
                  </div>
                )}
                {properties.length > 0 && (
                  <div className="mt-10 items-end justify-end flex">
                    <button onClick={finishProcessForPropery} className="bg-green-500 hover:bg-green-500/50 text-white px-16 py-2 rounded shadow mr-10">
                      Add Property
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'value' && (
          <div>
            <h1 className='text-2xl font-rblack font-bold mb-5'>Add Property Value</h1>
            <h1 className='mb-3'>Select a Category for Property Value</h1>
            <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
  <button
    key={cat.id}
    onClick={() => handlePvCategorySelect(cat)}
    className={`rounded-2xl shadow-sm px-5 py-2 ${pvSelectedCategory === cat.name ? "bg-green-500 text-white" : "bg-white text-black"}`}
  >
    {cat.name}
  </button>
))}

            </div>
            {pvSelectedCategory && (
              <div className='mt-10'>
                <h2 className='mb-3'>Products in {pvSelectedCategory}</h2>
                <div className="flex flex-wrap gap-3 items-center">
                  {pvProducts.length ? (
                    pvProducts.map((prod, idx) => (
                      <button
                        key={prod.id || idx}
                        onClick={() => handlePvProductSelect(prod)}
                        className={`rounded-2xl shadow-sm px-5 py-2 ${pvSelectedProduct && pvSelectedProduct.id === prod.id ? "bg-green-500 text-white" : "bg-white text-black"} flex items-center`}
                      >
                        {prod.name}
                      </button>
                    ))
                  ) : (
                    <p>No products available.</p>
                  )}
                </div>
                {pvSelectedProduct && (
                  <div className='mt-10'>
                    <h2 className='mb-3'>Properties for {pvSelectedProduct.name}</h2>
                    <div className="flex flex-wrap gap-3 items-center">
                      {pvProperties.length ? (
                        pvProperties.map((prop, idx) => (
                          <button
                            key={prop.id || idx}
                            onClick={() => handlePvPropertySelect(prop)}
                            className={`rounded-2xl shadow-sm px-5 py-2 ${pvSelectedProperty && pvSelectedProperty.id === prop.id ? "bg-green-500 text-white" : "bg-white text-black"} flex items-center`}
                          >
                            {prop.name}
                          </button>
                        ))
                      ) : (
                        <p>No properties available.</p>
                      )}
                    </div>
                    {pvSelectedProperty && (
                      <div className='mt-10'>
                        <h2 className='mb-3'>Property Values for {pvSelectedProperty.name}</h2>
                        <div className="flex flex-wrap gap-3 items-center">
                          {pvPropertyValues.length ? (
                            pvPropertyValues.map((val, idx) => (
                              <button
                                key={idx}
                                className="rounded-2xl shadow-sm px-5 py-2 bg-white text-black flex items-center"
                              >
                                <span>{val.value || val}</span>
                                {val.isNew && (
                                  <span onClick={(e) => { e.stopPropagation(); removePvValue(idx); }} className="ml-3 text-red-400 cursor-pointer">
                                    <FaMinus />
                                  </span>
                                )}
                              </button>
                            ))
                          ) : (
                            <p>No property values available.</p>
                          )}
                          <button
                            onClick={() => setShowPvInput(!showPvInput)}
                            className="rounded-full bg-blue-500 text-white p-2 shadow-sm flex items-center justify-center"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        {showPvInput && (
                          <div className="mt-3 flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter property value"
                              value={newPvValue}
                              onChange={(e) => setNewPvValue(e.target.value)}
                              className="border p-2 rounded"
                            />
                            <button onClick={addPvValue} className="bg-green-500 text-white px-4 py-2 rounded">
                              Add Value
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {pvPropertyValues.length > 0 && (
              <div className="mt-10 items-end justify-end flex">
                <button onClick={finishProcessForValue} className="bg-green-500 hover:bg-green-500/50 text-white px-16 py-2 rounded shadow mr-10">
                  Add Property Value
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddProduct;
