import axios from 'axios'

export async function generateMetadata({ params }) {
  const res = await fetch(`https://totalschoolsolutions.org/wp-json/wp/v2/course/${params.id}?_embed`, {
    next: { revalidate: 60 }, // optional for caching
  })
  const course = await res.json()

  return {
    title: course.title?.rendered || 'Course Details',
    description: course.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, '') || '',
  }
}

const CourseDetail = async ({ params }) => {
  const { id } = params

  const res = await axios.get(
    `https://totalschoolsolutions.org/wp-json/wp/v2/course/${id}?_embed`
  )
  const course = res.data

  const title = course.title?.rendered || 'Untitled'
  const content = course.content?.rendered || ''
  const featuredImage = course._embedded?.['wp:featuredmedia']?.[0]?.source_url

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: title }} />

      {featuredImage && (
        <img
          src={featuredImage}
          alt="Course Image"
          className="w-full h-auto rounded-lg mb-6 shadow"
        />
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default CourseDetail
