'use client';
import style from './tab.module.css';
import { useState } from 'react';
import { useTabState } from '@/store/tab';

export default function Tab() {
    const tab = useTabState((state) => state.mode); // 상태 읽기
    const setRec = useTabState((state) => state.setRec); // 상태 변경 함수 읽기
    const setFol = useTabState((state) => state.setFol); // 상태 변경 함수 읽기

    const onClickRec = () => {
        setRec(); // 상태 변경 함수 호출
    };

    const onClickFol = () => {
        setFol(); // 상태 변경 함수 호출
    };

    return (
        <div className={style.homeFixed}>
            <div className={style.homeText}>홈</div>
            <div className={style.homeTab}>
                <div onClick={onClickRec}>
                    추천
                    <div className={style.tabIndicator} hidden={tab === 'fol'}></div>
                </div>
                <div onClick={onClickFol}>
                    팔로우 중<div className={style.tabIndicator} hidden={tab === 'rec'}></div>
                </div>
            </div>
        </div>
    );
}
