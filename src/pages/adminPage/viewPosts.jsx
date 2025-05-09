import React, { useState, useEffect } from 'react';
import { getAllPost, sendToGroup, deletePost } from '@/services/postService';
import { fetchPostById } from '@/services/userServices';
import NavStyle from '@/widgets/layout/nav_style';
import { Link } from 'react-router-dom';
import { getCategories } from '@/services/productServices';

function ViewPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('posted');
  const [filterType, setFilterType] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingToGroup, setSendingToGroup] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);


  // Define tabs
  const tabs = [
    { id: 'posted', label: 'Posted' },
    { id: 'notPosted', label: 'Not Posted' },
  ];

  const tabWidth = 150; // fixed width for tab buttons

  const handleCheckboxChange = (post) => {
    setSelectedPosts((prev) => {
      const isSelected = prev.some((p) => p.id === post.id);
      return isSelected
        ? prev.filter((p) => p.id !== post.id)
        : [...prev, post];
    });
  };

  const handleSendToGroup = async () => {
    try {
      setSendingToGroup(true);
      console.log("Posting to : ", selectedCategories.length >= 0 ?  selectedCategories.map(Number):null);
      await sendToGroup(
        selectedPosts.map((post) => post.id),
        message,
        selectedCategories.length >= 0 ?  selectedCategories.map(Number):null
      );
      
      setShowModal(false);
      setSelectedPosts([]);
      setMessage('');
      setSelectedCategories([]); // Reset selected categories
      alert('Posts sent to group successfully!');
      // Refresh posts list
      const response = await getAllPost();
      setPosts(response);
    } catch (error) {
      alert('Error sending posts to group: ' + error.message);
    } finally {
      setSendingToGroup(false);
    }
  };
  
  

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const catList = await getCategories();
        if (catList) {
          console.log(catList)
          setCategories(catList);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategoryList();
  }, []);
  
  const areAllSameType = () => {
    if (selectedPosts.length === 0) return false;
    const firstType = selectedPosts[0].type;
    return selectedPosts.every((post) => post.type === firstType);
  };

  const removeFromSelection = (postId) => {
    setSelectedPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleViewPost = async (postId) => {
    try {
      setLoadingPreview(true);
      setShowPreviewModal(true);
      const response = await fetchPostById(postId);
      console.log(response)
      setPreviewPost(response.post);
    } catch (error) {
      alert('Error loading post: ' + error.message);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        // Refresh the posts list
        const response = await getAllPost();
        setPosts(response);
        alert('Post deleted successfully!');
      } catch (error) {
        alert('Error deleting post: ' + error.message);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPost();
        setPosts(response);
        setLoading(false);
      } catch (err) {
        setError('Error fetching posts');
        setLoading(false);
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  // Filter posts based on tab and type
  const filteredPosts = posts.filter((post) => {
    const postedMatch =
      tab === 'posted' ? post.is_posted === true : post.is_posted === false;
    const typeMatch =
      filterType === 'all' || post.type.toLowerCase() === filterType;
    return postedMatch && typeMatch;
  });

  // Helper function to parse the post body content
  const parseBody = (body) => {
    if (typeof body === 'object') return body;
    try {
      let parsed = JSON.parse(body);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed); // handle double-encoded JSON
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse body content:', e);
      return { text: body };
    }
  };

  // Extract the first image's src from an HTML string
  const extractImageFromHtml = (htmlString) => {
    if (!htmlString) return null;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const imgEl = tempDiv.querySelector('img');
    return imgEl ? imgEl.getAttribute('src') : null;
  };

  const getFirstImageUrl = (blocks) => {
    if (Array.isArray(blocks)) {
      const imageBlock = blocks.find(block => block.type === 'image' && block.url);
      return imageBlock ? imageBlock.url : null;
    }
    return null;
  };
  
//   const structuredContent = parseBody(post.body); // post.body is now a JSON array string.
// const imageUrl = getFirstImageUrl(structuredContent);

const getSnippetFromBlocks = (blocks, maxLength = 120) => {
  if (!Array.isArray(blocks)) return '';
  // Combine text from all paragraph blocks
  const combinedText = blocks
    .filter(block => block.type === 'paragraph' && block.text)
    .map(block => block.text)
    .join(' ');
  return combinedText.length > maxLength
    ? combinedText.substring(0, maxLength) + '...'
    : combinedText;
};

  const currentIndex = tabs.findIndex((t) => t.id === tab);

  return (
    <div className="min-h-screen bg-gray">
      <NavStyle />
      {/* Update container width here */}
      <div className="container mx-auto max-w-7xl py-12 bg-gray px-4">
        <div className="flex justify-between items-center">
          {selectedPosts.length > 0 && tab === 'notPosted' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send to Group ({selectedPosts.length})
            </button>
          )}
        </div>

        {/* Sliding Tabs */}
        <div className="mb-6 flex justify-center">
          <div className="relative inline-flex rounded-full bg-transparent p-1">
            <span
              className="absolute top-0 left-0 h-full rounded-full bg-green-500 transition-transform duration-300 ease-in-out"
              style={{
                width: `${tabWidth}px`,
                transform: `translateX(${currentIndex * tabWidth}px)`,
              }}
            ></span>
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{ width: `${tabWidth}px` }}
                className={`relative z-10 py-2 text-center font-bold ${
                  tab === item.id ? 'text-white' : 'text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Filter Tabs */}
        <div className="mb-6 flex justify-center items-center space-x-4">
          <h2 className="text-xl font-rbold">Filter By Type :</h2>
          <button
            onClick={() => setFilterType('all')}
            className={`px-10 text-lg rounded transition-colors border-2 border-gray-700 ${
              filterType === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-transparent text-black'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('news')}
            className={`px-10 text-lg rounded transition-colors border-2 border-gray-700 ${
              filterType === 'news'
                ? 'bg-green-500 text-white'
                : 'bg-transparent text-black'
            }`}
          >
            News
          </button>
          <button
            onClick={() => setFilterType('tender')}
            className={`px-10 text-lg rounded transition-colors border-2 border-gray-700 ${
              filterType === 'tender'
                ? 'bg-green-500 text-white'
                : 'bg-transparent text-black'
            }`}
          >
            Tender
          </button>
          <button
            onClick={() => setFilterType('event')}
            className={`px-10 text-lg rounded transition-colors border-2 border-gray-700 ${
              filterType === 'event'
                ? 'bg-green-500 text-white'
                : 'bg-transparent text-black'
            }`}
          >
            Event
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading posts...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          // Horizontal card design: image on left, content on right
          <div className="grid grid-cols-1 gap-6">
  {filteredPosts.map((post) => {
    const structuredContent = parseBody(post.body);
    const imageUrl = getFirstImageUrl(structuredContent);
    const snippet = getSnippetFromBlocks(structuredContent);

    return (
      <div
        key={post.id}
        className="bg-transparent rounded-lg shadow-none border-b-2 py-3 overflow-hidden relative flex h-52"
      >
        {tab === 'notPosted' && (
          <input
            type="checkbox"
            checked={selectedPosts.some((p) => p.id === post.id)}
            onChange={() => handleCheckboxChange(post)}
            className="absolute top-2 right-2 w-4 h-4 z-10"
          />
        )}
        {/* Left Side: Image */}
        <div className="w-1/3 h-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">
              No Image
            </div>
          )}
        </div>
        {/* Right Side: Content */}
        <div className="w-2/3 p-4 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-semibold mb-2 truncate">{post.title}</h2>
            <p className="text-gray-500 text-sm mb-2">{snippet}</p>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Source: {post.source}</p>
              <p className="text-gray-600 text-sm">Type: {post.type}</p>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => handleViewPost(post.id)}
              className="px-10 py-2 bg-green-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              View
            </button>
            <Link
              to={`/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/editPost/${post.id}`}
              className="px-10 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(post.id)}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>

        )}

{/* Send to Group Modal */}
{showModal && tab === 'notPosted' && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Send Posts to Group</h2>

      {!areAllSameType() && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          Warning: Selected posts must be of the same type to send together.
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Selected Posts:</h3>
        <div className="space-y-2">
          {selectedPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <div>
                <span className="font-medium">{post.title}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({post.type})
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewPost(post.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
                </button>
                <button
                  onClick={() => removeFromSelection(post.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

              {/* List of Checkboxes for Categories */}
              {selectedPosts.length === 1 &&
  selectedPosts.every((post) => post.type.toLowerCase() === "news") && (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Categories
      </label>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => (
          <label key={cat.test_topic_id} className="inline-flex items-center">
            <input
              type="checkbox"
              value={cat.test_topic_id}
              checked={selectedCategories.includes(cat.test_topic_id.toString())}
              onChange={(e) => {
                const checked = e.target.checked;
                const value = e.target.value;
                if (checked) {
                  setSelectedCategories((prev) => [...prev, value]);
                } else {
                  setSelectedCategories((prev) =>
                    prev.filter((val) => val !== value)
                  );
                }
              }}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">{cat.name}</span>
          </label>
        ))}
      </div>
    </div>
  )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message (Optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows="4"
          placeholder="Enter message..."
        ></textarea>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSendToGroup}
          disabled={
            !areAllSameType() ||
            sendingToGroup ||
            selectedPosts.length === 0
          }
          className={`px-4 py-2 rounded text-white ${
            !areAllSameType() ||
            sendingToGroup ||
            selectedPosts.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {sendingToGroup ? 'Sending...' : 'Send to Group'}
        </button>
      </div>
    </div>
  </div>
)}



        {/* Post Preview Modal */}
        {showPreviewModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      {loadingPreview ? (
        <div className="flex items-center justify-center h-40">
          <p>Loading post...</p>
        </div>
      ) : previewPost ? (
        <>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold">{previewPost.title}</h2>
            <button
              onClick={() => {
                setShowPreviewModal(false);
                setPreviewPost(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-4 text-sm text-gray-500">
            <p>Source: {previewPost.source}</p>
            <p>
              Posted on: {new Date(previewPost.createdAt).toLocaleDateString()}
            </p>
          </div>

          {(() => {
            // Parse the body string into an array of blocks.
            const blocks = parseBody(previewPost.body);
            return (
              <div className="prose max-w-none space-y-4">
                {blocks.map((block, index) => {
                  switch (block.type) {
                    case 'paragraph':
                      return (
                        <div
                          key={index}
                          className="text-lg leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: block.text }}
                        />
                      );
                    case 'image':
                      return (
                        <div key={index} className="mb-6">
                          <img
                            src={block.url}
                            alt={block.alt || 'Image'}
                            className="w-full h-auto rounded-lg shadow-lg"
                          />
                        </div>
                      );
                    case 'link':
                      return (
                        <div key={index} className="text-blue-600 underline">
                          <a href={block.url} target="_blank" rel="noopener noreferrer">
                            {block.url}
                          </a>
                        </div>
                      );
                    case 'quote':
                      return (
                        <blockquote
                          key={index}
                          className="border-l-4 pl-4 italic text-gray-700"
                        >
                          {block.text}
                          {block.author && (
                            <cite className="block mt-1 text-right text-sm">
                              — {block.author}
                            </cite>
                          )}
                        </blockquote>
                      );
                      case 'subTopic':
                        return (
                          <h3 key={index} className="text-xl font-bold mt-6">
                            {block.text}
                          </h3>
                        );
                    default:
                      return null;
                  }
                })}
              </div>
            );
          })()}
        </>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-red-500">Error loading post</p>
        </div>
      )}
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default ViewPosts;
