import { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

function Girl(props) {
  const { scene, animations } = useGLTF("/models/retaj.glb");
  const { actions, names } = useAnimations(animations, scene);

  useEffect(() => {
    // tells you in the browser console if the file has an animation
    console.log("Animations in file:", names);

    // she casts and catches shadows
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    // play the first animation, if there is one
    if (names.length) actions[names[0]]?.reset().fadeIn(0.3).play();
  }, [scene, actions, names]);

  return <primitive object={scene} {...props} />;
}

useGLTF.preload("/models/retaj.glb");

export default Girl;