import * as THREE from "three";
import notionTexture from "~/assets/images/image.webp";

export const CARD_W = 3.024;
export const CARD_H = 1.8462;
export const CARD_D = 0.1125 / 2;
export const CARD_BEVEL_T = 0.012;
export const CARD_ROT = { x: -0.24, y: -0.38, z: 0.0 };

export const TWO_PI = Math.PI * 2;

export function nearestEquivalentAngle(
  current: number,
  target: number,
): number {
  return target - Math.round((target - current) / TWO_PI) * TWO_PI;
}

export interface WorksCardScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  cardMesh: THREE.Mesh;
  render: () => void;
  resize: () => void;
  dispose: () => void;
}

export function createWorksCardScene(
  canvas: HTMLCanvasElement,
): WorksCardScene {
  const W = canvas.clientWidth || 600;
  const H = canvas.clientHeight || 500;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
  camera.position.z = 5.7;

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));

  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(3, 3, 5);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xe8eeff, 0.4);
  fill.position.set(-4, 0, 2);
  scene.add(fill);

  // Rounded rect shape
  const r = 0.14;
  const hw = CARD_W / 2;
  const hh = CARD_H / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.absarc(hw - r, -hh + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(hw, hh - r);
  shape.absarc(hw - r, hh - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-hw + r, hh);
  shape.absarc(-hw + r, hh - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-hw, -hh + r);
  shape.absarc(-hw + r, -hh + r, r, Math.PI, Math.PI * 1.5, false);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: CARD_D,
    bevelEnabled: true,
    bevelThickness: CARD_BEVEL_T,
    bevelSize: 0.008,
    bevelSegments: 3,
  });
  geo.translate(0, 0, -CARD_D / 2);

  const frontMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.45,
    metalness: 0.0,
  });
  const sideMat = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    roughness: 0.6,
    metalness: 0.0,
  });

  const cardMesh = new THREE.Mesh(geo, [frontMat, sideMat]);
  cardMesh.rotation.set(CARD_ROT.x, CARD_ROT.y, CARD_ROT.z);
  cardMesh.visible = false;
  scene.add(cardMesh);

  // Front image texture
  const tex = new THREE.TextureLoader().load(notionTexture, () => {
    renderer.render(scene, camera);
  });
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const imageGeo = new THREE.ShapeGeometry(shape);
  const pos = imageGeo.attributes.position as THREE.BufferAttribute;
  const uvs: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uvs.push((x + hw) / CARD_W, (y + hh) / CARD_H);
  }
  imageGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

  const imagePlane = new THREE.Mesh(
    imageGeo,
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: false,
      side: THREE.FrontSide,
    }),
  );
  imagePlane.position.z = CARD_D / 2 + CARD_BEVEL_T + 0.003;
  cardMesh.add(imagePlane);

  // Back canvas text
  const backCanvas = document.createElement("canvas");
  const backTexW = 1024;
  const backTexH = Math.round(1024 * (CARD_H / CARD_W));
  backCanvas.width = backTexW;
  backCanvas.height = backTexH;
  const bctx = backCanvas.getContext("2d");
  if (bctx) {
    bctx.fillStyle = "#ffffff";
    bctx.fillRect(0, 0, backTexW, backTexH);
    bctx.fillStyle = "#111111";
    bctx.font = `500 ${Math.round(backTexH * 0.42)}px Georgia, "Times New Roman", serif`;
    bctx.textAlign = "center";
    bctx.textBaseline = "middle";
    bctx.fillText("Notion", backTexW / 2, backTexH / 2 + backTexH * 0.02);
  }
  const backTex = new THREE.CanvasTexture(backCanvas);
  backTex.colorSpace = THREE.SRGBColorSpace;
  backTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const backGeo = new THREE.ShapeGeometry(shape);
  const backPos = backGeo.attributes.position as THREE.BufferAttribute;
  const backUvs: number[] = [];
  for (let i = 0; i < backPos.count; i++) {
    const x = backPos.getX(i);
    const y = backPos.getY(i);
    backUvs.push(1 - (x + hw) / CARD_W, (y + hh) / CARD_H);
  }
  backGeo.setAttribute("uv", new THREE.Float32BufferAttribute(backUvs, 2));

  const backPlane = new THREE.Mesh(
    backGeo,
    new THREE.MeshBasicMaterial({
      map: backTex,
      transparent: false,
      side: THREE.BackSide,
    }),
  );
  backPlane.position.z = -CARD_D / 2 - CARD_BEVEL_T - 0.003;
  cardMesh.add(backPlane);

  function render() {
    renderer.render(scene, camera);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  }

  function dispose() {
    cardMesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        const mat = child.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else {
          mat?.dispose();
        }
      }
    });
    tex.dispose();
    backTex.dispose();
    renderer.dispose();
  }

  return { renderer, scene, camera, cardMesh, render, resize, dispose };
}
