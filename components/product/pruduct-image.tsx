import React from 'react'
import { useProductImages } from '@lib/hooks'

type Props = { pid: number }

function ProductImage({ pid }: Props) {
    const { images, isLoading } = useProductImages(pid)





    if (isLoading) {
        return "loading..."
    }

    if (images?.url_thumbnail)
        return (<img src={images.url_thumbnail} alt="img" style={{ width: "2.5rem", height: "2.5rem" }} />)

}

export default ProductImage