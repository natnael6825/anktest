// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import {  viewCount,  } from '@/services/adminService'; // Adjust import path if necessary
// import NavStyle from '@/widgets/layout/nav_style';
// import TelegramNavbar from '@/widgets/layout/telegramNavbar';
// import { fetchPostById } from '@/services/userServices';
// import {
//   Eye
// } from "lucide-react";

// function ViewPostUser() {
//   const [searchParams] = useSearchParams();
//   const [id, setId] = useState(null);
//   const [post, setPost] = useState(null);
//   const [postType, setPostType] = useState('');
//   const [views, setViews] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Helper function to parse the post body content
//   const parseBody = (body) => {
//     if (typeof body === 'object') return body;
//     try {
//       let parsed = JSON.parse(body);
//       if (typeof parsed === 'string') {
//         parsed = JSON.parse(parsed); // handle double-encoded JSON
//       }
//       return parsed;
//     } catch (e) {
//       console.error('Failed to parse body content:', e);
//       return [];
//     }
//   };

//   // Get the post id from the search params.
//   useEffect(() => {
//     const param = searchParams.get('tgWebAppStartParam');
//     if (param) setId(param);
//   }, [searchParams]);

//   // Fetch post by id.
//   useEffect(() => {
//     const fetchPost = async () => {
//       if (!id) return;
//       setLoading(true);
//       try {
//         const response = await fetchPostById(id);
//         if (response.post) {
//           console.log(response);
//           setPostType(response.post.type)
//           setPost(response.post);
//         } else {
//           setError('Post not found');
//         }
//       } catch (err) {
//         console.error(err);
//         setError('Error fetching post');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPost();
//   }, [id]);

//   // Update view count after post is loaded.
//   useEffect(() => {
//     if (post && post.id) {
//       viewCount(post.id)
//         .then((data) => {
//           if (data && data.view_count !== undefined) {
//             setViews(data.view_count);
//           }
//         })
//         .catch((err) => console.error("Error updating view count: ", err));
//     }
//   }, [post]);

//   // Helper function to render our content blocks.
//   const renderBlock = (block, index) => {
//     switch (block.type) {
//       case 'paragraph':
//         return (
//           <div
//             key={index}
//             className="my-6 prose leading-relaxed"
//             dangerouslySetInnerHTML={{ __html: block.text }}
//           />
//         );
//       case 'image':
//         return (
//           <figure key={index} className="my-10">
//             <img
//               src={block.url}
//               alt={block.alt || 'Post image'}
//               className="w-full h-auto rounded-lg shadow-lg"
//             />
//             {block.caption && (
//               <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                 {block.caption}
//               </figcaption>
//             )}
//           </figure>
//         );
//       case 'link':
//         return (
//           <div key={index} className="my-6 text-lg">
//             <a
//               href={block.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 dark:text-blue-500 hover:underline"
//             >
//               {block.url}
//             </a>
//           </div>
//         );
//       case 'quote':
//         return (
//           <div className='my-3'>
//           <blockquote
//             key={index}
//             className="my-8 border-l-4 pl-4 italic text-black dark:text-black"
//           >
//             {block.text}
//             {block.author && (
//               <cite className="block mt-1 text-sm">— {block.author}</cite>
//             )}
//           </blockquote></div>
//         );
//       case 'subTopic':
//         return (
//           <h3 key={index} className="text-2xl font-bold mt-6">
//             {block.text}
//           </h3>
//         );
//         case "table":
//           return (
//             <div
//               key={index}
//               className="prose max-w-none my-6 overflow-x-auto"
//               dangerouslySetInnerHTML={{
//                 __html: block.html,
//               }}
//             />
//           );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <TelegramNavbar />
//       <div className="min-h-screen bg-gray-100 dark:bg-gray-900 antialiased">
//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <p className="text-center text-xl">Loading {postType}...</p>
//           </div>
//         ) : error ? (
//           <div className="flex items-center justify-center py-12">
//             <p className="text-center text-red-500 text-xl">{error}</p>
//           </div>
//         ) : post ? (
//           <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
//             <div className="px-4 mx-auto max-w-screen-xl">
//               <article className="mx-auto w-full max-w-4xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
//                 {/* Poster Info Header */}
//                 <header className="mb-1 lg:mb-6 not-format">
//   <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
//     {post.title}
//   </h1>
//   <address className="not-italic mb-4">
//     <div className="flex items-center justify-between">
//       <p className="text-base font-rlight text-gray-500 dark:text-gray-400">
//         Source: {post.source}
//       </p>
//       <p className="text-base text-gray-500 dark:text-gray-400 flex items-center">
//       <Eye size={16} className="mr-1" />
//         <span>: {views}</span>

