'use client'

import { JSX, useEffect } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { scan } from 'react-scan'

export default function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: true,
    })
  }, [])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}
