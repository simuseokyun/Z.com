'use client'

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query'
import { ChangeEventHandler, useRef, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import TextAreaAutoSize from 'react-textarea-autosize'
import Link from 'next/link'
import Image from 'next/image'
import useModalState from '@/store/modal'
import { Post } from '@/model/Post'

import style from './modal.module.css'

export default function TweetModal() {
  const { data: modal, mode, reset } = useModalState()

  const queryClient = useQueryClient()
  const [content, setContent] = useState<string>('')
  const [preview, setPreview] = useState<
    Array<{ dataUrl: string; file: File } | null>
  >([])
  const { data: me } = useSession()
  const router = useRouter()
  const imageRef = useRef<HTMLInputElement>(null)
  const mutation = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault()
      const formData = new FormData()
      formData.append('content', content)
      preview.forEach((p) => {
        if (p) {
          formData.append('images', p.file)
        }
      })
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        method: 'post',
        credentials: 'include',
        body: formData,
      })
    },
    async onSuccess(res) {
      const newPost = await res.json()

      const queryCache = queryClient.getQueryCache()
      const queryKeys = queryCache.getAll().map((v) => v.queryKey)
      // getAll()메서드를 통해 queryCache를 배열로 만들어줌
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === 'posts') {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(queryKey)

          if (value && 'pages' in value) {
            const shallow = {
              ...value,
              pages: [...value.pages],
            }
            shallow.pages[0] = [...shallow.pages[0]]
            shallow.pages[0].unshift(newPost) // 새 게시글 추가
            queryClient.setQueryData(queryKey, shallow)
          }
        }
      })
    },
    onError(error) {
      console.error(error)
    },
    onSettled() {
      router.back()
    },
  })

  const onClickButton = () => {
    imageRef.current?.click()
  }
  const onClickClose = () => {
    router.back()
    reset()
  }
  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()

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
  const onChangeContent: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault()
    setContent(e.target.value)
  }
  const onRemoveImage = (index: number) => {
    setPreview((prevPreview) => {
      const shallow = [...prevPreview]
      shallow[index] = null
      return shallow
    })
  }
  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        <button
          type="button"
          className={style.closeButton}
          onClick={onClickClose}
          aria-label="button"
        >
          <svg
            width={24}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
          >
            <g>
              <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" />
            </g>
          </svg>
        </button>
        <form className={style.modalForm} onSubmit={mutation.mutate}>
          {mode === '댓글' && modal && (
            <div className={style.modalOriginal}>
              <div className={style.postUserSection}>
                <div className={style.postUserImage}>
                  <Image
                    src={modal.User.image}
                    alt={modal.User.id}
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              <div>
                {modal.content}
                <div>
                  <Link
                    href={`/${modal.User.id}`}
                    style={{ color: 'rgb(29, 155, 240)' }}
                  >
                    @{modal.User.id}
                  </Link>
                  {modal.User.id}
                  님에게 보내는 답글
                </div>
              </div>
            </div>
          )}
          <div className={style.modalBody}>
            <div className={style.postUserSection}>
              <div className={style.postUserImage}>
                <img src={me?.user?.image as string} alt={me?.user?.id} />
              </div>
            </div>
            <div className={style.inputDiv}>
              <TextAreaAutoSize
                className={style.input}
                placeholder="무슨 일이 일어나고 있나요?"
                value={content}
                onChange={onChangeContent}
              />
              <div style={{ display: 'flex', marginTop: '10px' }}>
                {preview.map(
                  (v, index) =>
                    v && (
                      <div
                        key={v.dataUrl}
                        style={{ flex: 1 }}
                        onClick={() => onRemoveImage(index)}
                      >
                        <Image
                          src={v.dataUrl}
                          alt="미리보기"
                          width={40}
                          height={40}
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
            </div>
          </div>
          <div className={style.modalFooter}>
            <div className={style.modalDivider} />
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
                  aria-label="button"
                >
                  <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                    </g>
                  </svg>
                </button>
              </div>
              <button
                type="button"
                className={style.actionButton}
                disabled={!content}
              >
                게시하기
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
