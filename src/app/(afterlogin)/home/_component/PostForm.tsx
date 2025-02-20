'use client'

import { ChangeEventHandler, FormEvent, useRef, useState } from 'react'
import { Session } from 'next-auth'
import TextareaAutosize from 'react-textarea-autosize'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Post } from '@/model/Post'

import style from './postForm.module.css'

type Props = {
  me: Session | null
}
export default function PostForm({ me }: Props) {
  const imageRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<
    Array<{ dataUrl: string; file: File } | null>
  >([])

  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

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
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        method: 'post',
        credentials: 'include',
        body: formData,
      })
    },
    async onSuccess(response) {
      const newPost = await response.json()
      setContent('')
      setPreview([])
      const recommendPosts = queryClient.getQueryData(['posts', 'recommends'])

      if (recommendPosts) {
        queryClient.setQueryData(
          ['posts', 'recommends'],
          // React Query는 기본적으로 pageParam을 직접 다루지 않고, pages 배열의 요소만 수정하게 됩니다 => prevData에 pageParam의 타입을 정의하지 않아도 되는 이유
          (prevData: { pages: Array<Post[]> }) => {
            const shallow = {
              ...prevData,
              pages: [...prevData.pages],
            }
            shallow.pages[0] = [...shallow.pages[0]]
            shallow.pages[0].unshift(newPost)
            return shallow
          },
        )
      }
      const followingPosts = queryClient.getQueryData(['posts', 'followings'])
      if (followingPosts) {
        queryClient.setQueryData(
          ['posts', 'followings'],
          (prevData: { pages: Array<Post[]> }) => {
            const shallow = {
              ...prevData,
              pages: [...prevData.pages],
            }
            shallow.pages[0] = [...shallow.pages[0]]
            shallow.pages[0].unshift(newPost)
            return shallow
          },
        )
      }
    },
    onError(error) {
      console.error(error)
    },
  })

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value)
  }

  const onClickButton = () => {
    imageRef.current?.click()
  }

  const onRemoveImage = (index: number) => () => {
    setPreview((prevPreview) => {
      const prev = [...prevPreview]
      const newPreview = prev.filter((image, i) => i !== index)
      return newPreview
    })
  }

  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()

    if (e.target.files) {
      // e.target.files는 fileList 인데 유사배열형태라 배열로 변환해줘야 함
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
          placeholder="무슨 일이 일어나고 있나요?"
        />
        <div style={{ display: 'flex' }}>
          {preview.map(
            (v, index) =>
              v && (
                <div
                  key={v.dataUrl}
                  style={{ flex: 1 }}
                  onClick={onRemoveImage(index)}
                >
                  <img
                    className={style.previewImg}
                    src={v.dataUrl}
                    alt="미리보기"
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
                // multiple은 여러파일 선택가능
                hidden
                ref={(node) => {
                  imageRef.current = node
                }}
                onChange={onUpload}
              />
              <button
                className={style.uploadButton}
                type="button"
                onClick={onClickButton}
              >
                <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    a
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
              게시하기
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
