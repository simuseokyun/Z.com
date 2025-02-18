interface Props {
  pageParam?: number
  queryKey: string[]
}

const getComments = async ({ pageParam, queryKey }: Props) => {
  const [, id] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments?cursor=${pageParam}`,
    {
      next: {
        tags: ['posts', id, 'comments'],
      },
      cache: 'no-store',
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getComments
