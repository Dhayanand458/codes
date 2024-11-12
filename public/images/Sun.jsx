import { useRef, useEffect } from 'react'
import { RigidBody } from '@react-three/rapier'
import { VideoTexture } from 'three'
import * as THREE from 'three'
import { SUN_RADIUS } from '../../config/constants'
import { useCamera } from '../../context/Camera'

// The path to the video inside the public folder
const sunVideoURL = '/videos/andrew-tate-secret-to-the-universe-pastel-ghost-shadows-shorts-2160-ytshorts.savetube.me.mp4'

// The URL to redirect after the video ends
const redirectURL = 'https://www.youtube.com/';  // replace with the actual URL

const Sun = () => {
    const { handleFocus } = useCamera()
    const planeRef = useRef(null)

    useEffect(() => {
        const video = document.createElement('video')
        video.src = sunVideoURL
        video.muted = true // Video must be muted to autoplay
        video.playsInline = true
        video.autoplay = true

        // Attempt to play the video when it's ready
        video.addEventListener('loadeddata', () => {
            console.log("Video loaded, attempting to play...")
            video.play().then(() => {
                console.log("Video is playing")
                // Create a texture from the video and assign it to the plane
                const videoTexture = new VideoTexture(video)
                videoTexture.minFilter = THREE.LinearFilter
                videoTexture.magFilter = THREE.LinearFilter

                if (planeRef.current) {
                    console.log('Applying video texture to plane')
                    planeRef.current.material.map = videoTexture
                    planeRef.current.material.needsUpdate = true
                }
            }).catch(err => {
                console.error('Error during video play:', err)
            })
        })

        // Redirect to a new page after the video ends for the first time
        video.addEventListener('ended', () => {
            console.log("Video ended, redirecting to a new page...")
            window.location.href = redirectURL;  // Redirect to the new page
        })

        // Error handling for loading the video
        video.addEventListener('error', (err) => {
            console.error('Error loading the video:', err)
        })
    }, [])

    return (
        <RigidBody
            colliders='ball'
            userData={{ type: 'Sun' }}
            type='kinematicPosition'
            onClick={handleFocus}
        >
            <mesh ref={planeRef}>
                {/* Create a plane for the Sun with double-sided rendering */}
                <planeGeometry args={[SUN_RADIUS * 2 * (9 / 16), SUN_RADIUS * 2]} /> {/* Adjust the size based on SUN_RADIUS */}
                <meshBasicMaterial transparent={true} side={THREE.DoubleSide} />
            </mesh>

            {/* Optionally keep the point light */}
            <pointLight position={[0, 0, 0]} intensity={50000} color={'rgb(255, 207, 55)'} />
        </RigidBody>
    )
}

export default Sun
