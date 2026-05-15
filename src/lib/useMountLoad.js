import { useEffect } from 'react'

export function useMountLoad(load) {
  useEffect(() => {
    queueMicrotask(() => {
      void load()
    })
  }, [load])
}
