import React from 'react'

export default function Vimeo({idVideo,width,height}) {
    return (
        <div>
            <iframe class="iframe-responsivo" src={`https://player.vimeo.com/video/${idVideo}`} width="600" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen=""></iframe>
        </div>
    )
}
