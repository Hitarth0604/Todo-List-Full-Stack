import React from 'react'
import styles from './Skeleton.module.css'

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={`${styles.block} ${styles.badge}`} />
      </div>
      <div className={`${styles.block} ${styles.titleLine}`} />
      <div className={`${styles.block} ${styles.descLine}`} />
      <div className={`${styles.block} ${styles.descLineShort}`} />
      <div className={`${styles.block} ${styles.dateLine}`} />
    </div>
  )
}

export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