//       </p>
//     </div>
//     <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
//       <time
//         dateTime={post.createdAt}
//         title={new Date(post.createdAt).toLocaleDateString()}
//       >
//         {new Date(post.createdAt).toLocaleDateString()}
//       </time>
//     </p>
//   </address>
// </header>

//                 {/* Content Section */}
//                 <section className="space-y-8 font-rthin text-lg text-gray-600">
//                   {(() => {
//                     const blocks = parseBody(post.body);
//                     return blocks.map((block, index) => renderBlock(block, index));
//                   })()}
//                 </section>
//               </article>
//             </div>
//           </main>
//         ) : (
//           <div className="flex items-center justify-center py-12">
//             <p className="text-center text-xl">Post not found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ViewPostUser;


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {  viewCount,  } from '@/services/adminService'; // Adjust import path if necessary
import NavStyle from '@/widgets/layout/nav_style';
import TelegramNavbar from '@/widgets/layout/telegramNavbar';
import { fetchPostById } from '@/services/userServices';
import {
  Eye
} from "lucide-react";
import parse, { domToReact } from "html-react-parser";

function ViewPostUser() {
  const [searchParams] = useSearchParams();
  const [id, setId] = useState(null);
  const [post, setPost] = useState(null);
  const [postType, setPostType] = useState('');
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      return [];
    }
  };

  // Get the post id from the search params.
  useEffect(() => {
    const param = searchParams.get('tgWebAppStartParam');
    if (param) setId(param);
  }, [searchParams]);

  // Fetch post by id.
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetchPostById(id);
        if (response.post) {
          console.log(response);
          setPostType(response.post.type)
          setPost(response.post);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Update view count after post is loaded.
  useEffect(() => {
    if (post && post.id) {
      viewCount(post.id)
        .then((data) => {
          if (data && data.view_count !== undefined) {
            setViews(data.view_count);
          }
        })
        .catch((err) => console.error("Error updating view count: ", err));
    }
  }, [post]);

  // Helper function to render our content blocks.
  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'paragraph':
  return (
    <div key={index} className="mb-6 text-gray-700 dark:text-gray-300 text-justify leading-relaxed text-base">
      {
        parse(block.text, {
          replace: (domNode) => {
            if (domNode.type === "tag") {
              const tagName = domNode.name;

              const tagStyles = {
                h1: "text-4xl font-extrabold my-4",
                h2: "text-3xl font-bold my-4",
                h3: "text-2xl font-semibold my-3",
                h4: "text-xl font-semibold my-3",
                h5: "text-lg font-medium my-2",
                h6: "text-base font-medium my-1",
                ul: "list-disc list-inside pl-4 my-2 space-y-1",
                ol: "list-decimal list-inside pl-4 my-2 space-y-1",
              };

              if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
                return (
                  <div className={tagStyles[tagName]}>
                    {domToReact(domNode.children)}
                  </div>
                );
              }

              if (["ul", "ol"].includes(tagName)) {
                return React.createElement(
                  tagName,
                  { className: tagStyles[tagName] },
                  domNode.children.map((child, i) => (
                    <li key={i}>{domToReact(child.children)}</li>
                  ))
                );
              }
            }
          },
        })
      }
    </div>
  );

      case 'image':
        return (
          <figure key={index} className="my-10">
            <img
              src={block.url}
              alt={block.alt || 'Post image'}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {block.caption && (
              <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
        case 'link':
          return (
            <div key={index} className="my-6 text-lg px-2">
              <a
                href={typeof block.url === 'string' ? block.url : block.url?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
              >
                {typeof block.url === 'string' ? block.url : block.url?.displayText || 'Link'}
              </a>
            </div>
          );
        
      case 'quote':
        return (
          <blockquote
            key={index}
            className="my-8 border-l-4 border-gray-300 pl-4 italic text-gray-800 dark:text-gray-200 text-justify"
          >
            {block.text}
            {block.author && (
              <cite className="block mt-1 text-sm text-right text-gray-500">
                — {block.author}
              </cite>
            )}
          </blockquote>
        );
      case 'subTopic':
        return (
          <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-gray-800 dark:text-white">
            {block.text}
          </h3>
        );
      case 'table':
        return (
          <div
            key={index}
            className="prose max-w-none my-6 overflow-x-auto"
            dangerouslySetInnerHTML={{
              __html: block.html,
            }}
          />
        );
      case 'h1':
        return (
          <h1 key={index} className="text-4xl font-extrabold my-6 text-gray-900 dark:text-white">
            {block.text}
          </h1>
        );
      case 'h2':
        return (
          <h2 key={index} className="text-3xl font-bold my-5 text-gray-900 dark:text-white">
            {block.text}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={index} className="text-2xl font-semibold my-4 text-gray-900 dark:text-white">
            {block.text}
          </h3>
        );
      case 'h4':
        return (
          <h4 key={index} className="text-xl font-semibold my-4 text-gray-900 dark:text-white">
            {block.text}
          </h4>
        );
      case 'h5':
        return (
          <h5 key={index} className="text-lg font-medium my-3 text-gray-900 dark:text-white">
            {block.text}
          </h5>
        );
      case 'h6':
        return (
          <h6 key={index} className="text-base font-medium my-2 text-gray-900 dark:text-white">
            {block.text}
          </h6>
        );
      case 'ul':
        return (
          <ul key={index} className="list-disc list-inside my-4 space-y-1 text-gray-700 dark:text-gray-300">
            {block.items.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
      case 'ol':
        return (
          <ol key={index} className="list-decimal list-inside my-4 space-y-1 text-gray-700 dark:text-gray-300">
            {block.items.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>
        );
      default:
        return null;
    }
  };
  

  return (
    <div>
      <TelegramNavbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 antialiased">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-center text-xl">Loading {postType}...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-center text-red-500 text-xl">{error}</p>
          </div>
        ) : post ? (
          <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
            <div className="px-4 mx-auto max-w-screen-xl">
              <article className="mx-auto w-full max-w-4xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                {/* Poster Info Header */}
                <header className="mb-1 lg:mb-6 not-format">
  <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
    {post.title}
  </h1>
  <address className="not-italic mb-4">
    <div className="flex items-center justify-between gap-2">
      <p className="text-base font-rlight text-gray-500 dark:text-gray-400">
        Source: {post.source}
      </p>
    </div>
    <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
      <span className='flex gap-3'><time
        dateTime={post.createdAt}
        title={new Date(post.createdAt).toLocaleDateString()}
      >
        {new Date(post.createdAt).toLocaleDateString()}
                          </time>
                          <p className="text-base text-gray-500 dark:text-gray-400 flex items-center">
      <Eye size={16} className="mr-1" />
        <span> {views}</span>

      </p></span>
    </p>
  </address>
</header>

                {/* Content Section */}
                <section className="space-y-8 font-rthin text-lg text-gray-600">
                  {(() => {
                    const blocks = parseBody(post.body);
                    return blocks.map((block, index) => renderBlock(block, index));
                  })()}
                </section>
              </article>
            </div>
          </main>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-center text-xl">Post not found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPostUser;
