"use client";

import style from "./signup.module.css";
import onSubmit from "../_lib/signup";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import CloseButton from "@/app/(afterLogin)/_component/CloseButton";

function showMessage(message: string | null | undefined) {
  if (message === "no_id") {
    return "아이디를 입력하세요.";
  }
  if (message === "no_name") {
    return "닉네임을 입력하세요.";
  }
  if (message === "no_password") {
    return "비밀번호를 입력하세요.";
  }
  if (message === "no_image") {
    return "이미지를 업로드하세요.";
  }
  if (message === "user_exists") {
    return "이미 사용 중인 아이디입니다.";
  }
  if (message === "nickname must be a string") {
    return "닉네임이 필요합니다.";
  }
  return message;
}

export default function SignupModal() {
  const [state, formAction] = useActionState(onSubmit, { message: null });
  const { pending } = useFormStatus();

  return (
    <>
      <div className={style.modalBackground}>
        <div className={style.modal}>
          <div className={style.modalHeader}>
            <CloseButton />
            <div>계정을 생성하세요.</div>
          </div>
          <form action={formAction}>
            <div className={style.modalBody}>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="id">
                  {/* html은 for을 사용하지만 react에선 htmlFor 사용 */}
                  아이디
                </label>
                <input
                  id="id"
                  name="id" // input의 name값은 formData의 key값으로 들어감
                  className={style.input}
                  type="text"
                  placeholder="아이디를 입력하세요"
                  required
                  defaultValue={state.id as string}
                />
              </div>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="name">
                  닉네임
                </label>
                <input
                  id="name"
                  name="name"
                  className={style.input}
                  type="text"
                  placeholder="이름을 입력하세요"
                  required
                  defaultValue={state.nickname as string}
                />
              </div>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="password">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  className={style.input}
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  required
                  defaultValue={state.password as string}
                />
              </div>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="image">
                  프로필
                </label>
                <input
                  id="image"
                  name="image"
                  required
                  className={style.input}
                  type="file"
                  accept="image/*"
                  defaultValue={state.image as string}
                />
              </div>
            </div>
            <div className={style.modalFooter}>
              <button
                type="submit"
                className={style.actionButton}
                disabled={pending}>
                가입하기
              </button>
              <div className={style.error}>{showMessage(state?.message)}</div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
