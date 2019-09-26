/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'

const useAsyncEffect = (effect, inputs = [], destroy) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    let result

    // eslint-disable-next-line no-return-assign
    effect().then(value => (result = value))

    if (destroy) {
      return () => destroy(result)
    }
  }, inputs)
}

export default useAsyncEffect
