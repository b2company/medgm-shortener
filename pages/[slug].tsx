import { GetServerSideProps } from 'next'
import { getOriginalUrl } from '@/lib/kv'

export default function RedirectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Redirecionando...</h1>
        <p className="mt-2 text-gray-600">Você será redirecionado em instantes.</p>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string

  if (!slug) {
    return {
      notFound: true
    }
  }

  try {
    const url = await getOriginalUrl(slug)

    if (!url) {
      return {
        notFound: true
      }
    }

    return {
      redirect: {
        destination: url,
        statusCode: 302
      }
    }
  } catch (error) {
    console.error('Error fetching URL:', error)
    return {
      notFound: true
    }
  }
}
