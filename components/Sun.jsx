import { useRef, useEffect } from 'react'
import { RigidBody } from '@react-three/rapier'
import { VideoTexture } from 'three'
import * as THREE from 'three'
import { SUN_RADIUS } from '../config/constants'
import { useCamera } from '../context/Camera'

// The path to the video inside the public folder
const sunVideoURL = '/videos/andrew-tate-secret-to-the-universe-pastel-ghost-shadows-shorts-2160-ytshorts.savetube.me.mp4'

// The URL to redirect after the video ends
const redirectURL = 'https://www.youtube.com/';  // replace with the actual URL

const Sun = () => {
    const { handleFocus } = useCamera()
    const planeRef = useRef(null)

    useEffect(() => {
        const video = document.createElement('video');
        video.src = sunVideoURL;
        video.muted = true; // Start muted
        video.playsInline = true;
        video.autoplay = true;
        video.preload = 'metadata';
    
        const updateVideoTexture = () => {
            if (planeRef.current && video.readyState >= video.HAVE_CURRENT_DATA) {
                planeRef.current.material.map.needsUpdate = true;
            }
            requestAnimationFrame(updateVideoTexture);
        };
    
        const enforcePlayback = () => {
            setInterval(() => {
                if (video.paused) {
                    video.play().catch((err) => {
                        console.error("Error resuming video playback:", err);
                    });
                }
            }, 1000); // Check every second to enforce playback
        };
    
        video.addEventListener('loadeddata', () => {
            video.play().then(() => {
                const videoTexture = new VideoTexture(video);
                videoTexture.minFilter = THREE.NearestFilter;
                videoTexture.magFilter = THREE.NearestFilter;
                if (planeRef.current) {
                    planeRef.current.material.map = videoTexture;
                    planeRef.current.material.needsUpdate = true;
                }
                updateVideoTexture();
            }).catch(err => {
                console.error('Error during video play:', err);
            });
    
            enforcePlayback(); // Keep enforcing playback
        });
    
        const unmuteVideoOnInteraction = () => {
            video.muted = false; // Unmute the video
            video.play(); // Ensure video keeps playing
            window.removeEventListener('pointermove', unmuteVideoOnInteraction);
            window.removeEventListener('touchstart', unmuteVideoOnInteraction);
        };
    
        // Listen to user interactions to unmute
        window.addEventListener('pointermove', unmuteVideoOnInteraction);
        window.addEventListener('touchstart', unmuteVideoOnInteraction);
    
        // Redirect to the new page after the video ends for the first time
        video.addEventListener('ended', () => {
            window.location.href = redirectURL;
        });
    
        video.addEventListener('error', (err) => {
            console.error('Error loading the video:', err);
        });
    
        return () => {
            window.removeEventListener('pointermove', unmuteVideoOnInteraction);
            window.removeEventListener('touchstart', unmuteVideoOnInteraction);
        };
    }, []);
    

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
