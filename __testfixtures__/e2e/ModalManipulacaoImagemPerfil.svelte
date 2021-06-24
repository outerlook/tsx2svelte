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
