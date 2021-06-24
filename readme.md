## This was built for a specific usage
But it is public if you want to understand how to solve similiar problems.

### Purpose
This was build to migrate 650 files from React to Svelte.
The purpose is to use with something like Autohotkey and migrate the easy but slow part first, file by file.
Adjustments are made by hand.

It transforms:
```typescript jsx
// ModalManipulacao.tsx
import React from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";
import { styled } from "twin.macro";
import { Botao } from "ui/atomos/botoes/Botao";
import { arquivoEstaDentroDoLimite, TAMANHO_MAXIMO_FOTO_STRING } from "$shared/helpers/fileHelpers";
import { useIsMedia } from "utils/uiHelpers/useIsMedia";
import { Modal, modalMobileStyle, modalStyle } from "../../../ui/modal/ModalCustom";
import { BotaoFecharModalX } from "../../../ui/modal/BotaoFecharModalX";
import { SpinnerPadraoNeutro } from "../../../ui/atomos/spinners/spinners";
import { Typo } from "ui/ions/Tipografia";
import { throwErroImpossivel } from "utils/erroHelpers";
import { useTrocarFotoDePerfil } from "packages/frontend/src/API/mutations/trocarFotoDoPerfil";

const Wrapper = styled.div`
  > button {
    margin-left: auto;
  }
  .ReactCrop__image {
    max-width: 350px;
    max-height: 350px;
  }
  .ReactCrop__crop-selection {
    border-radius: 50%;
    box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.8);
  }
`;

interface Props {
  imagem: string | null;
  fecha: () => void;
}
export const ModalManipulacaoImagemPerfil: React.FC<Props> = ({ imagem, fecha }) => {
  const trocarFotoDePerfil = useTrocarFotoDePerfil();
  const imagemRef = React.useRef<HTMLImageElement>();
  const [crop, setCrop] = React.useState<Crop>({
    aspect: 1
  });

  React.useEffect(() => {
    if (imagemRef.current) {
      setCrop({
        aspect: 1,
        height: imagemRef.current && Math.min(imagemRef.current.height, imagemRef.current.width)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagemRef.current]);
  const { isPc } = useIsMedia();

  const [salvando, setSalvando] = React.useState(false);
  const handleSalvar = React.useCallback(async () => {
    if (!imagemRef.current) throw new Error("Sem imagem");
    if (!crop) throw new Error("Sem crop");
    const blobFoto = await getCroppedImg(imagemRef.current, crop as Required<Crop>);

    if (!arquivoEstaDentroDoLimite(blobFoto)) {
      toast.error("Arquivo precisa ter menos de " + TAMANHO_MAXIMO_FOTO_STRING);
      return;
    }

    setSalvando(true);
    const resultado = await trocarFotoDePerfil({
      input: { arquivo: blobFoto }
    });
    setSalvando(false);
    fecha();
  }, [crop, fecha, trocarFotoDePerfil]);

  return (
      <Modal style={isPc ? modalStyle : modalMobileStyle} onRequestClose={() => fecha()} isOpen={!!imagem}>
        <BotaoFecharModalX onClick={fecha} />
        <Typo.H4>Recorte sua foto</Typo.H4>
        <Wrapper>
          {imagem &&
          (!salvando ? (
              <>
                <ReactCrop
                    src={imagem}
                    crop={crop}
                    onChange={(crop) => setCrop(crop)}
                    onImageLoaded={(img) => {
                      imagemRef.current = img;
                    }}
                />
                <Botao onClick={handleSalvar} label="Enviar" disabled={!crop.width} />
              </>
          ) : (
              SpinnerPadraoNeutro
          ))}
        </Wrapper>
      </Modal>
  );
};

function getCroppedImg(image: HTMLImageElement, crop: Required<Crop>) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throwErroImpossivel("SCDC123w");
  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("SEM BLOB???");
      resolve(blob);
    }, "image/jpeg");
  });
}
```

