'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams, useRouter } from 'next/navigation'

const Courses = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [totalPages, setTotalPages] = useState(1)

    const searchParams = useSearchParams()
    const router = useRouter()
    const currentPage = parseInt(searchParams.get('page') || '1', 10)

    const perPage = 12

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true)
                const res = await axios.get(
                    `https://totalschoolsolutions.org/wp-json/wp/v2/course?_embed&per_page=${perPage}&page=${currentPage}`
                )

                setPosts(res.data)

                const totalPagesHeader = res.headers['x-wp-totalpages']
                if (totalPagesHeader) {
                    setTotalPages(parseInt(totalPagesHeader, 10))
                }
            } catch (err) {
                console.error(err)
                setError('Failed to load courses.')
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [currentPage])

 const goToPage = (page) => {
    router.push(`?page=${page}`)
}


    return (
        <div className="p-6">
            {loading && <p>Loading courses...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
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
