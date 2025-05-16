'use client'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useSearchParams, useRouter } from 'next/navigation'
import { decode } from 'html-entities';

const LoadingCard = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300" />
    <div className="p-4">
      <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded mt-1 w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded mt-1 w-2/3"></div>
    </div>
  </div>
)

const Courses = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)

  const cacheRef = useRef({}) 

  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const perPage = 12

const fetchPage = async (page) => {
  const res = await axios.get(
    `https://totalschoolsolutions.org/wp-json/wp/v2/course?_embed&per_page=${perPage}&page=${page}`
  );

  const decodedData = res.data.map((item) => ({
    ...item,
    title: {
      ...item.title,
      rendered: decode(item.title.rendered),
    },
  }));

  return {
    data: decodedData,
    totalPages: parseInt(res.headers['x-wp-totalpages'], 10),
  };
};


  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        let pageData

        if (cacheRef.current[currentPage]) {
          pageData = { data: cacheRef.current[currentPage] }
        } else {
          pageData = await fetchPage(currentPage)
          cacheRef.current[currentPage] = pageData.data
        }

        setPosts(pageData.data)

        if (pageData.totalPages) {
          setTotalPages(pageData.totalPages)
        }

        const nextPage = currentPage + 1
        if (
          nextPage <= pageData.totalPages &&
          !cacheRef.current[nextPage]
        ) {
          fetchPage(nextPage).then((res) => {
            cacheRef.current[nextPage] = res.data
          })
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load courses.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentPage])

  const goToPage = (page) => {
    router.push(`?page=${page}`)
  }

  return (
    <div className="p-6">
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: perPage }).map((_, i) => <LoadingCard key={i} />)
          : posts.map((post) => {
              const title = post.title?.rendered || 'Untitled'
              const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
              const description = post.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, '') || ''

              return (
                <a
                  href={`/courses/${post.id}`}
                  key={post.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105"
                >
                  <img
                    src={image || 'https://via.placeholder.com/600x400?text=No+Image'}
                    alt={title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">{title}</h2>
                    <p className="text-gray-600 line-clamp-3">{description}</p>
                  </div>
                </a>
              )
            })}
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`px-4 py-2 rounded cursor-pointer ${
              currentPage === i + 1 ? 'bg-red-500 text-white' : 'bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Courses
