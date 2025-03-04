'use client'

import { useSession } from 'next-auth/react'
import { ChangeEventHandler, FormEvent, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import style from './commentForm.module.css'

export default function CommentForm({ id }: { id: string }) {
  const [content, setContent] = useState<string>('')
  const [preview, setPreview] = useState<
    Array<{ dataUrl: string; file: File } | null>
  >([]) // 이미지에 대한 타입
  const imageRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const onClickButton = () => {
    imageRef.current?.click()
  }
  const { data: me } = useSession()

  const submit = useMutation({
    mutationFn: (e: FormEvent) => {
      e.preventDefault() // 폼 전송 막기
      const formData = new FormData()
      formData.append('content', content)
      preview.forEach((image) => {
        if (image) {
          formData.append('images', image.file)
        }
      })
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments`,
        {
          method: 'post',
          credentials: 'include',
          body: formData,
        },
      )
    },
    async onSuccess(response) {
      const newPost = await response.json()
      setContent('')
      setPreview([])
      queryClient.setQueryData(
        ['posts', id, 'comments'],
        (prev: { pages: Comment[][] }) => {
          const shallow = { ...prev, pages: [...prev.pages] }
          shallow.pages[0] = [newPost, ...shallow.pages[0]]

          return shallow
        },
      )
    },
    onError(error: string) {
      console.log(error)
    },
  })

  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    // files는 객체(배열)처럼 보이지만 유사배열이라 배열 메서드를 사용할 수 없음. 따라서 Array.from 을 통해 배열로 변경
    if (e.target.files) {
      Array.from(e.target.files).forEach((file, index) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview((prevPreview) => {
            const prev = [...prevPreview]
            prev[index] = {
              dataUrl: reader.result as string,
              file,
            }
            return prev
          })
        }
        reader.readAsDataURL(file)
      })
    }
  }
  const onRemoveImage = (index: number) => {
    setPreview((prevPreview) => {
      const prev = [...prevPreview]
      prev[index] = null
      return prev
    })
  }
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value)
  }
  return (
    <form className={style.postForm} onSubmit={submit.mutate}>
      <div className={style.postUserSection}>
        <div className={style.postUserImage}>
          <img
            src={me?.user?.image as string}
            alt={me?.user?.email as string}
          />
        </div>
      </div>
      <div className={style.postInputSection}>
        <TextareaAutosize
          value={content}
          onChange={onChange}
          placeholder="답글 게시하기"
        />
        <div style={{ display: 'flex' }}>
          {preview.map(
            (v, index) =>
              v && (
                <div
                  key={v.dataUrl}
                  style={{ flex: 1 }}
                  onClick={() => onRemoveImage(index)}
                >
                  <img
                    src={v.dataUrl}
                    alt="미리보기"
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      maxHeight: 100,
                    }}
                  />
                </div>
              ),
          )}
        </div>

        <div className={style.postButtonSection}>
          <div className={style.footerButtons}>
            <div className={style.footerButtonLeft}>
              <input
                type="file"
                name="imageFiles"
                multiple
                hidden
                ref={imageRef}
                onChange={onUpload}
              />
              <button
                className={style.uploadButton}
                type="button"
                onClick={onClickButton}
              >
                <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                  </g>
                </svg>
              </button>
            </div>
            <button
              type="submit"
              className={style.actionButton}
              disabled={!content}
            >
              답글
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