into svelte files for each component + 1 utils file
```svelte
<!-- ModalManipulacao.svelte -->
<script lang='ts'>
import React from "react";
import ReactCrop, { Crop } from "react-image-crop";
import { toast } from "react-toastify";
import { Botao } from "ui/atomos/botoes/Botao";
import { arquivoEstaDentroDoLimite, TAMANHO_MAXIMO_FOTO_STRING } from "$shared/helpers/fileHelpers";
import { useIsMedia } from "utils/uiHelpers/useIsMedia";
import { Modal, modalMobileStyle, modalStyle } from "../../../ui/modal/ModalCustom";
import { BotaoFecharModalX } from "../../../ui/modal/BotaoFecharModalX";
import { SpinnerPadraoNeutro } from "../../../ui/atomos/spinners/spinners";
import { Typo } from "ui/ions/Tipografia";
import { useTrocarFotoDePerfil } from "packages/frontend/src/API/mutations/trocarFotoDoPerfil";
interface Props {
  imagem: string | null;
  fecha: () => void;
}
const trocarFotoDePerfil = useTrocarFotoDePerfil();
let imagemRef: HTMLImageElement;
let crop: Crop = {
  aspect: 1
};

$: {
  if (imagemRef) {
    crop = {
      aspect: 1,
      height: imagemRef && Math.min(imagemRef.height, imagemRef.width)
    };
  } // eslint-disable-next-line react-hooks/exhaustive-deps

}

const {
  isPc
} = useIsMedia();
let salvando = false;

const handleSalvar = async () => {
  if (!imagemRef) throw new Error("Sem imagem");
  if (!crop) throw new Error("Sem crop");
  const blobFoto = await getCroppedImg(imagemRef, (crop as Required<Crop>));

  if (!arquivoEstaDentroDoLimite(blobFoto)) {
    toast.error("Arquivo precisa ter menos de " + TAMANHO_MAXIMO_FOTO_STRING);
    return;
  }

  salvando = true;
  const resultado = await trocarFotoDePerfil({
    input: {
      arquivo: blobFoto
    }
  });
  salvando = false;
  fecha();
};
</script>
<Modal
  style={isPc ? modalStyle : modalMobileStyle}
  onRequestClose={() => fecha()}
  isOpen={!!imagem}
>
  <BotaoFecharModalX onClick={fecha} />
  <div className="H4">Recorte sua foto</div>
  <div className="wrapper">
    {#if !salvando}
      <ReactCrop
        src={imagem}
        {crop}
        onChange={(crop) => (crop = crop)}
        onImageLoaded={(img) => {
          imagemRef = img;
        }}
      />
      <Botao onClick={handleSalvar} label="Enviar" disabled={!crop.width} />
    {:else}
      SpinnerPadraoNeutro
    {/if}
  </div>
</Modal>;
<style lang='postcss'>
.wrapper {

  > button {
    margin-left: auto;
  }
  .ReactCrop__image {
    max-width: 350px;
    max-height: 350px;
  }
  .ReactCrop__crop-selection {
    border-radius: 50%;
    box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.8);
  }

}

</style>
```
and
```typescript
// modalManipulacao.ts
import React from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";
import { styled } from "twin.macro";
import { Botao } from "ui/atomos/botoes/Botao";
import { arquivoEstaDentroDoLimite, TAMANHO_MAXIMO_FOTO_STRING } from "$shared/helpers/fileHelpers";
import { useIsMedia } from "utils/uiHelpers/useIsMedia";
import { Modal, modalMobileStyle, modalStyle } from "../../../ui/modal/ModalCustom";
import { BotaoFecharModalX } from "../../../ui/modal/BotaoFecharModalX";
import { SpinnerPadraoNeutro } from "../../../ui/atomos/spinners/spinners";
import { Typo } from "ui/ions/Tipografia";
import { throwErroImpossivel } from "utils/erroHelpers";
import { useTrocarFotoDePerfil } from "packages/frontend/src/API/mutations/trocarFotoDoPerfil";
interface Props {
    imagem: string | null;
    fecha: () => void;
}

function getCroppedImg(image: HTMLImageElement, crop: Required<Crop>) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throwErroImpossivel("SCDC123w");
    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) throw new Error("SEM BLOB???");
            resolve(blob);
        }, "image/jpeg");
    });
}
```
